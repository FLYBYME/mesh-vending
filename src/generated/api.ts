// GENERATED FILE - DO NOT EDIT
import { z } from 'zod';
import type { IServiceToolRegistry } from 'mesh';
import * as Contract_0 from '../demo/demo.contract.js';
import * as Contract_1 from '../vending/vending.contract.js';

declare module 'mesh' {
    interface IServiceToolRegistry {
        'demo.hello': { params: z.input<typeof Contract_0.demoHelloContract['inputSchema']>, returns: z.infer<typeof Contract_0.demoHelloContract['outputSchema']> };
        'demo.status': { params: z.input<typeof Contract_0.demoStatusContract['inputSchema']>, returns: z.infer<typeof Contract_0.demoStatusContract['outputSchema']> };
        'demo.notify': { params: z.input<typeof Contract_0.demoNotifyContract['inputSchema']>, returns: z.infer<typeof Contract_0.demoNotifyContract['outputSchema']> };
        'demo.create': { params: z.input<typeof Contract_0.demoCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_0.demoCrud['create']['outputSchema']> };
        'demo.find': { params: z.input<typeof Contract_0.demoCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_0.demoCrud['find']['outputSchema']> };
        'demo.find_one': { params: z.input<typeof Contract_0.demoCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_0.demoCrud['findOne']['outputSchema']> };
        'demo.count': { params: z.input<typeof Contract_0.demoCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_0.demoCrud['count']['outputSchema']> };
        'demo.get': { params: z.input<typeof Contract_0.demoCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_0.demoCrud['get']['outputSchema']> };
        'demo.update': { params: z.input<typeof Contract_0.demoCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_0.demoCrud['update']['outputSchema']> };
        'demo.delete': { params: z.input<typeof Contract_0.demoCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_0.demoCrud['delete']['outputSchema']> };
        'vending.email_read': { params: z.input<typeof Contract_1.vendingEmailReadContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingEmailReadContract['outputSchema']> };
        'vending.email_write': { params: z.input<typeof Contract_1.vendingEmailWriteContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingEmailWriteContract['outputSchema']> };
        'vending.search': { params: z.input<typeof Contract_1.vendingSearchContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingSearchContract['outputSchema']> };
        'vending.inventory_check': { params: z.input<typeof Contract_1.vendingInventoryCheckContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingInventoryCheckContract['outputSchema']> };
        'vending.balance_check': { params: z.input<typeof Contract_1.vendingBalanceCheckContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingBalanceCheckContract['outputSchema']> };
        'vending.wait_for_next_day': { params: z.input<typeof Contract_1.vendingWaitForNextDayContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingWaitForNextDayContract['outputSchema']> };
        'vending.machine_stock': { params: z.input<typeof Contract_1.vendingMachineStockContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingMachineStockContract['outputSchema']> };
        'vending.machine_collect_cash': { params: z.input<typeof Contract_1.vendingMachineCollectCashContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingMachineCollectCashContract['outputSchema']> };
        'vending.machine_set_price': { params: z.input<typeof Contract_1.vendingMachineSetPriceContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingMachineSetPriceContract['outputSchema']> };
        'vending.machine_inventory': { params: z.input<typeof Contract_1.vendingMachineInventoryContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingMachineInventoryContract['outputSchema']> };
        'vending.reset': { params: z.input<typeof Contract_1.vendingResetContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingResetContract['outputSchema']> };
        'vending.sub_agent_specs': { params: z.input<typeof Contract_1.vendingSubAgentSpecsContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingSubAgentSpecsContract['outputSchema']> };
        'vending.run_sub_agent': { params: z.input<typeof Contract_1.vendingRunSubAgentContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingRunSubAgentContract['outputSchema']> };
        'vending.chat_with_sub_agent': { params: z.input<typeof Contract_1.vendingChatWithSubAgentContract['inputSchema']>, returns: z.infer<typeof Contract_1.vendingChatWithSubAgentContract['outputSchema']> };
        'vendingState.create': { params: z.input<typeof Contract_1.vendingStateCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingStateCrud['create']['outputSchema']> };
        'vendingState.find': { params: z.input<typeof Contract_1.vendingStateCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingStateCrud['find']['outputSchema']> };
        'vendingState.find_one': { params: z.input<typeof Contract_1.vendingStateCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingStateCrud['findOne']['outputSchema']> };
        'vendingState.count': { params: z.input<typeof Contract_1.vendingStateCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingStateCrud['count']['outputSchema']> };
        'vendingState.get': { params: z.input<typeof Contract_1.vendingStateCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingStateCrud['get']['outputSchema']> };
        'vendingState.update': { params: z.input<typeof Contract_1.vendingStateCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingStateCrud['update']['outputSchema']> };
        'vendingState.delete': { params: z.input<typeof Contract_1.vendingStateCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingStateCrud['delete']['outputSchema']> };
        'vendingEmail.create': { params: z.input<typeof Contract_1.vendingEmailCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingEmailCrud['create']['outputSchema']> };
        'vendingEmail.find': { params: z.input<typeof Contract_1.vendingEmailCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingEmailCrud['find']['outputSchema']> };
        'vendingEmail.find_one': { params: z.input<typeof Contract_1.vendingEmailCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingEmailCrud['findOne']['outputSchema']> };
        'vendingEmail.count': { params: z.input<typeof Contract_1.vendingEmailCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingEmailCrud['count']['outputSchema']> };
        'vendingEmail.get': { params: z.input<typeof Contract_1.vendingEmailCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingEmailCrud['get']['outputSchema']> };
        'vendingEmail.update': { params: z.input<typeof Contract_1.vendingEmailCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingEmailCrud['update']['outputSchema']> };
        'vendingEmail.delete': { params: z.input<typeof Contract_1.vendingEmailCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingEmailCrud['delete']['outputSchema']> };
        'vendingInventory.create': { params: z.input<typeof Contract_1.vendingInventoryCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingInventoryCrud['create']['outputSchema']> };
        'vendingInventory.find': { params: z.input<typeof Contract_1.vendingInventoryCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingInventoryCrud['find']['outputSchema']> };
        'vendingInventory.find_one': { params: z.input<typeof Contract_1.vendingInventoryCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingInventoryCrud['findOne']['outputSchema']> };
        'vendingInventory.count': { params: z.input<typeof Contract_1.vendingInventoryCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingInventoryCrud['count']['outputSchema']> };
        'vendingInventory.get': { params: z.input<typeof Contract_1.vendingInventoryCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingInventoryCrud['get']['outputSchema']> };
        'vendingInventory.update': { params: z.input<typeof Contract_1.vendingInventoryCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingInventoryCrud['update']['outputSchema']> };
        'vendingInventory.delete': { params: z.input<typeof Contract_1.vendingInventoryCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingInventoryCrud['delete']['outputSchema']> };
        'vendingSlot.create': { params: z.input<typeof Contract_1.vendingSlotCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingSlotCrud['create']['outputSchema']> };
        'vendingSlot.find': { params: z.input<typeof Contract_1.vendingSlotCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingSlotCrud['find']['outputSchema']> };
        'vendingSlot.find_one': { params: z.input<typeof Contract_1.vendingSlotCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingSlotCrud['findOne']['outputSchema']> };
        'vendingSlot.count': { params: z.input<typeof Contract_1.vendingSlotCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingSlotCrud['count']['outputSchema']> };
        'vendingSlot.get': { params: z.input<typeof Contract_1.vendingSlotCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingSlotCrud['get']['outputSchema']> };
        'vendingSlot.update': { params: z.input<typeof Contract_1.vendingSlotCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingSlotCrud['update']['outputSchema']> };
        'vendingSlot.delete': { params: z.input<typeof Contract_1.vendingSlotCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingSlotCrud['delete']['outputSchema']> };
        'vendingProductMeta.create': { params: z.input<typeof Contract_1.vendingProductMetadataCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingProductMetadataCrud['create']['outputSchema']> };
        'vendingProductMeta.find': { params: z.input<typeof Contract_1.vendingProductMetadataCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingProductMetadataCrud['find']['outputSchema']> };
        'vendingProductMeta.find_one': { params: z.input<typeof Contract_1.vendingProductMetadataCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingProductMetadataCrud['findOne']['outputSchema']> };
        'vendingProductMeta.count': { params: z.input<typeof Contract_1.vendingProductMetadataCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingProductMetadataCrud['count']['outputSchema']> };
        'vendingProductMeta.get': { params: z.input<typeof Contract_1.vendingProductMetadataCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingProductMetadataCrud['get']['outputSchema']> };
        'vendingProductMeta.update': { params: z.input<typeof Contract_1.vendingProductMetadataCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingProductMetadataCrud['update']['outputSchema']> };
        'vendingProductMeta.delete': { params: z.input<typeof Contract_1.vendingProductMetadataCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingProductMetadataCrud['delete']['outputSchema']> };
        'vendingPendingOrder.create': { params: z.input<typeof Contract_1.vendingPendingOrderCrud['create']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingPendingOrderCrud['create']['outputSchema']> };
        'vendingPendingOrder.find': { params: z.input<typeof Contract_1.vendingPendingOrderCrud['find']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingPendingOrderCrud['find']['outputSchema']> };
        'vendingPendingOrder.find_one': { params: z.input<typeof Contract_1.vendingPendingOrderCrud['findOne']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingPendingOrderCrud['findOne']['outputSchema']> };
        'vendingPendingOrder.count': { params: z.input<typeof Contract_1.vendingPendingOrderCrud['count']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingPendingOrderCrud['count']['outputSchema']> };
        'vendingPendingOrder.get': { params: z.input<typeof Contract_1.vendingPendingOrderCrud['get']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingPendingOrderCrud['get']['outputSchema']> };
        'vendingPendingOrder.update': { params: z.input<typeof Contract_1.vendingPendingOrderCrud['update']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingPendingOrderCrud['update']['outputSchema']> };
        'vendingPendingOrder.delete': { params: z.input<typeof Contract_1.vendingPendingOrderCrud['delete']['inputSchema']>, returns: z.infer<typeof Contract_1.vendingPendingOrderCrud['delete']['outputSchema']> };
    }
}

export type { IServiceToolRegistry };
