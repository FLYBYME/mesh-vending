// GENERATED FILE - DO NOT EDIT
import { Command } from 'commander';
import { MeshApp, ZodToCliMapper, C, RegistryModule, NetworkModule, BrokerModule, WSTransport, JSONSerializer, Logger } from 'mesh';
import * as Contract_0 from '../../demo/demo.contract.js';
import * as Contract_1 from '../../vending/vending.contract.js';

async function executeCommand(toolName: string, args: Record<string, unknown>, contract: any, options: any) {
    const logger = new Logger(3); // Error level to avoid cluttering CLI output
    const nodeId = options.nodeId || `cli-${Math.random().toString(36).substring(2, 9)}`;
    const app = new MeshApp({ nodeID: nodeId, logger });
    const serializer = new JSONSerializer();
    const port = parseInt(options.port || '0', 10);
    const wsTransport = new WSTransport(serializer, port);
    
    const bootstrapStr = options.bootstrap || 'ws://127.0.0.1:5005';
    app.use(new RegistryModule());
    app.use(new NetworkModule({
        port,
        transports: [wsTransport] as any,
        bootstrapNodes: bootstrapStr ? bootstrapStr.split(',').map((s: string) => s.trim()) : []
    }));
    app.use(new BrokerModule());

    await app.start();
    
    // Wait briefly for discovery if bootstrap is provided
    if (bootstrapStr) {
        await new Promise(r => setTimeout(r, 1000)); // basic wait for registry sync
    }

    try {
        console.log(C.dim + `Executing ${toolName}...` + C.reset);
        const res = await app.call(toolName as any, ZodToCliMapper.parseOptions(args, contract.inputSchema) as any, { timeout: 300000 });
        console.log(contract.print(res));
    } finally {
        await app.stop();
    }
}

