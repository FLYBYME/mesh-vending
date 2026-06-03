// GENERATED FILE - DO NOT EDIT
import { z } from 'zod';
import type { EventRegistry } from '@flybyme/mesh';

// External Type Includes
import '../../../mesh-agents/src/generated/events.ts';
import * as Contract_0 from '../demo/demo.contract.js';
import * as Contract_1 from '../vending/vending.contract.js';

declare module '@flybyme/mesh' {
    interface EventRegistry {
        'demo.hello.sent': z.infer<typeof Contract_0.demoHelloSentEvent['schema']>;
        'vending.day_advanced': z.infer<typeof Contract_1.vendingDayAdvancedEvent['schema']>;
        'vending.email_received': z.infer<typeof Contract_1.vendingEmailReceivedEvent['schema']>;
        'vending.order_delivered': z.infer<typeof Contract_1.vendingOrderDeliveredEvent['schema']>;
    }
}

export type { EventRegistry };
