import { IServiceBroker } from '@flybyme/mesh';
import { Extension, Shell, ViewProvider, MenuItemProps } from '@flybyme/mesh-ui';
import { VendingDashboardView } from './views/VendingDashboardView.js';

export class VendingExtension implements Extension {
    public readonly id = 'vending-ui';
    public readonly name = 'Vending Dashboard';
    public readonly version = '1.0.0';
    public readonly menus: MenuItemProps[] = [];

    public async activate(shell: Shell): Promise<void> {
        console.log('[VendingExtension] Activating...');

        shell.activityBar.registerItem({
            id: 'activity-bar:vending-ui',
            icon: 'fas fa-coffee',
            title: 'Vending Dashboard',
            location: 'left-panel',
            order: 110,
            onClick: () => shell.commands.execute('vending.open-dashboard')
        });

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
    }

    public deactivate(): void {
        console.log('[VendingExtension] Deactivating...');
    }
}
