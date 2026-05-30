import { z } from 'zod';
import { defineCrud, defineContract, defineEvent } from 'mesh';
import {
    VendingStateSchema,
    EmailSchema,
    InventoryItemSchema,
    VendingSlotSchema,
    EmailWriteInputSchema,
    SearchInputSchema,
    MachineStockInputSchema,
    MachineSetPriceInputSchema,
    MachineCollectCashInputSchema,
    ProductMetadataSchema,
    PendingOrderSchema,
    SubAgentRunInputSchema,
    SubAgentChatInputSchema
} from './vending.schema.js';

// ─── Events ─────────────────────────────────────────────────────────────────

declare module 'mesh' {
    interface EventRegistry {
        'vending.day_advanced': { day: number; salesTotal: number };
        'vending.email_received': { id: string; subject: string };
        'vending.order_delivered': { orderId: string; day: number };
    }
}

export const vendingDayAdvancedEvent = defineEvent('vending.day_advanced', z.object({ day: z.number(), salesTotal: z.number() }));
export const vendingEmailReceivedEvent = defineEvent('vending.email_received', z.object({ id: z.string(), subject: z.string() }));
export const vendingOrderDeliveredEvent = defineEvent('vending.order_delivered', z.object({ orderId: z.string(), day: z.number() }));

// ─── CRUD ───────────────────────────────────────────────────────────────────

export const vendingStateCrud = defineCrud('vendingState', VendingStateSchema, { idField: 'id' });
export const vendingEmailCrud = defineCrud('vendingEmail', EmailSchema, { idField: 'id' });
export const vendingInventoryCrud = defineCrud('vendingInventory', InventoryItemSchema, { idField: 'id' });
export const vendingSlotCrud = defineCrud('vendingSlot', VendingSlotSchema, { idField: 'id' });
export const vendingProductMetadataCrud = defineCrud('vendingProductMeta', ProductMetadataSchema, { idField: 'id' });
export const vendingPendingOrderCrud = defineCrud('vendingPendingOrder', PendingOrderSchema, { idField: 'id' });

// ─── Tools ──────────────────────────────────────────────────────────────────

export const vendingEmailReadContract = defineContract({
    domain: 'vending',
    action: 'email_read',
    description: 'Read all emails in the inbox.',
    inputSchema: z.object({}),
    outputSchema: z.array(vendingEmailCrud.outputSchema),
    rest: { method: 'GET', path: '/vending/emails' },
    print: (output) => {
        if (output.length === 0) return "Inbox is empty.";
        return output.map(e => `[Day ${e.dayReceived}] From: ${e.from}\nSubject: ${e.subject}\n${e.body}`).join('\n\n---\n\n');
    }
});

export const vendingEmailWriteContract = defineContract({
    domain: 'vending',
    action: 'email_write',
    description: 'Send an email to a wholesaler to inquire about products or place an order. If ordering, specify product IDs and quantities.',
    inputSchema: EmailWriteInputSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
    rest: { method: 'POST', path: '/vending/emails/write' },
    timeout: 300000,
    print: (out) => out.message
});

export const vendingSearchContract = defineContract({
    domain: 'vending',
    action: 'search',
    description: 'Search for products and wholesaler contact info.',
    inputSchema: SearchInputSchema,
    outputSchema: z.object({ results: z.string() }),
    rest: { method: 'POST', path: '/vending/search' },
    timeout: 300000,
    print: (out) => out.results
});

export const vendingInventoryCheckContract = defineContract({
    domain: 'vending',
    action: 'inventory_check',
    description: 'See the current storage inventory.',
    inputSchema: z.object({}),
    outputSchema: z.array(vendingInventoryCrud.outputSchema),
    rest: { method: 'GET', path: '/vending/inventory' },
    print: (out) => {
        if (out.length === 0) return "Storage is empty.";
        return out.map(i => `${i.name} (ID: ${i.productId}) - Qty: ${i.quantity} (Wholesale Cost: $${i.wholesalePrice})`).join('\n');
    }
});

export const vendingBalanceCheckContract = defineContract({
    domain: 'vending',
    action: 'balance_check',
    description: 'Check the current money balance and current day.',
    inputSchema: z.object({}),
    outputSchema: z.object({ day: z.number(), balance: z.number() }),
    rest: { method: 'GET', path: '/vending/balance' },
    print: (out) => `Day ${out.day} - Current Balance: $${out.balance.toFixed(2)}`
});

