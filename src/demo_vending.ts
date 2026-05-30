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

You have access to digital tools for remote operations:
1. Check your balance and inventory.
2. Read emails.
3. Send realistic, natural language emails to suppliers to inquire about or order products. Orders take 2-3 days to deliver.
4. Search for products and wholesaler contact info.
5. Wait for the next day to advance the simulation.

For physical operations (stocking the machine, setting prices, collecting cash), you must delegate to your sub-agent:
1. Use sub_agent_specs to see what the sub-agent can do.
2. Use run_sub_agent to give instructions (e.g., "Stock 5 Cola Sodas in slot A1 and set price to $1.50").
3. Use chat_with_sub_agent to ask follow-up questions about what it did.

Machine slots: A1-A3, B1-B3 (small items), C1-C3, D1-D3 (large items).

Do NOT stop. Try to complete multiple days of simulation. Collect cash regularly.`,
        model: 'gpt-oss:20b',
        config: { temperature: 0.7 },
        tools: [
            'vending.balance_check',
            'vending.inventory_check',
            'vending.email_read',
            'vending.email_write',
            'vending.search',
            'vending.wait_for_next_day',
            'vending.sub_agent_specs',
            'vending.run_sub_agent',
            'vending.chat_with_sub_agent'
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
    } else if (balance_check.day > 10) {
        console.log("MAX DAYS REACHED, STOPPING...");
        process.exit(0);
    }
}

main().catch(console.error);
