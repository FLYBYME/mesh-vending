import { ServiceModule } from '@flybyme/mesh';
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
    vendingStateCrud,
    vendingEmailCrud,
    vendingInventoryCrud,
    vendingSlotCrud,
    vendingProductMetadataCrud,
    vendingPendingOrderCrud,
    vendingResetContract
} from './vending.contract.js';

import {
    vending_email_read,
    vending_email_write,
    vending_search,
    vending_inventory_check,
    vending_balance_check,
    vending_wait_for_next_day,
    vending_machine_stock,
    vending_machine_collect_cash,
    vending_machine_set_price,
    vending_machine_inventory,
    vending_reset
} from './vending.tools.js';

export class VendingModule extends ServiceModule {
    public readonly domain = 'vending';

    constructor() {
        super();

        this.mountCrud(vendingStateCrud);
        this.mountCrud(vendingEmailCrud);
        this.mountCrud(vendingInventoryCrud);
        this.mountCrud(vendingSlotCrud);
        this.mountCrud(vendingProductMetadataCrud);
        this.mountCrud(vendingPendingOrderCrud);

        this.mountTool(vendingEmailReadContract, vending_email_read);
        this.mountTool(vendingEmailWriteContract, vending_email_write);
        this.mountTool(vendingSearchContract, vending_search);
        this.mountTool(vendingInventoryCheckContract, vending_inventory_check);
        this.mountTool(vendingBalanceCheckContract, vending_balance_check);
        this.mountTool(vendingWaitForNextDayContract, vending_wait_for_next_day);

        this.mountTool(vendingMachineStockContract, vending_machine_stock);
        this.mountTool(vendingMachineCollectCashContract, vending_machine_collect_cash);
        this.mountTool(vendingMachineSetPriceContract, vending_machine_set_price);
        this.mountTool(vendingMachineInventoryContract, vending_machine_inventory);

        this.mountTool(vendingResetContract, vending_reset);
    }

    async onStart(broker: any): Promise<void> {
        // UI manifest registration disabled on boot.
    }
}