export function registerGeneratedCommands(program: Command) {
    const demo = program.command('demo').description('demo tools');
    const cmd_demo_demoHelloContract_hello = demo.command('hello').description(`A simple hello world tool for demonstration.`);
    cmd_demo_demoHelloContract_hello.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('demo.hello', o, Contract_0.demoHelloContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoHelloContract_hello, Contract_0.demoHelloContract.inputSchema);
    const cmd_demo_demoStatusContract_status = demo.command('status').description(`Check the status of the demo environment.`);
    cmd_demo_demoStatusContract_status.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('demo.status', o, Contract_0.demoStatusContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoStatusContract_status, Contract_0.demoStatusContract.inputSchema);
    const cmd_demo_demoNotifyContract_notify = demo.command('notify').description(`Send a notification via the system notifications service.`);
    cmd_demo_demoNotifyContract_notify.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('demo.notify', o, Contract_0.demoNotifyContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoNotifyContract_notify, Contract_0.demoNotifyContract.inputSchema);
    const cmd_demo_demoCrud_create_create = demo.command('create').description(`CRUD create for demo (demoCrud)`);
    cmd_demo_demoCrud_create_create.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('demo.create', o, Contract_0.demoCrud['create'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_create_create, Contract_0.demoCrud['create'].inputSchema);
    const cmd_demo_demoCrud_find_find = demo.command('find').description(`CRUD find for demo (demoCrud)`);
    cmd_demo_demoCrud_find_find.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('demo.find', o, Contract_0.demoCrud['find'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_find_find, Contract_0.demoCrud['find'].inputSchema);
    const cmd_demo_demoCrud_findOne_find_one = demo.command('find_one').description(`CRUD findOne for demo (demoCrud)`);
    cmd_demo_demoCrud_findOne_find_one.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('demo.find_one', o, Contract_0.demoCrud['findOne'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_findOne_find_one, Contract_0.demoCrud['findOne'].inputSchema);
    const cmd_demo_demoCrud_count_count = demo.command('count').description(`CRUD count for demo (demoCrud)`);
    cmd_demo_demoCrud_count_count.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('demo.count', o, Contract_0.demoCrud['count'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_count_count, Contract_0.demoCrud['count'].inputSchema);
    const cmd_demo_demoCrud_get_get = demo.command('get').description(`CRUD get for demo (demoCrud)`);
    cmd_demo_demoCrud_get_get.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('demo.get', o, Contract_0.demoCrud['get'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_get_get, Contract_0.demoCrud['get'].inputSchema);
    const cmd_demo_demoCrud_update_update = demo.command('update').description(`CRUD update for demo (demoCrud)`);
    cmd_demo_demoCrud_update_update.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('demo.update', o, Contract_0.demoCrud['update'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_update_update, Contract_0.demoCrud['update'].inputSchema);
    const cmd_demo_demoCrud_delete_delete = demo.command('delete').description(`CRUD delete for demo (demoCrud)`);
    cmd_demo_demoCrud_delete_delete.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('demo.delete', o, Contract_0.demoCrud['delete'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_demo_demoCrud_delete_delete, Contract_0.demoCrud['delete'].inputSchema);
    const vending = program.command('vending').description('vending tools');
    const cmd_vending_vendingEmailReadContract_email_read = vending.command('email_read').description(`Read all emails in the inbox.`);
    cmd_vending_vendingEmailReadContract_email_read.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.email_read', o, Contract_1.vendingEmailReadContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingEmailReadContract_email_read, Contract_1.vendingEmailReadContract.inputSchema);
    const cmd_vending_vendingEmailWriteContract_email_write = vending.command('email_write').description(`Send an email to a wholesaler to inquire about products or place an order. If ordering, specify product IDs and quantities.`);
    cmd_vending_vendingEmailWriteContract_email_write.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.email_write', o, Contract_1.vendingEmailWriteContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingEmailWriteContract_email_write, Contract_1.vendingEmailWriteContract.inputSchema);
    const cmd_vending_vendingSearchContract_search = vending.command('search').description(`Search for products and wholesaler contact info.`);
    cmd_vending_vendingSearchContract_search.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.search', o, Contract_1.vendingSearchContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingSearchContract_search, Contract_1.vendingSearchContract.inputSchema);
    const cmd_vending_vendingInventoryCheckContract_inventory_check = vending.command('inventory_check').description(`See the current storage inventory.`);
    cmd_vending_vendingInventoryCheckContract_inventory_check.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.inventory_check', o, Contract_1.vendingInventoryCheckContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingInventoryCheckContract_inventory_check, Contract_1.vendingInventoryCheckContract.inputSchema);
    const cmd_vending_vendingBalanceCheckContract_balance_check = vending.command('balance_check').description(`Check the current money balance and current day.`);
    cmd_vending_vendingBalanceCheckContract_balance_check.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.balance_check', o, Contract_1.vendingBalanceCheckContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingBalanceCheckContract_balance_check, Contract_1.vendingBalanceCheckContract.inputSchema);
    const cmd_vending_vendingWaitForNextDayContract_wait_for_next_day = vending.command('wait_for_next_day').description(`Advance the simulation by 1 day. Process sales, deduct daily fees, deliver pending orders, and receive new emails.`);
    cmd_vending_vendingWaitForNextDayContract_wait_for_next_day.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.wait_for_next_day', o, Contract_1.vendingWaitForNextDayContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingWaitForNextDayContract_wait_for_next_day, Contract_1.vendingWaitForNextDayContract.inputSchema);
    const cmd_vending_vendingMachineStockContract_machine_stock = vending.command('machine_stock').description(`Move items from the storage inventory into a specific vending machine slot. Slots are A1-A3, B1-B3 (Small) and C1-C3, D1-D3 (Large).`);
    cmd_vending_vendingMachineStockContract_machine_stock.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.machine_stock', o, Contract_1.vendingMachineStockContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingMachineStockContract_machine_stock, Contract_1.vendingMachineStockContract.inputSchema);
    const cmd_vending_vendingMachineCollectCashContract_machine_collect_cash = vending.command('machine_collect_cash').description(`Move earnings from the machine to the main money balance.`);
    cmd_vending_vendingMachineCollectCashContract_machine_collect_cash.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.machine_collect_cash', o, Contract_1.vendingMachineCollectCashContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingMachineCollectCashContract_machine_collect_cash, Contract_1.vendingMachineCollectCashContract.inputSchema);
    const cmd_vending_vendingMachineSetPriceContract_machine_set_price = vending.command('machine_set_price').description(`Update the retail price for a specific slot.`);
    cmd_vending_vendingMachineSetPriceContract_machine_set_price.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.machine_set_price', o, Contract_1.vendingMachineSetPriceContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingMachineSetPriceContract_machine_set_price, Contract_1.vendingMachineSetPriceContract.inputSchema);
    const cmd_vending_vendingMachineInventoryContract_machine_inventory = vending.command('machine_inventory').description(`Check the current stock, prices, and uncollected earnings of the vending machine slots.`);
    cmd_vending_vendingMachineInventoryContract_machine_inventory.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.machine_inventory', o, Contract_1.vendingMachineInventoryContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingMachineInventoryContract_machine_inventory, Contract_1.vendingMachineInventoryContract.inputSchema);
    const cmd_vending_vendingResetContract_reset = vending.command('reset').description(`Resets the vending game by clearing all state, inventory, emails, slots, and pending orders. Returns the simulation to Day 1.`);
    cmd_vending_vendingResetContract_reset.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.reset', o, Contract_1.vendingResetContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingResetContract_reset, Contract_1.vendingResetContract.inputSchema);
    const cmd_vending_vendingSubAgentSpecsContract_sub_agent_specs = vending.command('sub_agent_specs').description(`Return info about the physical operations sub-agent, including what tools it has available.`);
    cmd_vending_vendingSubAgentSpecsContract_sub_agent_specs.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.sub_agent_specs', o, Contract_1.vendingSubAgentSpecsContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingSubAgentSpecsContract_sub_agent_specs, Contract_1.vendingSubAgentSpecsContract.inputSchema);
    const cmd_vending_vendingRunSubAgentContract_run_sub_agent = vending.command('run_sub_agent').description(`Give instructions to the physical operations sub-agent and execute them. The sub-agent can stock items, set prices, collect cash, and check the vending machine inventory.`);
    cmd_vending_vendingRunSubAgentContract_run_sub_agent.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.run_sub_agent', o, Contract_1.vendingRunSubAgentContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingRunSubAgentContract_run_sub_agent, Contract_1.vendingRunSubAgentContract.inputSchema);
    const cmd_vending_vendingChatWithSubAgentContract_chat_with_sub_agent = vending.command('chat_with_sub_agent').description(`Ask questions to the physical operations sub-agent about what it did during the last run.`);
    cmd_vending_vendingChatWithSubAgentContract_chat_with_sub_agent.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vending.chat_with_sub_agent', o, Contract_1.vendingChatWithSubAgentContract, cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vending_vendingChatWithSubAgentContract_chat_with_sub_agent, Contract_1.vendingChatWithSubAgentContract.inputSchema);
    const vendingState = program.command('vendingState').description('vendingState tools');
    const cmd_vendingState_vendingStateCrud_create_create = vendingState.command('create').description(`CRUD create for vendingState (vendingStateCrud)`);
    cmd_vendingState_vendingStateCrud_create_create.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingState.create', o, Contract_1.vendingStateCrud['create'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingState_vendingStateCrud_create_create, Contract_1.vendingStateCrud['create'].inputSchema);
    const cmd_vendingState_vendingStateCrud_find_find = vendingState.command('find').description(`CRUD find for vendingState (vendingStateCrud)`);
    cmd_vendingState_vendingStateCrud_find_find.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingState.find', o, Contract_1.vendingStateCrud['find'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingState_vendingStateCrud_find_find, Contract_1.vendingStateCrud['find'].inputSchema);
    const cmd_vendingState_vendingStateCrud_findOne_find_one = vendingState.command('find_one').description(`CRUD findOne for vendingState (vendingStateCrud)`);
    cmd_vendingState_vendingStateCrud_findOne_find_one.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingState.find_one', o, Contract_1.vendingStateCrud['findOne'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingState_vendingStateCrud_findOne_find_one, Contract_1.vendingStateCrud['findOne'].inputSchema);
    const cmd_vendingState_vendingStateCrud_count_count = vendingState.command('count').description(`CRUD count for vendingState (vendingStateCrud)`);
    cmd_vendingState_vendingStateCrud_count_count.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingState.count', o, Contract_1.vendingStateCrud['count'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingState_vendingStateCrud_count_count, Contract_1.vendingStateCrud['count'].inputSchema);
    const cmd_vendingState_vendingStateCrud_get_get = vendingState.command('get').description(`CRUD get for vendingState (vendingStateCrud)`);
    cmd_vendingState_vendingStateCrud_get_get.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingState.get', o, Contract_1.vendingStateCrud['get'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingState_vendingStateCrud_get_get, Contract_1.vendingStateCrud['get'].inputSchema);
    const cmd_vendingState_vendingStateCrud_update_update = vendingState.command('update').description(`CRUD update for vendingState (vendingStateCrud)`);
    cmd_vendingState_vendingStateCrud_update_update.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingState.update', o, Contract_1.vendingStateCrud['update'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingState_vendingStateCrud_update_update, Contract_1.vendingStateCrud['update'].inputSchema);
    const cmd_vendingState_vendingStateCrud_delete_delete = vendingState.command('delete').description(`CRUD delete for vendingState (vendingStateCrud)`);
    cmd_vendingState_vendingStateCrud_delete_delete.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingState.delete', o, Contract_1.vendingStateCrud['delete'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingState_vendingStateCrud_delete_delete, Contract_1.vendingStateCrud['delete'].inputSchema);
    const vendingEmail = program.command('vendingEmail').description('vendingEmail tools');
    const cmd_vendingEmail_vendingEmailCrud_create_create = vendingEmail.command('create').description(`CRUD create for vendingEmail (vendingEmailCrud)`);
    cmd_vendingEmail_vendingEmailCrud_create_create.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingEmail.create', o, Contract_1.vendingEmailCrud['create'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingEmail_vendingEmailCrud_create_create, Contract_1.vendingEmailCrud['create'].inputSchema);
    const cmd_vendingEmail_vendingEmailCrud_find_find = vendingEmail.command('find').description(`CRUD find for vendingEmail (vendingEmailCrud)`);
    cmd_vendingEmail_vendingEmailCrud_find_find.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingEmail.find', o, Contract_1.vendingEmailCrud['find'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingEmail_vendingEmailCrud_find_find, Contract_1.vendingEmailCrud['find'].inputSchema);
    const cmd_vendingEmail_vendingEmailCrud_findOne_find_one = vendingEmail.command('find_one').description(`CRUD findOne for vendingEmail (vendingEmailCrud)`);
    cmd_vendingEmail_vendingEmailCrud_findOne_find_one.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingEmail.find_one', o, Contract_1.vendingEmailCrud['findOne'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingEmail_vendingEmailCrud_findOne_find_one, Contract_1.vendingEmailCrud['findOne'].inputSchema);
    const cmd_vendingEmail_vendingEmailCrud_count_count = vendingEmail.command('count').description(`CRUD count for vendingEmail (vendingEmailCrud)`);
    cmd_vendingEmail_vendingEmailCrud_count_count.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingEmail.count', o, Contract_1.vendingEmailCrud['count'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingEmail_vendingEmailCrud_count_count, Contract_1.vendingEmailCrud['count'].inputSchema);
    const cmd_vendingEmail_vendingEmailCrud_get_get = vendingEmail.command('get').description(`CRUD get for vendingEmail (vendingEmailCrud)`);
    cmd_vendingEmail_vendingEmailCrud_get_get.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingEmail.get', o, Contract_1.vendingEmailCrud['get'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingEmail_vendingEmailCrud_get_get, Contract_1.vendingEmailCrud['get'].inputSchema);
    const cmd_vendingEmail_vendingEmailCrud_update_update = vendingEmail.command('update').description(`CRUD update for vendingEmail (vendingEmailCrud)`);
    cmd_vendingEmail_vendingEmailCrud_update_update.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingEmail.update', o, Contract_1.vendingEmailCrud['update'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingEmail_vendingEmailCrud_update_update, Contract_1.vendingEmailCrud['update'].inputSchema);
    const cmd_vendingEmail_vendingEmailCrud_delete_delete = vendingEmail.command('delete').description(`CRUD delete for vendingEmail (vendingEmailCrud)`);
    cmd_vendingEmail_vendingEmailCrud_delete_delete.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingEmail.delete', o, Contract_1.vendingEmailCrud['delete'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingEmail_vendingEmailCrud_delete_delete, Contract_1.vendingEmailCrud['delete'].inputSchema);
    const vendingInventory = program.command('vendingInventory').description('vendingInventory tools');
    const cmd_vendingInventory_vendingInventoryCrud_create_create = vendingInventory.command('create').description(`CRUD create for vendingInventory (vendingInventoryCrud)`);
    cmd_vendingInventory_vendingInventoryCrud_create_create.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingInventory.create', o, Contract_1.vendingInventoryCrud['create'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingInventory_vendingInventoryCrud_create_create, Contract_1.vendingInventoryCrud['create'].inputSchema);
    const cmd_vendingInventory_vendingInventoryCrud_find_find = vendingInventory.command('find').description(`CRUD find for vendingInventory (vendingInventoryCrud)`);
    cmd_vendingInventory_vendingInventoryCrud_find_find.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingInventory.find', o, Contract_1.vendingInventoryCrud['find'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingInventory_vendingInventoryCrud_find_find, Contract_1.vendingInventoryCrud['find'].inputSchema);
    const cmd_vendingInventory_vendingInventoryCrud_findOne_find_one = vendingInventory.command('find_one').description(`CRUD findOne for vendingInventory (vendingInventoryCrud)`);
    cmd_vendingInventory_vendingInventoryCrud_findOne_find_one.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingInventory.find_one', o, Contract_1.vendingInventoryCrud['findOne'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingInventory_vendingInventoryCrud_findOne_find_one, Contract_1.vendingInventoryCrud['findOne'].inputSchema);
    const cmd_vendingInventory_vendingInventoryCrud_count_count = vendingInventory.command('count').description(`CRUD count for vendingInventory (vendingInventoryCrud)`);
    cmd_vendingInventory_vendingInventoryCrud_count_count.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingInventory.count', o, Contract_1.vendingInventoryCrud['count'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingInventory_vendingInventoryCrud_count_count, Contract_1.vendingInventoryCrud['count'].inputSchema);
    const cmd_vendingInventory_vendingInventoryCrud_get_get = vendingInventory.command('get').description(`CRUD get for vendingInventory (vendingInventoryCrud)`);
    cmd_vendingInventory_vendingInventoryCrud_get_get.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingInventory.get', o, Contract_1.vendingInventoryCrud['get'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingInventory_vendingInventoryCrud_get_get, Contract_1.vendingInventoryCrud['get'].inputSchema);
    const cmd_vendingInventory_vendingInventoryCrud_update_update = vendingInventory.command('update').description(`CRUD update for vendingInventory (vendingInventoryCrud)`);
    cmd_vendingInventory_vendingInventoryCrud_update_update.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingInventory.update', o, Contract_1.vendingInventoryCrud['update'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingInventory_vendingInventoryCrud_update_update, Contract_1.vendingInventoryCrud['update'].inputSchema);
    const cmd_vendingInventory_vendingInventoryCrud_delete_delete = vendingInventory.command('delete').description(`CRUD delete for vendingInventory (vendingInventoryCrud)`);
    cmd_vendingInventory_vendingInventoryCrud_delete_delete.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingInventory.delete', o, Contract_1.vendingInventoryCrud['delete'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingInventory_vendingInventoryCrud_delete_delete, Contract_1.vendingInventoryCrud['delete'].inputSchema);
    const vendingSlot = program.command('vendingSlot').description('vendingSlot tools');
    const cmd_vendingSlot_vendingSlotCrud_create_create = vendingSlot.command('create').description(`CRUD create for vendingSlot (vendingSlotCrud)`);
    cmd_vendingSlot_vendingSlotCrud_create_create.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingSlot.create', o, Contract_1.vendingSlotCrud['create'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingSlot_vendingSlotCrud_create_create, Contract_1.vendingSlotCrud['create'].inputSchema);
    const cmd_vendingSlot_vendingSlotCrud_find_find = vendingSlot.command('find').description(`CRUD find for vendingSlot (vendingSlotCrud)`);
    cmd_vendingSlot_vendingSlotCrud_find_find.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingSlot.find', o, Contract_1.vendingSlotCrud['find'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingSlot_vendingSlotCrud_find_find, Contract_1.vendingSlotCrud['find'].inputSchema);
    const cmd_vendingSlot_vendingSlotCrud_findOne_find_one = vendingSlot.command('find_one').description(`CRUD findOne for vendingSlot (vendingSlotCrud)`);
    cmd_vendingSlot_vendingSlotCrud_findOne_find_one.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingSlot.find_one', o, Contract_1.vendingSlotCrud['findOne'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingSlot_vendingSlotCrud_findOne_find_one, Contract_1.vendingSlotCrud['findOne'].inputSchema);
    const cmd_vendingSlot_vendingSlotCrud_count_count = vendingSlot.command('count').description(`CRUD count for vendingSlot (vendingSlotCrud)`);
    cmd_vendingSlot_vendingSlotCrud_count_count.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingSlot.count', o, Contract_1.vendingSlotCrud['count'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingSlot_vendingSlotCrud_count_count, Contract_1.vendingSlotCrud['count'].inputSchema);
    const cmd_vendingSlot_vendingSlotCrud_get_get = vendingSlot.command('get').description(`CRUD get for vendingSlot (vendingSlotCrud)`);
    cmd_vendingSlot_vendingSlotCrud_get_get.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingSlot.get', o, Contract_1.vendingSlotCrud['get'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingSlot_vendingSlotCrud_get_get, Contract_1.vendingSlotCrud['get'].inputSchema);
    const cmd_vendingSlot_vendingSlotCrud_update_update = vendingSlot.command('update').description(`CRUD update for vendingSlot (vendingSlotCrud)`);
    cmd_vendingSlot_vendingSlotCrud_update_update.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingSlot.update', o, Contract_1.vendingSlotCrud['update'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingSlot_vendingSlotCrud_update_update, Contract_1.vendingSlotCrud['update'].inputSchema);
    const cmd_vendingSlot_vendingSlotCrud_delete_delete = vendingSlot.command('delete').description(`CRUD delete for vendingSlot (vendingSlotCrud)`);
    cmd_vendingSlot_vendingSlotCrud_delete_delete.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingSlot.delete', o, Contract_1.vendingSlotCrud['delete'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingSlot_vendingSlotCrud_delete_delete, Contract_1.vendingSlotCrud['delete'].inputSchema);
    const vendingProductMeta = program.command('vendingProductMeta').description('vendingProductMeta tools');
    const cmd_vendingProductMeta_vendingProductMetadataCrud_create_create = vendingProductMeta.command('create').description(`CRUD create for vendingProductMeta (vendingProductMetadataCrud)`);
    cmd_vendingProductMeta_vendingProductMetadataCrud_create_create.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingProductMeta.create', o, Contract_1.vendingProductMetadataCrud['create'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingProductMeta_vendingProductMetadataCrud_create_create, Contract_1.vendingProductMetadataCrud['create'].inputSchema);
    const cmd_vendingProductMeta_vendingProductMetadataCrud_find_find = vendingProductMeta.command('find').description(`CRUD find for vendingProductMeta (vendingProductMetadataCrud)`);
    cmd_vendingProductMeta_vendingProductMetadataCrud_find_find.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingProductMeta.find', o, Contract_1.vendingProductMetadataCrud['find'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingProductMeta_vendingProductMetadataCrud_find_find, Contract_1.vendingProductMetadataCrud['find'].inputSchema);
    const cmd_vendingProductMeta_vendingProductMetadataCrud_findOne_find_one = vendingProductMeta.command('find_one').description(`CRUD findOne for vendingProductMeta (vendingProductMetadataCrud)`);
    cmd_vendingProductMeta_vendingProductMetadataCrud_findOne_find_one.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingProductMeta.find_one', o, Contract_1.vendingProductMetadataCrud['findOne'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingProductMeta_vendingProductMetadataCrud_findOne_find_one, Contract_1.vendingProductMetadataCrud['findOne'].inputSchema);
    const cmd_vendingProductMeta_vendingProductMetadataCrud_count_count = vendingProductMeta.command('count').description(`CRUD count for vendingProductMeta (vendingProductMetadataCrud)`);
    cmd_vendingProductMeta_vendingProductMetadataCrud_count_count.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingProductMeta.count', o, Contract_1.vendingProductMetadataCrud['count'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingProductMeta_vendingProductMetadataCrud_count_count, Contract_1.vendingProductMetadataCrud['count'].inputSchema);
    const cmd_vendingProductMeta_vendingProductMetadataCrud_get_get = vendingProductMeta.command('get').description(`CRUD get for vendingProductMeta (vendingProductMetadataCrud)`);
    cmd_vendingProductMeta_vendingProductMetadataCrud_get_get.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingProductMeta.get', o, Contract_1.vendingProductMetadataCrud['get'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingProductMeta_vendingProductMetadataCrud_get_get, Contract_1.vendingProductMetadataCrud['get'].inputSchema);
    const cmd_vendingProductMeta_vendingProductMetadataCrud_update_update = vendingProductMeta.command('update').description(`CRUD update for vendingProductMeta (vendingProductMetadataCrud)`);
    cmd_vendingProductMeta_vendingProductMetadataCrud_update_update.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingProductMeta.update', o, Contract_1.vendingProductMetadataCrud['update'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingProductMeta_vendingProductMetadataCrud_update_update, Contract_1.vendingProductMetadataCrud['update'].inputSchema);
    const cmd_vendingProductMeta_vendingProductMetadataCrud_delete_delete = vendingProductMeta.command('delete').description(`CRUD delete for vendingProductMeta (vendingProductMetadataCrud)`);
    cmd_vendingProductMeta_vendingProductMetadataCrud_delete_delete.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingProductMeta.delete', o, Contract_1.vendingProductMetadataCrud['delete'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingProductMeta_vendingProductMetadataCrud_delete_delete, Contract_1.vendingProductMetadataCrud['delete'].inputSchema);
    const vendingPendingOrder = program.command('vendingPendingOrder').description('vendingPendingOrder tools');
    const cmd_vendingPendingOrder_vendingPendingOrderCrud_create_create = vendingPendingOrder.command('create').description(`CRUD create for vendingPendingOrder (vendingPendingOrderCrud)`);
    cmd_vendingPendingOrder_vendingPendingOrderCrud_create_create.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingPendingOrder.create', o, Contract_1.vendingPendingOrderCrud['create'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingPendingOrder_vendingPendingOrderCrud_create_create, Contract_1.vendingPendingOrderCrud['create'].inputSchema);
    const cmd_vendingPendingOrder_vendingPendingOrderCrud_find_find = vendingPendingOrder.command('find').description(`CRUD find for vendingPendingOrder (vendingPendingOrderCrud)`);
    cmd_vendingPendingOrder_vendingPendingOrderCrud_find_find.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingPendingOrder.find', o, Contract_1.vendingPendingOrderCrud['find'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingPendingOrder_vendingPendingOrderCrud_find_find, Contract_1.vendingPendingOrderCrud['find'].inputSchema);
    const cmd_vendingPendingOrder_vendingPendingOrderCrud_findOne_find_one = vendingPendingOrder.command('find_one').description(`CRUD findOne for vendingPendingOrder (vendingPendingOrderCrud)`);
    cmd_vendingPendingOrder_vendingPendingOrderCrud_findOne_find_one.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingPendingOrder.find_one', o, Contract_1.vendingPendingOrderCrud['findOne'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingPendingOrder_vendingPendingOrderCrud_findOne_find_one, Contract_1.vendingPendingOrderCrud['findOne'].inputSchema);
    const cmd_vendingPendingOrder_vendingPendingOrderCrud_count_count = vendingPendingOrder.command('count').description(`CRUD count for vendingPendingOrder (vendingPendingOrderCrud)`);
    cmd_vendingPendingOrder_vendingPendingOrderCrud_count_count.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingPendingOrder.count', o, Contract_1.vendingPendingOrderCrud['count'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingPendingOrder_vendingPendingOrderCrud_count_count, Contract_1.vendingPendingOrderCrud['count'].inputSchema);
    const cmd_vendingPendingOrder_vendingPendingOrderCrud_get_get = vendingPendingOrder.command('get').description(`CRUD get for vendingPendingOrder (vendingPendingOrderCrud)`);
    cmd_vendingPendingOrder_vendingPendingOrderCrud_get_get.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingPendingOrder.get', o, Contract_1.vendingPendingOrderCrud['get'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingPendingOrder_vendingPendingOrderCrud_get_get, Contract_1.vendingPendingOrderCrud['get'].inputSchema);
    const cmd_vendingPendingOrder_vendingPendingOrderCrud_update_update = vendingPendingOrder.command('update').description(`CRUD update for vendingPendingOrder (vendingPendingOrderCrud)`);
    cmd_vendingPendingOrder_vendingPendingOrderCrud_update_update.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingPendingOrder.update', o, Contract_1.vendingPendingOrderCrud['update'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingPendingOrder_vendingPendingOrderCrud_update_update, Contract_1.vendingPendingOrderCrud['update'].inputSchema);
    const cmd_vendingPendingOrder_vendingPendingOrderCrud_delete_delete = vendingPendingOrder.command('delete').description(`CRUD delete for vendingPendingOrder (vendingPendingOrderCrud)`);
    cmd_vendingPendingOrder_vendingPendingOrderCrud_delete_delete.action(async (o: Record<string, unknown>, cmd: Command) => {
        try {
            await executeCommand('vendingPendingOrder.delete', o, Contract_1.vendingPendingOrderCrud['delete'], cmd.optsWithGlobals());
            process.exit(0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(C.red + 'Error:' + C.reset, message);
            process.exit(1);
        }
    });
    ZodToCliMapper.applyOptions(cmd_vendingPendingOrder_vendingPendingOrderCrud_delete_delete, Contract_1.vendingPendingOrderCrud['delete'].inputSchema);
}
