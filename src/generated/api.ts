// GENERATED FILE - DO NOT EDIT
import { z } from 'zod';

// External Type Includes
import '@flybyme/mesh-agents';
import * as Contract_0 from '../vending/vending.contract.js';

declare global {
    interface IServiceToolRegistry {
        'vending.email_read': { params: z.input<typeof Contract_0.vendingEmailReadContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingEmailReadContract['outputSchema']> };
        'vending.email_write': { params: z.input<typeof Contract_0.vendingEmailWriteContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingEmailWriteContract['outputSchema']> };
        'vending.search': { params: z.input<typeof Contract_0.vendingSearchContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingSearchContract['outputSchema']> };
        'vending.inventory_check': { params: z.input<typeof Contract_0.vendingInventoryCheckContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingInventoryCheckContract['outputSchema']> };
        'vending.balance_check': { params: z.input<typeof Contract_0.vendingBalanceCheckContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingBalanceCheckContract['outputSchema']> };
        'vending.wait_for_next_day': { params: z.input<typeof Contract_0.vendingWaitForNextDayContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingWaitForNextDayContract['outputSchema']> };
        'vending.machine_stock': { params: z.input<typeof Contract_0.vendingMachineStockContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingMachineStockContract['outputSchema']> };
        'vending.machine_collect_cash': { params: z.input<typeof Contract_0.vendingMachineCollectCashContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingMachineCollectCashContract['outputSchema']> };
        'vending.machine_set_price': { params: z.input<typeof Contract_0.vendingMachineSetPriceContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingMachineSetPriceContract['outputSchema']> };
        'vending.machine_inventory': { params: z.input<typeof Contract_0.vendingMachineInventoryContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingMachineInventoryContract['outputSchema']> };
        'vending.reset': { params: z.input<typeof Contract_0.vendingResetContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingResetContract['outputSchema']> };
        'vending.sub_agent_specs': { params: z.input<typeof Contract_0.vendingSubAgentSpecsContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingSubAgentSpecsContract['outputSchema']> };
        'vending.run_sub_agent': { params: z.input<typeof Contract_0.vendingRunSubAgentContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingRunSubAgentContract['outputSchema']> };
        'vending.chat_with_sub_agent': { params: z.input<typeof Contract_0.vendingChatWithSubAgentContract['inputSchema']>, returns: z.infer<typeof Contract_0.vendingChatWithSubAgentContract['outputSchema']> };
        'vendingState.create': { params: z.input<typeof Contract_0.vendingStateCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingStateCrud['create']['outputSchema']> };
        'vendingState.find': { params: z.input<typeof Contract_0.vendingStateCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingStateCrud['find']['outputSchema']> };
        'vendingState.find_one': { params: z.input<typeof Contract_0.vendingStateCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingStateCrud['findOne']['outputSchema']> };
        'vendingState.count': { params: z.input<typeof Contract_0.vendingStateCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingStateCrud['count']['outputSchema']> };
        'vendingState.get': { params: z.input<typeof Contract_0.vendingStateCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingStateCrud['get']['outputSchema']> };
        'vendingState.update': { params: z.input<typeof Contract_0.vendingStateCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingStateCrud['update']['outputSchema']> };
        'vendingState.delete': { params: z.input<typeof Contract_0.vendingStateCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingStateCrud['delete']['outputSchema']> };
        'vendingEmail.create': { params: z.input<typeof Contract_0.vendingEmailCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingEmailCrud['create']['outputSchema']> };
        'vendingEmail.find': { params: z.input<typeof Contract_0.vendingEmailCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingEmailCrud['find']['outputSchema']> };
        'vendingEmail.find_one': { params: z.input<typeof Contract_0.vendingEmailCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingEmailCrud['findOne']['outputSchema']> };
        'vendingEmail.count': { params: z.input<typeof Contract_0.vendingEmailCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingEmailCrud['count']['outputSchema']> };
        'vendingEmail.get': { params: z.input<typeof Contract_0.vendingEmailCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingEmailCrud['get']['outputSchema']> };
        'vendingEmail.update': { params: z.input<typeof Contract_0.vendingEmailCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingEmailCrud['update']['outputSchema']> };
        'vendingEmail.delete': { params: z.input<typeof Contract_0.vendingEmailCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingEmailCrud['delete']['outputSchema']> };
        'vendingInventory.create': { params: z.input<typeof Contract_0.vendingInventoryCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingInventoryCrud['create']['outputSchema']> };
        'vendingInventory.find': { params: z.input<typeof Contract_0.vendingInventoryCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingInventoryCrud['find']['outputSchema']> };
        'vendingInventory.find_one': { params: z.input<typeof Contract_0.vendingInventoryCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingInventoryCrud['findOne']['outputSchema']> };
        'vendingInventory.count': { params: z.input<typeof Contract_0.vendingInventoryCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingInventoryCrud['count']['outputSchema']> };
        'vendingInventory.get': { params: z.input<typeof Contract_0.vendingInventoryCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingInventoryCrud['get']['outputSchema']> };
        'vendingInventory.update': { params: z.input<typeof Contract_0.vendingInventoryCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingInventoryCrud['update']['outputSchema']> };
        'vendingInventory.delete': { params: z.input<typeof Contract_0.vendingInventoryCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingInventoryCrud['delete']['outputSchema']> };
        'vendingSlot.create': { params: z.input<typeof Contract_0.vendingSlotCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingSlotCrud['create']['outputSchema']> };
        'vendingSlot.find': { params: z.input<typeof Contract_0.vendingSlotCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingSlotCrud['find']['outputSchema']> };
        'vendingSlot.find_one': { params: z.input<typeof Contract_0.vendingSlotCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingSlotCrud['findOne']['outputSchema']> };
        'vendingSlot.count': { params: z.input<typeof Contract_0.vendingSlotCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingSlotCrud['count']['outputSchema']> };
        'vendingSlot.get': { params: z.input<typeof Contract_0.vendingSlotCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingSlotCrud['get']['outputSchema']> };
        'vendingSlot.update': { params: z.input<typeof Contract_0.vendingSlotCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingSlotCrud['update']['outputSchema']> };
        'vendingSlot.delete': { params: z.input<typeof Contract_0.vendingSlotCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingSlotCrud['delete']['outputSchema']> };
        'vendingProductMeta.create': { params: z.input<typeof Contract_0.vendingProductMetadataCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingProductMetadataCrud['create']['outputSchema']> };
        'vendingProductMeta.find': { params: z.input<typeof Contract_0.vendingProductMetadataCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingProductMetadataCrud['find']['outputSchema']> };
        'vendingProductMeta.find_one': { params: z.input<typeof Contract_0.vendingProductMetadataCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingProductMetadataCrud['findOne']['outputSchema']> };
        'vendingProductMeta.count': { params: z.input<typeof Contract_0.vendingProductMetadataCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingProductMetadataCrud['count']['outputSchema']> };
        'vendingProductMeta.get': { params: z.input<typeof Contract_0.vendingProductMetadataCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingProductMetadataCrud['get']['outputSchema']> };
        'vendingProductMeta.update': { params: z.input<typeof Contract_0.vendingProductMetadataCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingProductMetadataCrud['update']['outputSchema']> };
        'vendingProductMeta.delete': { params: z.input<typeof Contract_0.vendingProductMetadataCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingProductMetadataCrud['delete']['outputSchema']> };
        'vendingPendingOrder.create': { params: z.input<typeof Contract_0.vendingPendingOrderCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingPendingOrderCrud['create']['outputSchema']> };
        'vendingPendingOrder.find': { params: z.input<typeof Contract_0.vendingPendingOrderCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingPendingOrderCrud['find']['outputSchema']> };
        'vendingPendingOrder.find_one': { params: z.input<typeof Contract_0.vendingPendingOrderCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingPendingOrderCrud['findOne']['outputSchema']> };
        'vendingPendingOrder.count': { params: z.input<typeof Contract_0.vendingPendingOrderCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingPendingOrderCrud['count']['outputSchema']> };
        'vendingPendingOrder.get': { params: z.input<typeof Contract_0.vendingPendingOrderCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingPendingOrderCrud['get']['outputSchema']> };
        'vendingPendingOrder.update': { params: z.input<typeof Contract_0.vendingPendingOrderCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingPendingOrderCrud['update']['outputSchema']> };
        'vendingPendingOrder.delete': { params: z.input<typeof Contract_0.vendingPendingOrderCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_0.vendingPendingOrderCrud['delete']['outputSchema']> };
    }
}

export type { IServiceToolRegistry };
