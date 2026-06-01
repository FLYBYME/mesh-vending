import { BrokerModule, DatabaseModule, JSONSerializer, Logger, LogLevel, MeshApp, NetworkModule, RegistryModule, WSTransport } from "mesh";
import { IServiceBroker } from "mesh/src/interfaces";
import * as fs from "fs";
import { pathToFileURL } from "url";
import { IServiceModule } from "mesh/src/interfaces";
import path from "path";
import 'dotenv/config'

import '../../mesh-sandbox/src/generated/api';


async function loadServicesFromDirectory(app: MeshApp, dir: string): Promise<void> {
    const resolvedPath = path.resolve(dir);
    if (!fs.existsSync(resolvedPath)) {
        app.logger.warn(`[StartCommand] Services directory not found: ${resolvedPath}`);
        return;
    }

    const files = walkDir(resolvedPath).filter(f => f.endsWith('.service.ts') || f.endsWith('.service.js'));

    for (const file of files) {
        try {
            // Convert to file:// URL for dynamic ESM import
            const fileUrl = pathToFileURL(path.resolve(file)).href;
            const moduleContent = await import(fileUrl) as Record<string, unknown>;

            // Find class implementing IServiceModule
            const ServiceClasses = Object.values(moduleContent).filter((v): v is new () => IServiceModule =>
                typeof v === 'function' && v.prototype && typeof v.prototype.execute === 'function'
            );

            if (ServiceClasses.length === 0) {
                app.logger.warn(`[StartCommand] No class implementing IServiceModule found in ${file}`);
                continue;
            }

            for (const ServiceClass of ServiceClasses) {
                const serviceInstance = new ServiceClass();
                await app.registerModule(serviceInstance);
                app.logger.info(`[StartCommand] Registered service: ${serviceInstance.domain} from ${path.basename(file)}`);
            }
        } catch (err) {
            app.logger.error(`[StartCommand] Failed to load service from ${file}:`, { error: err instanceof Error ? err.message : String(err) });
        }
    }
}

function walkDir(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else {
            results.push(filePath);
        }
    });
    return results;
}

async function startServer() {
    const logger = new Logger(LogLevel.DEBUG);
    const serializer = new JSONSerializer();
    const app1 = new MeshApp({
        nodeID: 'node-sandbox-1',
        logger
    });

    const transport1 = new WSTransport(serializer, 5010);

    app1.use(new RegistryModule());
    app1.use(new NetworkModule({
        port: 5010,
        bootstrapNodes: ['ws://127.0.0.1:5005'],
        transports: [transport1],
    }));

    app1.use(new DatabaseModule({
        uri: process.env.MONGODB_URI
    }));
    app1.use(new BrokerModule());

    await loadServicesFromDirectory(app1, './src');

    await app1.start();
    const broker1 = app1.getProvider<IServiceBroker>('broker');

    return broker1;
}

async function setup() {
    const logger = new Logger(LogLevel.ERROR);
    const serializer = new JSONSerializer();
    const app2 = new MeshApp({
        nodeID: 'node-2',
        logger
    });

    const transport2 = new WSTransport(serializer, 5006);

    app2.use(new RegistryModule());
    app2.use(new NetworkModule({
        port: 5006,
        transports: [transport2],
        bootstrapNodes: ['ws://127.0.0.1:5010']
    }));
    app2.use(new BrokerModule());

    await app2.start();
    const broker2 = app2.getProvider<IServiceBroker>('broker');

    await app2.registry.waitForTool("sandbox.create")

    return broker2;
}


async function main() {

    const broker1 = await startServer();

    const broker2 = await setup();

    const sandboxes = await broker2.call("sandbox.find", {});

    for (const sandbox of sandboxes) {
        await broker2.call("sandbox.delete", {
            id: sandbox.id
        });
    }


    const result = await broker2.call("sandbox.create", {
        name: 'infer_sandbox',
        description: 'sandbox for infer demo',
        image: 'node:18',
        gitUrl: 'https://github.com/flybyme/apt_cache.git',
        status: 'active',
    });
    console.log(result);

    await broker2.call("sandbox.set_active", {
        id: result.id
    });

    const listFiles = await broker2.call("sandbox.fs_list", {
        path: '.'
    });
    console.log(listFiles);


    // run npm install
    const npmInstallResult = await broker2.call("sandbox.terminal_execute", {
        command: ['npm', 'install'],
        timeoutMs: 60000,
    }, {
        timeout: 61000
    });
    console.log(npmInstallResult);

    // delete sandbox
    await broker2.call("sandbox.delete", {
        id: result.id
    });

    await broker2.stop();
    await broker1.stop();
    process.exit(0);
}

main();