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
    vendingStateCrud,
    vendingEmailCrud,
    vendingInventoryCrud,
    vendingSlotCrud,
    vendingProductMetadataCrud
} from './vending.contract.js';

// Mock product catalog
const MOCK_CATALOG = [
    { id: 'prod_soda', name: 'Cola Soda', size: 'small' as const, wholesalePrice: 0.50, referencePrice: 1.50, priceElasticity: -1.2, baseSales: 10 },
    { id: 'prod_chips', name: 'Potato Chips', size: 'large' as const, wholesalePrice: 0.75, referencePrice: 2.00, priceElasticity: -1.5, baseSales: 8 },
    { id: 'prod_candy', name: 'Chocolate Bar', size: 'small' as const, wholesalePrice: 0.40, referencePrice: 1.25, priceElasticity: -0.8, baseSales: 12 },
    { id: 'prod_water', name: 'Spring Water', size: 'large' as const, wholesalePrice: 0.30, referencePrice: 1.50, priceElasticity: -0.5, baseSales: 15 },
];

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

export async function vending_email_read(
    input: z.infer<typeof vendingEmailReadContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingEmailReadContract.outputSchema>> {
    return await ctx.call('vendingEmail.find', {});
};

export async function vending_email_write(
    input: z.infer<typeof vendingEmailWriteContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingEmailWriteContract.outputSchema>> {
    const state = await getState(ctx);
    
    // Save the outgoing email that the agent writes
    await ctx.call('vendingEmail.create', {
        from: 'agent@vending-machine.com',
        to: input.to,
        subject: input.subject,
        body: input.body,
        dayReceived: state.day
    });
    
    // Process outgoing email
    if (input.to.toLowerCase() === 'wholesale@vending-supply.com') {
        const orderMatch = input.body.match(/ORDER\s+([\w_]+)\s+(\d+)/gi);
        let replyBody = "";
        
        if (orderMatch && orderMatch.length > 0) {
            let totalCost = 0;
            const itemsToDeliver: any[] = [];
            
            for (const match of orderMatch) {
                const parts = match.split(/\s+/);
                const prodId = parts[1];
                const qty = parseInt(parts[2], 10);
                
                const product = MOCK_CATALOG.find(p => p.id === prodId);
                if (product) {
                    const cost = product.wholesalePrice * qty;
                    totalCost += cost;
                    itemsToDeliver.push({ product, qty, cost });
                }
            }
            
            if (totalCost > state.moneyBalance) {
                replyBody = `Order declined. Insufficient funds. Your balance is $${state.moneyBalance.toFixed(2)}, but the order costs $${totalCost.toFixed(2)}.`;
            } else if (itemsToDeliver.length > 0) {
                // Process order
                await ctx.call('vendingState.update', {
                    id: state.id,
                    moneyBalance: state.moneyBalance - totalCost
                });
                
                for (const item of itemsToDeliver) {
                    const existing = await ctx.call('vendingInventory.find_one', { query: { productId: item.product.id } });
                    if (existing) {
                        await ctx.call('vendingInventory.update', {
                            id: existing.id,
                            quantity: existing.quantity + item.qty
                        });
                    } else {
                        await ctx.call('vendingInventory.create', {
                            productId: item.product.id,
                            name: item.product.name,
                            quantity: item.qty,
                            wholesalePrice: item.product.wholesalePrice
                        });
                    }
                }
                replyBody = `Order accepted. Deducted $${totalCost.toFixed(2)} from your account. Items have been added to your inventory.`;
            } else {
                replyBody = `Order failed. Invalid product IDs.`;
            }
        } else {
            replyBody = `Hello, we offer the following products:
${MOCK_CATALOG.map(p => `- ${p.name} (ID: ${p.id}, Size: ${p.size}, Cost: $${p.wholesalePrice.toFixed(2)})`).join('\n')}

To order, please reply with the exact format on a new line for each item:
ORDER <productId> <quantity>`;
        }

        // Mock a delayed reply by adding to inbox for the next day? 
        // For simplicity, we just put it in the inbox immediately or with dayReceived = state.day
        await ctx.call('vendingEmail.create', {
            from: 'wholesale@vending-supply.com',
            to: 'agent@vending-machine.com',
            subject: `RE: ${input.subject}`,
            body: replyBody,
            dayReceived: state.day
        });
    }

    return { success: true, message: `Email sent to ${input.to}.` };
};

export async function vending_search(
    input: z.infer<typeof vendingSearchContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingSearchContract.outputSchema>> {
    try {
        const searxngUrl = `http://192.168.1.9:8081/search?q=${encodeURIComponent(input.query)}&format=json`;
        const response = await fetch(searxngUrl);
        if (!response.ok) {
            throw new Error(`Searxng responded with status ${response.status}`);
        }
        const data: any = await response.json();

        let resultsStr = `Top Search Results for "${input.query}":\n`;
        if (data.results && data.results.length > 0) {
            resultsStr += data.results.slice(0, 5).map((r: any, i: number) => {
                const title = r.title || "No title";
                const content = r.content || r.snippet || "No description available";
                const url = r.url || "No URL";
                return `${i + 1}. ${title}\n   ${content}\n   ${url}`;
            }).join('\n\n');
        } else {
            resultsStr += 'No results found.';
        }

        return { results: resultsStr };
    } catch (e: any) {
        return {
            results: `Search failed: ${e.message}. Please try again later or check the search service.`
        };
    }
};

export async function vending_inventory_check(
    input: z.infer<typeof vendingInventoryCheckContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingInventoryCheckContract.outputSchema>> {
    return await ctx.call('vendingInventory.find', {});
};

export async function vending_balance_check(
    input: z.infer<typeof vendingBalanceCheckContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingBalanceCheckContract.outputSchema>> {
    const state = await getState(ctx);
    return { day: state.day, balance: state.moneyBalance };
};

export async function vending_wait_for_next_day(
    input: z.infer<typeof vendingWaitForNextDayContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingWaitForNextDayContract.outputSchema>> {
    const state = await getState(ctx);
    await ensureMachineInitialized(ctx);
    
    // Deduct daily fee
    let newBalance = state.moneyBalance - state.dailyFee;
    let salesTotal = 0;
    
    // Process Sales
    const slots = await ctx.call('vendingSlot.find', {});
    for (const slot of slots) {
        if (slot.quantity > 0 && slot.productId && slot.retailPrice > 0) {
            const product = MOCK_CATALOG.find(p => p.id === slot.productId);
            if (product) {
                // Simple economic model:
                // If retail price > reference price, sales go down based on elasticity.
                const priceDiff = (slot.retailPrice - product.referencePrice) / product.referencePrice;
                const demandFactor = Math.max(0, 1 + (priceDiff * product.priceElasticity));
                
                // Add some random noise
                const noise = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
                
                let simulatedSales = Math.round(product.baseSales * demandFactor * noise);
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
    
    const newDay = state.day + 1;
    await ctx.call('vendingState.update', {
        id: state.id,
        day: newDay,
        moneyBalance: newBalance
    });

    return { 
        day: newDay, 
        salesTotal,
        message: `Daily fee of $${state.dailyFee.toFixed(2)} deducted. Simulated customer purchases generated $${salesTotal.toFixed(2)} in uncollected earnings.`
    };
};

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
    
    const productDef = MOCK_CATALOG.find(p => p.id === input.productId);
    if (!productDef) return { success: false, message: `Unknown product ID ${input.productId}.` };
    
    if (slot.sizeAllowed !== productDef.size) {
        return { success: false, message: `Size mismatch. Slot ${slot.slotId} only accepts ${slot.sizeAllowed} items, but ${productDef.name} is ${productDef.size}.` };
    }
    
    if (slot.productId && slot.productId !== input.productId && slot.quantity > 0) {
        return { success: false, message: `Slot ${slot.slotId} already contains ${slot.productName}. Please use an empty slot or collect/remove old stock.` };
    }

    // Deduct from inventory
    await ctx.call('vendingInventory.update', {
        id: inventory.id,
        quantity: inventory.quantity - input.quantity
    });
    
    // Add to slot
    await ctx.call('vendingSlot.update', {
        id: slot.id,
        productId: productDef.id,
        productName: productDef.name,
        quantity: slot.quantity + input.quantity
    });

    return { success: true, message: `Stocked ${input.quantity} of ${productDef.name} in slot ${slot.slotId}.` };
};

export async function vending_machine_collect_cash(
    input: z.infer<typeof vendingMachineCollectCashContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingMachineCollectCashContract.outputSchema>> {
    const state = await getState(ctx);
    await ensureMachineInitialized(ctx);
    
    let totalCollected = 0;
    
    const filter = input.slotId ? { id: input.slotId } : {};
    const slots = await ctx.call('vendingSlot.find', { query: filter });
    
    for (const slot of slots) {
        if (slot.uncollectedEarnings > 0) {
            totalCollected += slot.uncollectedEarnings;
            await ctx.call('vendingSlot.update', {
                id: slot.id,
                uncollectedEarnings: 0
            });
        }
    }
    
    const newBalance = state.moneyBalance + totalCollected;
    await ctx.call('vendingState.update', {
        id: state.id,
        moneyBalance: newBalance
    });
    
    return { collected: totalCollected, newBalance };
};

export async function vending_machine_set_price(
    input: z.infer<typeof vendingMachineSetPriceContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingMachineSetPriceContract.outputSchema>> {
    await ensureMachineInitialized(ctx);
    const slot = await ctx.call('vendingSlot.find_one', { query: { slotId: input.slotId } });
    if (!slot) return { success: false, message: `Slot ${input.slotId} not found.` };
    
    await ctx.call('vendingSlot.update', {
        id: slot.id,
        retailPrice: input.price
    });
    
    return { success: true, message: `Price for slot ${slot.slotId} set to $${input.price.toFixed(2)}.` };
};

export async function vending_machine_inventory(
    input: z.infer<typeof vendingMachineInventoryContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingMachineInventoryContract.outputSchema>> {
    await ensureMachineInitialized(ctx);
    return await ctx.call('vendingSlot.find', {});
};

export async function vending_reset(
    input: z.infer<typeof vendingResetContract.inputSchema>,
    ctx: IServiceContext
): Promise<z.infer<typeof vendingResetContract.outputSchema>> {
    // Delete all states
    const states = await ctx.call('vendingState.find', {});
    for (const state of states) {
        await ctx.call('vendingState.delete', { id: state.id });
    }

    // Delete all slots
    const slots = await ctx.call('vendingSlot.find', {});
    for (const slot of slots) {
        await ctx.call('vendingSlot.delete', { id: slot.id });
    }

    // Delete all inventory items
    const inventory = await ctx.call('vendingInventory.find', {});
    for (const item of inventory) {
        await ctx.call('vendingInventory.delete', { id: item.id });
    }

    // Delete all emails
    const emails = await ctx.call('vendingEmail.find', {});
    for (const email of emails) {
        await ctx.call('vendingEmail.delete', { id: email.id });
    }

    return { success: true, message: 'Vending game has been completely reset.' };
};
