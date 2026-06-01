import { z } from 'zod';
import { IServiceContext } from 'mesh';
import {
    vendingEmailReadContract,
    vendingEmailWriteContract,
    vendingSearchContract,
    vendingInventoryCheckContract,
    vendingBalanceCheckContract,
    vendingWaitForNextDayContract,
    vendingMachineStockContract,
    vendingMachineCollectCashContract,
    vendingMachineSetPriceContract,
    vendingMachineInventoryContract,
    vendingResetContract,
    vendingSubAgentSpecsContract,
    vendingRunSubAgentContract,
    vendingChatWithSubAgentContract,
    vendingStateCrud,
    vendingEmailCrud,
    vendingInventoryCrud,
    vendingSlotCrud,
    vendingProductMetadataCrud,
    vendingPendingOrderCrud
} from './vending.contract.js';
import zodToJsonSchema from 'zod-to-json-schema';

// Product catalog with economics data
const PRODUCT_CATALOG = [
    { id: 'prod_soda', name: 'Cola Soda', size: 'small' as const, wholesalePrice: 0.50, referencePrice: 1.50, priceElasticity: -1.2, baseSales: 10 },
    { id: 'prod_chips', name: 'Potato Chips', size: 'large' as const, wholesalePrice: 0.75, referencePrice: 2.00, priceElasticity: -1.5, baseSales: 8 },
    { id: 'prod_candy', name: 'Chocolate Bar', size: 'small' as const, wholesalePrice: 0.40, referencePrice: 1.25, priceElasticity: -0.8, baseSales: 12 },
    { id: 'prod_water', name: 'Spring Water', size: 'large' as const, wholesalePrice: 0.30, referencePrice: 1.50, priceElasticity: -0.5, baseSales: 15 },
];

// Day-of-week multipliers (0=Mon..6=Sun)
const DAY_OF_WEEK_MULTIPLIERS = [1.0, 1.0, 1.0, 1.0, 1.1, 1.4, 1.3];

// Monthly/seasonal multipliers (index 0..11)
const MONTH_MULTIPLIERS = [0.7, 0.7, 0.85, 0.95, 1.1, 1.3, 1.3, 1.2, 1.1, 0.95, 0.8, 0.75];

// Delivery delay range in days
const DELIVERY_MIN_DAYS = 2;
const DELIVERY_MAX_DAYS = 4;

async function getState(ctx: IServiceContext) {
    const states = await ctx.call('vendingState.find', {});
    if (states.length === 0) {
        return await ctx.call('vendingState.create', {
            day: 1,
            moneyBalance: 500,
            dailyFee: 2
        });
    }
    return states[0];
}

async function ensureMachineInitialized(ctx: IServiceContext) {
    const slots = await ctx.call('vendingSlot.find', {});
    if (slots.length === 0) {
        const initialSlots = [
            { slotId: 'A1', row: 1, col: 1, sizeAllowed: 'small' as const },
            { slotId: 'A2', row: 1, col: 2, sizeAllowed: 'small' as const },
            { slotId: 'A3', row: 1, col: 3, sizeAllowed: 'small' as const },
            { slotId: 'B1', row: 2, col: 1, sizeAllowed: 'small' as const },
            { slotId: 'B2', row: 2, col: 2, sizeAllowed: 'small' as const },
            { slotId: 'B3', row: 2, col: 3, sizeAllowed: 'small' as const },
            { slotId: 'C1', row: 3, col: 1, sizeAllowed: 'large' as const },
            { slotId: 'C2', row: 3, col: 2, sizeAllowed: 'large' as const },
            { slotId: 'C3', row: 3, col: 3, sizeAllowed: 'large' as const },
            { slotId: 'D1', row: 4, col: 1, sizeAllowed: 'large' as const },
            { slotId: 'D2', row: 4, col: 2, sizeAllowed: 'large' as const },
            { slotId: 'D3', row: 4, col: 3, sizeAllowed: 'large' as const },
        ];
        for (const s of initialSlots) {
            await ctx.call('vendingSlot.create', {
                ...s,
                productId: null,
                productName: null,
                quantity: 0,
                retailPrice: 0,
                uncollectedEarnings: 0
            });
        }
    }
}

