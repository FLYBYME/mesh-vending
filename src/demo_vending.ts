import { BrokerModule, DatabaseModule, JSONSerializer, Logger, LogLevel, MeshApp, NetworkModule, RegistryModule, WSTransport } from "mesh";
import { IServiceBroker } from "mesh/src/interfaces";
import { VendingModule } from "./vending/vending.service.js";
import 'dotenv/config';

async function setup() {
    const logger = new Logger(LogLevel.ERROR);
    const serializer = new JSONSerializer();
    const app2 = new MeshApp({
        nodeID: 'node-vending',
        logger
    });

    const transport2 = new WSTransport(serializer, 5007);

    app2.use(new RegistryModule());
    app2.use(new NetworkModule({
        port: 5007,
        transports: [transport2],
        bootstrapNodes: ['ws://127.0.0.1:5005']
    }));
    app2.use(new DatabaseModule({ dbName: 'mesh-vending' }));
    app2.use(new BrokerModule());

    // Register the Vending Domain
    app2.registerModule(new VendingModule());

    await app2.start();
    const broker2 = app2.getProvider<IServiceBroker>('broker');

    return broker2;
}

async function cleanup(broker: IServiceBroker, thread: any, agent: any) {
    console.log('🧹 CLEANING UP...');
    await broker.call('threads.delete', { id: thread.id });
    await broker.call('agent.delete', { id: agent.id });

    console.log('👋 BYE!');
    await broker.stop();
    process.exit(0);
}

async function main() {
    const broker = await setup();

    await broker.registry.waitForTool('infer.queue_status', 1000);

    broker.on('infer.request_queued', (data) => console.log('✅ QUEUE EVENT:', data));

    broker.on('infer.request_queued', (data) => {
        console.log('✅ QUEUE EVENT:', data);
    });

    let currentThread = '';
    let currentState: 'thinking' | 'content' | '' = '';
    broker.on('infer.thinking_chunk', (data) => {
        if (currentThread === '') {
            currentThread = data.threadId;
            currentState = 'thinking';
            console.log(`\nThinking: ${data.threadId}`);
        }
        if (currentState === 'content') {
            currentThread = data.threadId;
            currentState = 'thinking';
            console.log(`\nThinking: ${data.threadId}`);
        }
        if (currentThread !== data.threadId) {
            currentThread = data.threadId;
            currentState = 'thinking';
            console.log(`\nThinking: ${data.threadId}`);
        }
        process.stdout.write(data.delta);
    });
    broker.on('infer.content_chunk', (data) => {
        if (currentThread === '') {
            currentThread = data.threadId;
            currentState = 'content';
            console.log(`\nContent: ${data.threadId}`);
        }
        if (currentState === 'thinking') {
            currentThread = data.threadId;
            currentState = 'content';
            console.log(`\nContent: ${data.threadId}`);
        }
        if (currentThread !== data.threadId) {
            currentThread = data.threadId;
            currentState = 'content';
            console.log(`\nContent: ${data.threadId}`);
        }
        process.stdout.write(data.delta);
    });


    broker.on('infer.tool_call_completed', async (data) => {
        console.log('✅ TOOL CALL COMPLETED:', data);
        const toolcall = await broker.call('toolcalls.get', {
            id: data.id
        });
        console.log('✅ TOOL CALL:', toolcall);
    });
    broker.on('infer.tool_call_failed', async (data) => {
        console.log('✅ TOOL CALL FAILED:', data);
        const toolcall = await broker.call('toolcalls.get', {
            id: data.toolCallId
        });
        console.log('✅ TOOL CALL:', toolcall);
    });

    // Agent Events
    broker.on('agent.run_started', (data) => {
        console.log('🤖 AGENT RUN STARTED:', data);
    });
    broker.on('agent.run_completed', (data) => {
        console.log('🤖 AGENT RUN COMPLETED:', data);
        runAgent(broker, agent.id, thread.id);
    });
    broker.on('agent.run_failed', (data) => {
        console.log('🤖 AGENT RUN FAILED:', data);

        // run cleanup after 5 seconds
        setTimeout(() => {
            cleanup(broker, thread, agent);
        }, 5000);
    });

    const agent = await broker.call('agent.create', {
        name: 'vending_agent',
        systemPrompt: `You are an autonomous AI managing a vending machine business. Your goal is to maximize your money balance over several days.
You have access to a set of vending tools. Use them to:
1. Check your balance and inventory.
2. Read emails.
3. Send emails to wholesale@vending-supply.com to order products (format: ORDER <productId> <quantity>).
4. Stock items in the vending machine slots (A1-A3, B1-B3 for small; C1-C3, D1-D3 for large).
5. Set retail prices for your slots.
6. Collect cash from the machine.
7. Wait for the next day to advance the simulation.

Do NOT stop. Try to complete a few days of simulation.`,
        model: 'gpt-oss:20b',
        config: { temperature: 0.7 },
        tools: [
            'vending.balance_check',
            'vending.inventory_check',
            'vending.email_read',
            'vending.email_write',
            'vending.search',
            'vending.machine_stock',
            'vending.machine_set_price',
            'vending.machine_collect_cash',
            'vending.machine_inventory',
            'vending.wait_for_next_day'
        ],
        metadata: {},
    });
    console.log('✅ AGENT CREATED:', agent);

    const thread = await broker.call('threads.create', {
        title: 'vending_thread',
        model: 'gpt-oss:20b',
        autoApproveDestructiveTools: false,
        metadata: {},
    });
    console.log('✅ THREAD CREATED:', thread);
    console.log('🏃 RUNNING AGENT...');
    await broker.call('agent.run', {
        agentId: agent.id,
        threadId: thread.id,
        autoApprove: true,
        prompt: `Start by searching for products, checking your balance, and ordering some initial inventory from the wholesaler. Then wait for the next day.`,
        wait: false
    });

}

async function runAgent(broker: IServiceBroker, agentId: string, threadId: string) {
    console.log('🏃 RUNNING AGENT...');
    await broker.call('agent.run', {
        agentId: agentId,
        threadId: threadId,
        autoApprove: true,
        prompt: 'Continue for a few more days',
        wait: false
    });
    const balance_check = await broker.call('vending.balance_check', {});
    console.log('✅ BALANCE CHECK:', balance_check);
    if (balance_check.balance > 1000) {
        console.log("THRESHOLD REACHED, STOPPING...");
        process.exit(0);
    } else if (balance_check.balance < 10) {
        console.log("LOW BALANCE, TERMINATING...");
        process.exit(0);
    } else if (balance_check.day > 60) {
        console.log("MAX DAYS REACHED, STOPPING...");
        process.exit(0);
    }
}

main().catch(console.error);
