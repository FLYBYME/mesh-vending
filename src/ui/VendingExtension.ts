import { Extension, ExtensionContext } from 'mesh-ui/core';
import { BaseComponent } from 'mesh-ui/ui-lib';

class VendingDashboardView extends BaseComponent {
    private shell: any;
    private network: any;

    constructor(shell: any) {
        super('div');
        this.shell = shell;
        this.network = shell.getNetwork();
        this.addClasses('vending-dashboard');
        this.applyStyles({
            padding: '20px',
            color: 'var(--text-main)',
            height: '100%',
            overflowY: 'auto'
        });
    }

    async render() {
        this.element.innerHTML = `
            <h1 style="margin-bottom: 20px; font-size: 1.5em; border-bottom: 1px solid var(--border); padding-bottom: 10px;">Vending Dashboard</h1>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                <div style="flex: 1; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid var(--border);">
                    <div style="font-size: 0.9em; color: var(--text-muted);">Day</div>
                    <div id="vending-day" style="font-size: 2em; font-weight: bold;">--</div>
                </div>
                <div style="flex: 1; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid var(--border);">
                    <div style="font-size: 0.9em; color: var(--text-muted);">Balance</div>
                    <div id="vending-balance" style="font-size: 2em; font-weight: bold; color: #4caf50;">$--</div>
                </div>
            </div>

            <button id="next-day-btn" style="width: 100%; margin-bottom: 20px; padding: 10px; background: #007acc; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                Advance to Next Day
            </button>

            <h3 style="margin-bottom: 10px; color: var(--text-muted);">Storage Inventory</h3>
            <div id="inventory-list" style="margin-bottom: 20px; background: rgba(0,0,0,0.1); border-radius: 8px; padding: 10px; border: 1px solid var(--border); min-height: 50px;">
                Loading...
            </div>

            <h3 style="margin-bottom: 10px; color: var(--text-muted);">Machine Slots</h3>
            <div id="machine-slots" style="background: rgba(0,0,0,0.1); border-radius: 8px; padding: 10px; border: 1px solid var(--border); min-height: 50px;">
                Loading...
            </div>
        `;

        const nextDayBtn = this.element.querySelector('#next-day-btn') as HTMLButtonElement;
        
        nextDayBtn.addEventListener('click', async () => {
            nextDayBtn.disabled = true;
            nextDayBtn.textContent = 'Advancing...';
            try {
                await this.callTool('vending.wait_for_next_day', {});
                await this.refreshData();
            } catch (err) {
                console.error(err);
            } finally {
                nextDayBtn.disabled = false;
                nextDayBtn.textContent = 'Advance to Next Day';
            }
        });

        // Listen for network events
        if (this.network) {
            this.network.on('vending.day_advanced', () => this.refreshData());
        }

        await this.refreshData();
    }

    private async refreshData() {
        try {
            const [balanceData, inventoryData, machineData] = await Promise.all([
                this.callTool('vending.balance_check', {}),
                this.callTool('vending.inventory_check', {}),
                this.callTool('vending.machine_inventory', {})
            ]);

            const dayEl = this.element.querySelector('#vending-day');
            const balanceEl = this.element.querySelector('#vending-balance');
            const inventoryEl = this.element.querySelector('#inventory-list');
            const machineEl = this.element.querySelector('#machine-slots');

            if (dayEl) dayEl.textContent = balanceData.day.toString();
            if (balanceEl) balanceEl.textContent = `$${balanceData.balance.toFixed(2)}`;

            if (inventoryEl) {
                if (inventoryData.length === 0) {
                    inventoryEl.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 10px;">Empty</div>';
                } else {
                    inventoryEl.innerHTML = inventoryData.map((item: any) => `
                        <div style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between;">
                            <span>${item.name} <span style="color:var(--text-muted); font-size:0.8em;">(${item.productId})</span></span>
                            <span>Qty: <strong>${item.quantity}</strong></span>
                        </div>
                    `).join('');
                }
            }

            if (machineEl) {
                machineEl.innerHTML = machineData.map((slot: any) => {
                    const status = slot.productId 
                        ? `<span style="color: #4caf50;">${slot.productName}</span> (Qty: ${slot.quantity})` 
                        : `<span style="color: var(--text-muted);">EMPTY</span>`;
                    
                    return `
                        <div style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <strong>${slot.slotId}</strong>
                                <span style="font-size: 0.8em; color: var(--text-muted); text-transform: uppercase;">${slot.sizeAllowed}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.9em;">
                                <span>${status}</span>
                                <span>$${slot.retailPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }

        } catch (err) {
            console.error('Refresh error:', err);
        }
    }

    private async callTool(action: string, input: any): Promise<any> {
        if (!this.network) throw new Error('No network connection');
        
        await this.network.registry.waitForTool(action, 5000);
        const targetNode = this.network.registry.selectNode(action);
        if (!targetNode) throw new Error(`Tool ${action} not found`);

        return new Promise((resolve, reject) => {
            const reqId = `req_${Math.random().toString(36).substr(2, 9)}`;
            const handler = (data: any, packet: any) => {
                if (packet.id === reqId) {
                    this.network.unsubscribe('*', handler);
                    if (packet.type === 'RESPONSE') resolve(data);
                    else if (packet.type === 'RESPONSE_ERROR') reject(new Error(packet.error?.message || 'Unknown error'));
                }
            };
            this.network.onMessage('*', handler);
            this.network.send(targetNode.nodeID, action, input, { type: 'REQUEST', id: reqId });
            setTimeout(() => {
                this.network.unsubscribe('*', handler);
                reject(new Error(`Timeout calling ${action}`));
            }, 5000);
        });
    }
}

export default class VendingExtension implements Extension {
    public readonly id = 'vending-ext';
    public readonly name = 'Vending Dashboard';
    public readonly version = '1.0.0';
    public readonly menus = [];

    async activate(context: ExtensionContext) {
        console.log('Vending Extension Activated');

        context.shell.views.registerProvider('left-panel', {
            id: 'vending.main',
            name: 'Vending Dashboard',
            resolveView: async (container: HTMLElement) => {
                const view = new VendingDashboardView(context.shell);
                await view.render();
                view.mount(container);
            }
        });

        context.shell.activityBar.registerItem({
            id: 'vending.main',
            location: 'left-panel',
            icon: 'fas fa-store',
            title: 'Vending Dashboard',
            order: 5
        });
    }
}