import { z } from 'zod';

export const VendingStateSchema = z.object({
    day: z.number().default(1),
    moneyBalance: z.number().default(500),
    dailyFee: z.number().default(2)
});
export type VendingState = z.infer<typeof VendingStateSchema>;

export const ProductMetadataSchema = z.object({
    name: z.string(),
    size: z.enum(['small', 'large']),
    wholesalePrice: z.number(),
    referencePrice: z.number(),
    priceElasticity: z.number(),
    baseSales: z.number()
});
export type ProductMetadata = z.infer<typeof ProductMetadataSchema>;

export const InventoryItemSchema = z.object({
    productId: z.string(),
    name: z.string(),
    quantity: z.number(),
    wholesalePrice: z.number()
});
export type InventoryItem = z.infer<typeof InventoryItemSchema>;

export const VendingSlotSchema = z.object({
    slotId: z.string(),
    row: z.number(),
    col: z.number(),
    sizeAllowed: z.enum(['small', 'large']),
    productId: z.string().nullable(),
    productName: z.string().nullable(),
    quantity: z.number().default(0),
    retailPrice: z.number().default(0),
    uncollectedEarnings: z.number().default(0)
});
export type VendingSlot = z.infer<typeof VendingSlotSchema>;

export const EmailSchema = z.object({
    from: z.string(),
    to: z.string(),
    subject: z.string(),
    body: z.string(),
    dayReceived: z.number()
});
export type Email = z.infer<typeof EmailSchema>;

// Input schemas for tools

export const EmailWriteInputSchema = z.object({
    to: z.string().describe("Recipient email address"),
    subject: z.string().describe("Email subject"),
    body: z.string().describe("Email body")
});

export const SearchInputSchema = z.object({
    query: z.string().describe("Search query for products or wholesalers")
});

export const MachineStockInputSchema = z.object({
    slotId: z.string().describe("Slot ID (e.g., A1, A2, A3, B1, B2, B3, C1, C2, C3, D1, D2, D3)"),
    productId: z.string().describe("ID of the product to stock from inventory"),
    quantity: z.number().describe("Quantity to move from inventory to the slot")
});

export const MachineSetPriceInputSchema = z.object({
    slotId: z.string().describe("Slot ID"),
    price: z.number().describe("Retail price to set for the slot")
});

export const MachineCollectCashInputSchema = z.object({
    slotId: z.string().optional().describe("Slot ID to collect cash from. If omitted, collects from all slots.")
});
