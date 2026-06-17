import { IServiceBroker } from '@flybyme/mesh';
import { Extension, Shell, ViewProvider } from '@flybyme/mesh-ui';
import { VendingDashboardView } from './views/VendingDashboardView.js';

export class VendingExtension implements Extension {
    public readonly id = 'vending-ui';
    public readonly name = 'Vending Dashboard';
    public readonly version = '1.0.0';
    public readonly menus = [{
        id: 'activity-bar:vending-ui',
        label: 'Vending Dashboard',
        icon: 'fas fa-coffee',
        command: 'vending.open-dashboard'
    }];

    public async activate(shell: Shell): Promise<void> {
        console.log('[VendingExtension] Activating...');

        // Register Views
        shell.views.registerProvider('center-panel', new VendingDashboardView(shell));

        shell.commands.register({
            id: 'vending.open-dashboard',
            label: 'Vending Dashboard',
            handler: () => {
                shell.tabs.openTab({
                    id: 'vending-dashboard-tab',
                    title: 'Vending Dashboard',
                    icon: 'fas fa-coffee',
                    providerId: 'vending-ui'
                });
            }
        });

        // Register Activity Bar Item
        shell.activityBar.registerItem({
            id: 'vending-ui',
            icon: 'fas fa-coffee',
            title: 'Vending Dashboard',
            location: 'center-panel',
            order: 160
        });
    }

    public deactivate(): void {
        console.log('[VendingExtension] Deactivating...');
    }
}