interface SupplierReplyResult {
    emailBody: string;
    isOrder: boolean;
    orderedItems?: { productId: string; quantity: number }[];
}

async function generateSupplierReply(
    agentEmail: string,
    supplierAddress: string,
    operatorBalance: number,
    ctx: IServiceContext
): Promise<SupplierReplyResult> {
    try {
        const schema = z.object({
            emailBody: z.string().describe("The realistic email reply body to send back to the vending machine operator."),
            isOrder: z.boolean().describe("Whether the incoming email from the operator is placing an order for products."),
            orderedItems: z.array(z.object({
                productId: z.string().describe("The ID of the product from the catalog (e.g., prod_soda, prod_chips, prod_candy, prod_water)."),
                quantity: z.number().int().positive().describe("The quantity of the product ordered.")
            })).optional().describe("If isOrder is true, the exact products and quantities ordered. Leave empty if isOrder is false.")
        });

        // Check if a thread for this supplier already exists
        let thread = await ctx.call('threads.find_one', {
            query: { title: `supplier_${supplierAddress}` }
        });

        if (!thread) {
            // Appen{
            thread = await ctx.call('threads.create', {
                title: `supplier_${supplierAddress}`,
                model: 'gemma4:e4b',
                autoApproveDestructiveTools: false,
                format: zodToJsonSchema(schema as any),
                metadata: {}
            });
        }


        const catalogStr = JSON.stringify(PRODUCT_CATALOG, null, 2);

        // System prompt for the supplier persona
        await ctx.call('messages.create', {
            threadId: thread.id,
            role: 'system',
            content: `You are a wholesale supplier (${supplierAddress}). Generate a realistic email reply to a vending machine operator.

Here is your product catalog:
${catalogStr}

The operator's current money balance is $${operatorBalance.toFixed(2)}.

If the operator is inquiring about products, list what you offer from the catalog.
If the operator is placing an order:
- Verify that the ordered product IDs match the catalog.
- If their balance is sufficient, confirm the order, summarize what was ordered, and state that delivery takes 2-3 business days.
- If their balance is insufficient, politely decline the order.
- IMPORTANT: You MUST populate the 'orderedItems' JSON array with the correct IDs and quantities.`
        });
        // User message with the agent's email
        await ctx.call('messages.create', {
            threadId: thread.id,
            role: 'user',
            content: agentEmail
        });

        // Run inference (no tools, just text completion)
        const result = await ctx.call('infer.chat', { threadId: thread.id }, { timeout: 5 * 60 * 1000 });

        // Get the assistant's reply
        const message = await ctx.call('messages.get', {
            id: result.messageId
        });

        const json = schema.parse(JSON.parse(message.content));

        return {
            emailBody: json.emailBody,
            isOrder: json.isOrder,
            orderedItems: json.orderedItems?.map(item => ({
                productId: item.productId as string,
                quantity: item.quantity as number
            }))
        };

    } catch (e: any) {
        console.error('[vending_email_write] AI reply generation failed:', e.message);
        // Fallback to catalog response
        return {
            emailBody: `Hello, we offer the following products:\n${PRODUCT_CATALOG.map(p => `- ${p.name} (ID: ${p.id}, Size: ${p.size}, Cost: $${p.wholesalePrice.toFixed(2)})`).join('\n')}\n\nPlease reply specifying the product IDs and quantities you wish to order.`,
            isOrder: false
        };
    }
}

// ─── Tool Implementations ───────────────────────────────────────────────────

