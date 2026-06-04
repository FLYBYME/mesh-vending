// GENERATED FILE - DO NOT EDIT
import { z } from 'zod';

// External Type Includes
import '@flybyme/mesh-agents';
import * as Contract_0 from '../vending/vending.contract.js';

declare global {
    interface EventRegistry {
        'vending.day_advanced': z.infer<typeof Contract_0.vendingDayAdvancedEvent['schema']>;
        'vending.email_received': z.infer<typeof Contract_0.vendingEmailReceivedEvent['schema']>;
        'vending.order_delivered': z.infer<typeof Contract_0.vendingOrderDeliveredEvent['schema']>;
    }
}

export type { EventRegistry };