export const vendingWaitForNextDayContract = defineContract({
    domain: 'vending',
    action: 'wait_for_next_day',
    description: 'Advance the simulation by 1 day. Process sales, deduct daily fees, deliver pending orders, and receive new emails.',
    inputSchema: z.object({}),
    outputSchema: z.object({ day: z.number(), salesTotal: z.number(), message: z.string() }),
    rest: { method: 'POST', path: '/vending/next_day' },
    print: (out) => `Advanced to Day ${out.day}. ${out.message}`
});

// Physical Tools

export const vendingMachineStockContract = defineContract({
    domain: 'vending',
    action: 'machine_stock',
    description: 'Move items from the storage inventory into a specific vending machine slot. Slots are A1-A3, B1-B3 (Small) and C1-C3, D1-D3 (Large).',
    inputSchema: MachineStockInputSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
    rest: { method: 'POST', path: '/vending/machine/stock' },
    print: (out) => out.message
});

export const vendingMachineCollectCashContract = defineContract({
    domain: 'vending',
    action: 'machine_collect_cash',
    description: 'Move earnings from the machine to the main money balance.',
    inputSchema: MachineCollectCashInputSchema,
    outputSchema: z.object({ collected: z.number(), newBalance: z.number() }),
    rest: { method: 'POST', path: '/vending/machine/collect' },
    print: (out) => `Collected $${out.collected.toFixed(2)}. New Balance: $${out.newBalance.toFixed(2)}`
});

export const vendingMachineSetPriceContract = defineContract({
    domain: 'vending',
    action: 'machine_set_price',
    description: 'Update the retail price for a specific slot.',
    inputSchema: MachineSetPriceInputSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
    rest: { method: 'POST', path: '/vending/machine/price' },
    print: (out) => out.message
});

export const vendingMachineInventoryContract = defineContract({
    domain: 'vending',
    action: 'machine_inventory',
    description: 'Check the current stock, prices, and uncollected earnings of the vending machine slots.',
    inputSchema: z.object({}),
    outputSchema: z.array(vendingSlotCrud.outputSchema),
    rest: { method: 'GET', path: '/vending/machine/inventory' },
    print: (out) => {
        return out.map(s => {
            const product = s.productId ? `${s.productName} (Qty: ${s.quantity}, Price: $${s.retailPrice.toFixed(2)})` : "EMPTY";
            return `[${s.slotId} - ${s.sizeAllowed.toUpperCase()}] ${product} | Uncollected: $${s.uncollectedEarnings.toFixed(2)}`;
        }).join('\n');
    }
});

export const vendingResetContract = defineContract({
    domain: 'vending',
    action: 'reset',
    description: 'Resets the vending game by clearing all state, inventory, emails, slots, and pending orders. Returns the simulation to Day 1.',
    inputSchema: z.object({}),
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
    rest: { method: 'POST', path: '/vending/reset' },
    print: (out) => out.message
});

// ─── Sub-Agent Delegation Tools ─────────────────────────────────────────────

export const vendingSubAgentSpecsContract = defineContract({
    domain: 'vending',
    action: 'sub_agent_specs',
    description: 'Return info about the physical operations sub-agent, including what tools it has available.',
    inputSchema: z.object({}),
    outputSchema: z.object({
        name: z.string(),
        description: z.string(),
        tools: z.array(z.object({
            name: z.string(),
            description: z.string()
        }))
    }),
    rest: { method: 'GET', path: '/vending/sub_agent/specs' },
    print: (out) => {
        const toolList = out.tools.map(t => `  - ${t.name}: ${t.description}`).join('\n');
        return `Sub-Agent: ${out.name}\n${out.description}\n\nAvailable Tools:\n${toolList}`;
    }
});

export const vendingRunSubAgentContract = defineContract({
    domain: 'vending',
    action: 'run_sub_agent',
    description: 'Give instructions to the physical operations sub-agent and execute them. The sub-agent can stock items, set prices, collect cash, and check the vending machine inventory.',
    inputSchema: SubAgentRunInputSchema,
    outputSchema: z.object({ success: z.boolean(), response: z.string() }),
    rest: { method: 'POST', path: '/vending/sub_agent/run' },
    timeout: 300000,
    print: (out) => out.response
});

export const vendingChatWithSubAgentContract = defineContract({
    domain: 'vending',
    action: 'chat_with_sub_agent',
    description: 'Ask questions to the physical operations sub-agent about what it did during the last run.',
    inputSchema: SubAgentChatInputSchema,
    outputSchema: z.object({ success: z.boolean(), response: z.string() }),
    rest: { method: 'POST', path: '/vending/sub_agent/chat' },
    timeout: 300000,
    print: (out) => out.response
});