export async function vending_email_read(
    input: z.infer<typeof vendingEmailReadContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingEmailReadContract.outputSchema>> {
    return await ctx.call('vendingEmail.find', {});
}

export async function vending_email_write(
    input: z.infer<typeof vendingEmailWriteContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingEmailWriteContract.outputSchema>> {
    const state = await getState(ctx);

    if (input.to == 'sales@wholesale.com') {
        throw new Error('This email address is not valid');
    }

    // Save the outgoing email
    await ctx.call('vendingEmail.create', {
        from: 'agent@vending-machine.com',
        to: input.to,
        subject: input.subject,
        body: input.body,
        dayReceived: state.day
    });

    // 1. Get the structured reply from the supplier LLM
    const reply = await generateSupplierReply(input.body, input.to, state.moneyBalance, ctx);

    // 2. Process order if LLM determined it's a valid order
    if (reply.isOrder && reply.orderedItems && reply.orderedItems.length > 0) {
        let totalCost = 0;
        const itemsToDeliver: { product: typeof PRODUCT_CATALOG[0]; qty: number; cost: number }[] = [];

        for (const item of reply.orderedItems) {
            const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
            if (product) {
                const cost = product.wholesalePrice * item.quantity;
                totalCost += cost;
                itemsToDeliver.push({ product, qty: item.quantity, cost });
            }
        }

        if (itemsToDeliver.length === 0) {
            await ctx.call('vendingEmail.create', {
                from: input.to,
                to: 'agent@vending-machine.com',
                subject: `RE: ${input.subject}`,
                body: `Order failed. We could not find any of the product IDs you requested in our catalog.`,
                dayReceived: state.day
            });
            return { success: false, message: `Order failed. Invalid product IDs.` };
        }

        if (totalCost > state.moneyBalance) {
            await ctx.call('vendingEmail.create', {
                from: input.to,
                to: 'agent@vending-machine.com',
                subject: `RE: ${input.subject}`,
                body: reply.emailBody, // Polite declination generated by LLM (or fallback)
                dayReceived: state.day
            });
            return { success: false, message: `Order declined due to insufficient funds.` };
        }

        // Deduct money immediately
        await ctx.call('vendingState.update', {
            id: state.id,
            moneyBalance: state.moneyBalance - totalCost
        });

        // Create a pending order with delayed delivery
        const deliveryDelay = DELIVERY_MIN_DAYS + Math.floor(Math.random() * (DELIVERY_MAX_DAYS - DELIVERY_MIN_DAYS + 1));
        const estimatedDay = state.day + deliveryDelay;

        await ctx.call('vendingPendingOrder.create', {
            supplierEmail: input.to,
            items: itemsToDeliver.map(i => ({
                productId: i.product.id,
                name: i.product.name,
                size: i.product.size,
                quantity: i.qty,
                wholesalePrice: i.product.wholesalePrice
            })),
            totalCost,
            orderedOnDay: state.day,
            estimatedDeliveryDay: estimatedDay,
            delivered: false
        });

        // Send order confirmation email generated by the LLM
        await ctx.call('vendingEmail.create', {
            from: input.to,
            to: 'agent@vending-machine.com',
            subject: `RE: ${input.subject}`,
            body: reply.emailBody,
            dayReceived: state.day
        });

        return { success: true, message: `Order placed. $${totalCost.toFixed(2)} deducted. Estimated delivery on Day ${estimatedDay}.` };

    } else {
        // Not an order (e.g. inquiry, regular message) — save the LLM-generated reply
        await ctx.call('vendingEmail.create', {
            from: input.to,
            to: 'agent@vending-machine.com',
            subject: `RE: ${input.subject}`,
            body: reply.emailBody,
            dayReceived: state.day
        });
        return { success: true, message: `Email sent to ${input.to}.` };
    }
}

export async function vending_search(
    input: z.infer<typeof vendingSearchContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingSearchContract.outputSchema>> {
    try {
        let rawResultsStr = "";
        try {
            const searxngUrl = `http://192.168.1.9:8081/search?q=${encodeURIComponent(input.query)}&format=json`;
            const response = await fetch(searxngUrl);
            if (response.ok) {
                const data: any = await response.json();
                if (data.results && data.results.length > 0) {
                    rawResultsStr = data.results.slice(0, 5).map((r: any, i: number) => {
                        const title = r.title || "No title";
                        const content = r.content || r.snippet || "No description available";
                        const url = r.url || "No URL";
                        return `Result #${i + 1}: ${title}\nDescription: ${content}\nLink: ${url}`;
                    }).join('\n\n');
                }
            }
        } catch (fetchErr: any) {
            console.error('[vending_search] Searxng query failed:', fetchErr.message);
        }

        if (!rawResultsStr) {
            rawResultsStr = 'No search results found.';
        }

        // Create temporary translation thread
        const translationThread = await ctx.call('threads.create', {
            title: `search_translation_${Date.now()}`,
            model: 'gemma4:e4b',
            autoApproveDestructiveTools: false,
            metadata: {}
        });

        const systemPrompt = `You are a Search Translation Assistant for a Vending Machine Operator simulation game.
Your task is to take the raw web search results and translate them into a cleanly formatted, actionable list for the operator agent.

Here is the official catalog for the game:
  • Cola Soda (ID: prod_soda, Wholesale Cost: $0.50, Size: small)
  • Potato Chips (ID: prod_chips, Wholesale Cost: $0.75, Size: large)
  • Chocolate Bar (ID: prod_candy, Wholesale Cost: $0.40, Size: small)
  • Spring Water (ID: prod_water, Wholesale Cost: $0.30, Size: large)

For each raw search result, output exactly this format:
**Result #[number]**
- Supplier: [Name of the company/supplier from the result]
- Contact Email: [Constructed email address based on the result's URL domain (e.g., sales@exosweet.com, wholesale@goldeneagledistributors.com). Strip any "www." from the domain.]
- Mapped Product ID: [The game catalog ID that matches the result (e.g., prod_soda). If no match, write N/A]
- Description: [A concise, professional 1-sentence summary of what they offer based on the snippet]
- Link: [The exact URL from the result]

Rules:
1. ONLY output the formatted list. Do not add any conversational filler before or after.
2. Ensure every single result includes the Description and Link.
3. You must construct a realistic email address using the domain name from the link for every result.`;

        await ctx.call('messages.create', {
            threadId: translationThread.id,
            role: 'system',
            content: systemPrompt
        });

        await ctx.call('messages.create', {
            threadId: translationThread.id,
            role: 'user',
            content: `Raw Search Results for "${input.query}":\n\n${rawResultsStr}`
        });

        const translationResult = await ctx.call('infer.chat', {
            threadId: translationThread.id
        }, { timeout: 5 * 60 * 1000 });

        const translationMessage = await ctx.call('messages.get', {
            id: translationResult.messageId
        });

        return { results: translationMessage.content || rawResultsStr };

    } catch (e: any) {
        return {
            results: `Search failed: ${e.message}. Please try again later or check the search service.`
        };
    }
}

export async function vending_inventory_check(
    input: z.infer<typeof vendingInventoryCheckContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingInventoryCheckContract.outputSchema>> {
    return await ctx.call('vendingInventory.find', {});
}

export async function vending_balance_check(
    input: z.infer<typeof vendingBalanceCheckContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingBalanceCheckContract.outputSchema>> {
    const state = await getState(ctx);
    return { day: state.day, balance: state.moneyBalance };
}

export async function vending_wait_for_next_day(
    input: z.infer<typeof vendingWaitForNextDayContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingWaitForNextDayContract.outputSchema>> {
    const state = await getState(ctx);
    await ensureMachineInitialized(ctx);

    const newDay = state.day + 1;
    let newBalance = state.moneyBalance - state.dailyFee;
    let salesTotal = 0;
    const messages: string[] = [`Daily fee of $${state.dailyFee.toFixed(2)} deducted.`];

    // ── Phase 1: Deliver pending orders ──
    const pendingOrders = await ctx.call('vendingPendingOrder.find', { query: { delivered: false } });
    for (const order of pendingOrders) {
        if (order.estimatedDeliveryDay <= newDay) {
            // Add items to inventory
            for (const item of order.items) {
                const existing = await ctx.call('vendingInventory.find_one', { query: { productId: item.productId } });
                if (existing) {
                    await ctx.call('vendingInventory.update', {
                        id: existing.id,
                        quantity: existing.quantity + item.quantity
                    });
                } else {
                    await ctx.call('vendingInventory.create', {
                        productId: item.productId,
                        name: item.name,
                        quantity: item.quantity,
                        wholesalePrice: item.wholesalePrice
                    });
                }
            }

            // Mark delivered
            await ctx.call('vendingPendingOrder.update', { id: order.id, delivered: true });

            // Send delivery notification email
            const itemNames = order.items.map((i: any) => `${i.name} x${i.quantity}`).join(', ');
            await ctx.call('vendingEmail.create', {
                from: order.supplierEmail,
                to: 'agent@vending-machine.com',
                subject: 'Order Delivered',
                body: `Your order has been delivered and is now available in your inventory.\nItems: ${itemNames}`,
                dayReceived: newDay
            });

            ctx.emit('vending.order_delivered', { orderId: order.id, day: newDay });
            messages.push(`Order from ${order.supplierEmail} delivered (${itemNames}).`);
        }
    }

    // ── Phase 2: Simulate customer purchases with enhanced model ──
    const slots = await ctx.call('vendingSlot.find', {});

    // Day-of-week multiplier
    const dayOfWeek = ((newDay - 1) % 7);
    const dayMultiplier = DAY_OF_WEEK_MULTIPLIERS[dayOfWeek];

    // Monthly/seasonal multiplier (30-day months)
    const month = Math.floor((newDay - 1) / 30) % 12;
    const monthMultiplier = MONTH_MULTIPLIERS[month];

    // Choice multiplier: rewards product variety, penalizes none or excess
    const uniqueProducts = new Set(slots.filter(s => s.productId && s.quantity > 0).map(s => s.productId));
    const varietyCount = uniqueProducts.size;
    const choiceMultiplier = Math.max(0.5, Math.min(1.2, 0.6 + (varietyCount * 0.15)));

    for (const slot of slots) {
        if (slot.quantity > 0 && slot.productId && slot.retailPrice > 0) {
            const product = PRODUCT_CATALOG.find(p => p.id === slot.productId);
            if (product) {
                // Price elasticity demand factor
                const priceDiff = (slot.retailPrice - product.referencePrice) / product.referencePrice;
                const demandFactor = Math.max(0, 1 + (priceDiff * product.priceElasticity));

                // Random noise (0.8 to 1.2)
                const noise = 0.8 + (Math.random() * 0.4);

                // Combined sales calculation
                let simulatedSales = Math.round(
                    product.baseSales * demandFactor * dayMultiplier * monthMultiplier * choiceMultiplier * noise
                );
                simulatedSales = Math.min(simulatedSales, slot.quantity);
                simulatedSales = Math.max(0, simulatedSales);

                if (simulatedSales > 0) {
                    const revenue = simulatedSales * slot.retailPrice;
                    salesTotal += revenue;
                    await ctx.call('vendingSlot.update', {
                        id: slot.id,
                        quantity: slot.quantity - simulatedSales,
                        uncollectedEarnings: slot.uncollectedEarnings + revenue
                    });
                }
            }
        }
    }

    await ctx.call('vendingState.update', {
        id: state.id,
        day: newDay,
        moneyBalance: newBalance
    });

    messages.push(`Simulated customer purchases generated $${salesTotal.toFixed(2)} in uncollected earnings.`);

    return {
        day: newDay,
        salesTotal,
        message: messages.join(' ')
    };
}

// ─── Physical Machine Tools ─────────────────────────────────────────────────

export async function vending_machine_stock(
    input: z.infer<typeof vendingMachineStockContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingMachineStockContract.outputSchema>> {
    await ensureMachineInitialized(ctx);

    const slot = await ctx.call('vendingSlot.find_one', { query: { slotId: input.slotId } });
    if (!slot) return { success: false, message: `Slot ${input.slotId} not found.` };

    const inventory = await ctx.call('vendingInventory.find_one', { query: { productId: input.productId } });
    if (!inventory || inventory.quantity < input.quantity) {
        return { success: false, message: `Insufficient inventory of ${input.productId}.` };
    }

    const productDef = PRODUCT_CATALOG.find(p => p.id === input.productId);
    if (!productDef) return { success: false, message: `Unknown product ID ${input.productId}.` };

    if (slot.sizeAllowed !== productDef.size) {
        return { success: false, message: `Size mismatch. Slot ${slot.slotId} only accepts ${slot.sizeAllowed} items, but ${productDef.name} is ${productDef.size}.` };
    }

    if (slot.productId && slot.productId !== input.productId && slot.quantity > 0) {
        return { success: false, message: `Slot ${slot.slotId} already contains ${slot.productName}. Please use an empty slot or collect/remove old stock.` };
    }

    await ctx.call('vendingInventory.update', { id: inventory.id, quantity: inventory.quantity - input.quantity });
    await ctx.call('vendingSlot.update', {
        id: slot.id,
        productId: productDef.id,
        productName: productDef.name,
        quantity: slot.quantity + input.quantity
    });

    return { success: true, message: `Stocked ${input.quantity} of ${productDef.name} in slot ${slot.slotId}.` };
}

export async function vending_machine_collect_cash(
    input: z.infer<typeof vendingMachineCollectCashContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingMachineCollectCashContract.outputSchema>> {
    const state = await getState(ctx);
    await ensureMachineInitialized(ctx);
    let totalCollected = 0;
    const filter = input.slotId ? { slotId: input.slotId } : {};
    const slots = await ctx.call('vendingSlot.find', { query: filter });
    for (const slot of slots) {
        if (slot.uncollectedEarnings > 0) {
            totalCollected += slot.uncollectedEarnings;
            await ctx.call('vendingSlot.update', { id: slot.id, uncollectedEarnings: 0 });
        }
    }
    const newBalance = state.moneyBalance + totalCollected;
    await ctx.call('vendingState.update', { id: state.id, moneyBalance: newBalance });
    return { collected: totalCollected, newBalance };
}

export async function vending_machine_set_price(
    input: z.infer<typeof vendingMachineSetPriceContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingMachineSetPriceContract.outputSchema>> {
    await ensureMachineInitialized(ctx);
    const slot = await ctx.call('vendingSlot.find_one', { query: { slotId: input.slotId } });
    if (!slot) return { success: false, message: `Slot ${input.slotId} not found.` };
    await ctx.call('vendingSlot.update', { id: slot.id, retailPrice: input.price });
    return { success: true, message: `Price for slot ${slot.slotId} set to $${input.price.toFixed(2)}.` };
}

export async function vending_machine_inventory(
    input: z.infer<typeof vendingMachineInventoryContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingMachineInventoryContract.outputSchema>> {
    await ensureMachineInitialized(ctx);
    return await ctx.call('vendingSlot.find', {});
}

// ─── Reset ──────────────────────────────────────────────────────────────────

export async function vending_reset(
    input: z.infer<typeof vendingResetContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingResetContract.outputSchema>> {
    const collections = ['vendingState', 'vendingSlot', 'vendingInventory', 'vendingEmail', 'vendingPendingOrder'] as const;
    for (const col of collections) {
        const items = await ctx.call(`${col}.find` as any, {});
        for (const item of items as any[]) {
            await ctx.call(`${col}.delete` as any, { id: item.id });
        }
    }
    return { success: true, message: 'Vending game has been completely reset.' };
}

// ─── Sub-Agent Delegation Tools ─────────────────────────────────────────────

const SUB_AGENT_TOOLS = [
    { name: 'vending.machine_stock', description: 'Move items from storage inventory into a vending machine slot.' },
    { name: 'vending.machine_set_price', description: 'Set the retail price for a slot.' },
    { name: 'vending.machine_collect_cash', description: 'Collect earnings from the machine.' },
    { name: 'vending.machine_inventory', description: 'Check the vending machine slot inventory.' },
];

export async function vending_sub_agent_specs(
    input: z.infer<typeof vendingSubAgentSpecsContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingSubAgentSpecsContract.outputSchema>> {
    return {
        name: 'Vending Machine Operator',
        description: 'A physical operations sub-agent that can interact with the vending machine hardware. It can stock products, set prices, collect cash, and check the machine inventory.',
        tools: SUB_AGENT_TOOLS
    };
}

async function ensureSubAgent(ctx: IServiceContext): Promise<{ agentId: string; threadId: string }> {
    const state = await getState(ctx);

    if (state.subAgentId && state.subAgentThreadId) {
        return { agentId: state.subAgentId, threadId: state.subAgentThreadId };
    }

    // Create the sub-agent
    const agent = await ctx.call('agent.create', {
        name: 'vending_operator',
        systemPrompt: `You are a vending machine operator sub-agent. You have physical access to the vending machine.
Your job is to follow instructions from the main agent to stock items, set prices, collect cash, and report on machine status.
Use your tools to complete the requested tasks. Be concise in your responses and report what you did.`,
        model: 'gemma4:e4b',
        config: { temperature: 0.3 },
        tools: SUB_AGENT_TOOLS.map(t => t.name),
        metadata: {}
    });

    const thread = await ctx.call('threads.create', {
        title: 'vending_operator_thread',
        model: 'gemma4:e4b',
        autoApproveDestructiveTools: false,
        metadata: {}
    });

    await ctx.call('vendingState.update', {
        id: state.id,
        subAgentId: agent.id,
        subAgentThreadId: thread.id
    });

    return { agentId: agent.id, threadId: thread.id };
}

async function getLatestAssistantMessage(threadId: string, ctx: IServiceContext): Promise<string> {
    const messages = await ctx.call('messages.find', { query: { threadId, role: 'assistant' } });
    if (messages.length === 0) return 'Sub-agent completed the task but did not provide a response.';
    return messages[messages.length - 1].content || 'Task completed.';
}

export async function vending_run_sub_agent(
    input: z.infer<typeof vendingRunSubAgentContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingRunSubAgentContract.outputSchema>> {
    try {
        const { agentId, threadId } = await ensureSubAgent(ctx);
        await ctx.call('agent.run', {
            agentId,
            threadId,
            autoApprove: true,
            prompt: input.instructions,
            wait: true
        }, { timeout: 5 * 60 * 1000 });
        const response = await getLatestAssistantMessage(threadId, ctx);
        return { success: true, response };
    } catch (e: any) {
        return { success: false, response: `Sub-agent execution failed: ${e.message}` };
    }
}

export async function vending_chat_with_sub_agent(
    input: z.infer<typeof vendingChatWithSubAgentContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingChatWithSubAgentContract.outputSchema>> {
    try {
        const { agentId, threadId } = await ensureSubAgent(ctx);
        await ctx.call('agent.run', {
            agentId,
            threadId,
            autoApprove: false,
            prompt: input.message,
            wait: true
        }, { timeout: 5 * 60 * 1000 });
        const response = await getLatestAssistantMessage(threadId, ctx);
        return { success: true, response };
    } catch (e: any) {
        return { success: false, response: `Chat with sub-agent failed: ${e.message}` };
    }
}
