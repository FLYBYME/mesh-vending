import {
    ViewProvider, Shell, Tabs, Stack, Heading, Text, Button,
    Table, Theme, FormDialog, NotificationToast
} from '@flybyme/mesh-ui';
import { z } from '@flybyme/mesh';
import { vendingMachineInventoryContract } from 'src/vending/vending.contract';

export class VendingDashboardView implements ViewProvider {
    public readonly id = 'vending-ui';
    public readonly name = 'Vending Dashboard';
    public readonly version = '1.0.0';
    public readonly menus = [];

    private shell: Shell;
    private activeTab: string = 'overview';
    private contentContainer!: HTMLElement;

    // Data state
    private balanceData: { day: number, balance: number } | null = null;

    constructor(shell: Shell) {
        this.shell = shell;
    }

    public async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]): Promise<void> {
        const root = document.createElement('div');
        Object.assign(root.style, {
            display: 'flex', flexDirection: 'column', height: '100%',
            backgroundColor: Theme.colors.bgPrimary, color: Theme.colors.textMain
        });

        const tabs = new Tabs({
            items: [
                { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
                { id: 'storage', label: 'Storage', icon: 'fas fa-boxes' },
                { id: 'inbox', label: 'Inbox', icon: 'fas fa-envelope' }
            ],
            activeId: this.activeTab,
            onChange: (id) => { this.activeTab = id; this.renderContent(); }
        });

        const headerStack = new Stack({
            direction: 'column', gap: 'none',
            children: [
                new Stack({
                    direction: 'row', align: 'center', justify: 'space-between', gap: 'sm', children: [
                        new Heading({ level: 2, text: 'Vending Dashboard' }),
                        new Button({ label: 'Refresh', icon: 'fas fa-sync', onClick: () => this.renderContent() })
                    ]
                }),
                tabs
            ]
        });

        const headerEl = headerStack.getElement();
        headerEl.style.padding = `${Theme.spacing.md} ${Theme.spacing.lg} 0 ${Theme.spacing.lg}`;
        root.appendChild(headerEl);

        this.contentContainer = document.createElement('div');
        Object.assign(this.contentContainer.style, {
            flexGrow: '1', overflowY: 'auto', padding: Theme.spacing.lg,
            display: 'flex', flexDirection: 'column'
        });
        root.appendChild(this.contentContainer);
        container.appendChild(root);

        this.renderContent();

        const interval = setInterval(() => {
            this.renderContent(true);
        }, 5000);
        disposables.push({ dispose: () => clearInterval(interval) });
    }

    private async renderContent(silent = false) {
        if (!silent) this.contentContainer.innerHTML = 'Loading...';

        try {
            this.balanceData = await this.shell.app.call('vending.balance_check', {});
        } catch (e) {
            console.warn('Failed to fetch balance', e);
        }

        const container = document.createElement('div');
        Object.assign(container.style, { display: 'flex', flexDirection: 'column', gap: Theme.spacing.md, height: '100%' });

        // Status Bar
        if (this.balanceData) {
            const statusBar = new Stack({
                direction: 'row', align: 'center', justify: 'space-between',
                children: [
                    new Text({ text: `Day ${this.balanceData.day}`, variant: 'muted', weight: 'bold' }),
                    new Text({ text: `Balance: $${this.balanceData.balance.toFixed(2)}`, variant: 'main', weight: 'bold' })
                ]
            }).getElement();
            statusBar.style.padding = Theme.spacing.sm;
            statusBar.style.backgroundColor = 'rgba(0,0,0,0.1)';
            statusBar.style.borderRadius = '4px';
            container.appendChild(statusBar);
        }

        const tabContent = document.createElement('div');
        Object.assign(tabContent.style, { flexGrow: '1', display: 'flex', flexDirection: 'column' });
        container.appendChild(tabContent);

        switch (this.activeTab) {
            case 'overview': await this.renderOverviewTab(tabContent); break;
            case 'storage': await this.renderStorageTab(tabContent); break;
            case 'inbox': await this.renderInboxTab(tabContent); break;
        }

        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(container);
    }

    // ─── Overview ───

    private async renderOverviewTab(container: HTMLElement) {
        const actions = new Stack({
            direction: 'row', gap: 'sm',
            children: [
                new Button({ label: 'Collect Cash', icon: 'fas fa-coins', variant: 'primary', onClick: () => this.collectCash() }),
                new Button({ label: 'Advance Day', icon: 'fas fa-forward', onClick: () => this.advanceDay() }),
                new Button({ label: 'Set Price', icon: 'fas fa-tag', onClick: () => this.setPriceDialog() }),
                new Button({ label: 'Reset Sim', icon: 'fas fa-trash', variant: 'danger', onClick: () => this.resetSim() })
            ]
        });
        container.appendChild(actions.getElement());

        try {
            const slots = await this.shell.app.call('vending.machine_inventory', {});

            const table = new Table<any>({
                data: slots,
                columns: [
                    { key: 'slotId', header: 'Slot', width: '10%' },
                    { key: 'sizeAllowed', header: 'Size', width: '10%' },
                    { key: 'productName', header: 'Product', width: '30%', render: (row) => row.productName || 'Empty' },
                    { key: 'quantity', header: 'Qty', width: '15%' },
                    { key: 'retailPrice', header: 'Price', width: '15%', render: (row) => `$${row.retailPrice.toFixed(2)}` },
                    { key: 'uncollectedEarnings', header: 'Uncollected', width: '20%', render: (row) => `$${row.uncollectedEarnings.toFixed(2)}` }
                ],
                height: 'calc(100vh - 250px)'
            });

            const tableWrapper = document.createElement('div');
            tableWrapper.style.marginTop = Theme.spacing.md;
            tableWrapper.appendChild(table.getElement());
            container.appendChild(tableWrapper);
        } catch (e) {
            container.appendChild(new Text({ text: 'Failed to load slots', variant: 'error' }).getElement());
        }
    }

    private async collectCash() {
        try {
            const res = await this.shell.app.call('vending.machine_collect_cash', {});
            new NotificationToast({ message: `Collected $${res.collected.toFixed(2)}. New Balance: $${res.newBalance.toFixed(2)}`, type: 'success' }).show();
            this.renderContent();
        } catch (e: any) {
            new NotificationToast({ message: `Failed: ${e.message}`, type: 'error' }).show();
        }
    }

    private async advanceDay() {
        try {
            const res = await this.shell.app.call('vending.wait_for_next_day', {});
            new NotificationToast({ message: `Advanced to Day ${res.day}. ${res.message}`, type: 'info' }).show();
            this.renderContent();
        } catch (e: any) {
            new NotificationToast({ message: `Failed: ${e.message}`, type: 'error' }).show();
        }
    }

    private setPriceDialog() {
        FormDialog.show({
            title: 'Set Retail Price', fields: [
                { id: 'slotId', label: 'Slot ID (e.g. A1, C2)', type: 'text', required: true },
                { id: 'price', label: 'Price ($)', type: 'text', required: true }
            ]
        }).then(async (data: any) => {
            if (data) {
                try {
                    await this.shell.app.call('vending.machine_set_price', {
                        slotId: data.slotId.toUpperCase(),
                        price: parseFloat(data.price)
                    });
                    new NotificationToast({ message: 'Price updated', type: 'success' }).show();
                    this.renderContent();
                } catch (e: any) {
                    new NotificationToast({ message: `Failed: ${e.message}`, type: 'error' }).show();
                }
            }
        });
    }

    private resetSim() {
        FormDialog.show({
            title: 'Reset Simulation (Type YES)', fields: [
                { id: 'confirm', label: 'Confirm', type: 'text', required: true }
            ]
        }).then(async (data: any) => {
            if (data && data.confirm === 'YES') {
                try {
                    const res = await this.shell.app.call('vending.reset', {});
                    new NotificationToast({ message: res.message, type: 'success' }).show();
                    this.renderContent();
                } catch (e: any) {
                    new NotificationToast({ message: `Failed: ${e.message}`, type: 'error' }).show();
                }
            }
        });
    }

    // ─── Storage ───

    private async renderStorageTab(container: HTMLElement) {
        const actions = new Stack({
            direction: 'row', gap: 'sm',
            children: [
                new Button({ label: 'Stock Machine', icon: 'fas fa-box-open', variant: 'primary', onClick: () => this.stockMachineDialog() })
            ]
        });
        container.appendChild(actions.getElement());

        try {
            const inventory = await this.shell.app.call('vending.inventory_check', {});

            const table = new Table<any>({
                data: inventory,
                columns: [
                    { key: 'productId', header: 'Product ID', width: '20%' },
                    { key: 'name', header: 'Name', width: '40%' },
                    { key: 'quantity', header: 'Qty', width: '20%' },
                    { key: 'wholesalePrice', header: 'Wholesale Cost', width: '20%', render: (row) => `$${row.wholesalePrice.toFixed(2)}` }
                ],
                height: 'calc(100vh - 250px)'
            });

            const tableWrapper = document.createElement('div');
            tableWrapper.style.marginTop = Theme.spacing.md;
            tableWrapper.appendChild(table.getElement());
            container.appendChild(tableWrapper);
        } catch (e) {
            container.appendChild(new Text({ text: 'Failed to load storage inventory', variant: 'error' }).getElement());
        }
    }

    private stockMachineDialog() {
        FormDialog.show({
            title: 'Stock Machine', fields: [
                { id: 'slotId', label: 'Slot ID (e.g. A1)', type: 'text', required: true },
                { id: 'productId', label: 'Product ID', type: 'text', required: true },
                { id: 'quantity', label: 'Quantity', type: 'text', required: true }
            ]
        }).then(async (data: any) => {
            if (data) {
                try {
                    await this.shell.app.call('vending.machine_stock', {
                        slotId: data.slotId.toUpperCase(),
                        productId: data.productId,
                        quantity: parseInt(data.quantity)
                    });
                    new NotificationToast({ message: 'Machine stocked successfully', type: 'success' }).show();
                    this.renderContent();
                } catch (e: any) {
                    new NotificationToast({ message: `Failed: ${e.message}`, type: 'error' }).show();
                }
            }
        });
    }

    // ─── Inbox ───

    private async renderInboxTab(container: HTMLElement) {
        const actions = new Stack({
            direction: 'row', gap: 'sm',
            children: [
                new Button({ label: 'Search Wholesaler', icon: 'fas fa-search', onClick: () => this.searchDialog() }),
                new Button({ label: 'Send Email / Order', icon: 'fas fa-paper-plane', variant: 'primary', onClick: () => this.sendEmailDialog() })
            ]
        });
        container.appendChild(actions.getElement());

        try {
            const emails = await this.shell.app.call('vending.email_read', {});

            const emailsContainer = document.createElement('div');
            Object.assign(emailsContainer.style, {
                display: 'flex', flexDirection: 'column', gap: Theme.spacing.sm,
                marginTop: Theme.spacing.md, overflowY: 'auto', flexGrow: '1'
            });

            if (emails.length === 0) {
                emailsContainer.appendChild(new Text({ text: 'Inbox is empty', variant: 'muted' }).getElement());
            } else {
                emails.forEach((e: any) => {
                    const emailCard = document.createElement('div');
                    Object.assign(emailCard.style, {
                        padding: Theme.spacing.md,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: `1px solid ${Theme.colors.border}`,
                        borderRadius: '6px'
                    });

                    emailCard.appendChild(new Text({ text: `Day ${e.dayReceived} - From: ${e.from}`, weight: 'bold', variant: 'muted' }).getElement());
                    emailCard.appendChild(new Heading({ level: 4, text: e.subject }).getElement());

                    const bodyText = document.createElement('pre');
                    bodyText.textContent = e.body;
                    Object.assign(bodyText.style, {
                        marginTop: Theme.spacing.sm,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit',
                        fontSize: '0.9em'
                    });
                    emailCard.appendChild(bodyText);

                    emailsContainer.appendChild(emailCard);
                });
            }
            container.appendChild(emailsContainer);
        } catch (e) {
            container.appendChild(new Text({ text: 'Failed to load emails', variant: 'error' }).getElement());
        }
    }

    private searchDialog() {
        FormDialog.show({
            title: 'Search', fields: [
                { id: 'query', label: 'Search Query', type: 'text', required: true }
            ]
        }).then(async (data: any) => {
            if (data) {
                try {
                    new NotificationToast({ message: 'Searching...', type: 'info' }).show();
                    const res = await this.shell.app.call('vending.search', { query: data.query });

                    const dialogContainer = document.createElement('div');
                    Object.assign(dialogContainer.style, {
                        position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%, 0)',
                        backgroundColor: Theme.colors.bgPrimary, border: `1px solid ${Theme.colors.border}`,
                        padding: Theme.spacing.lg, zIndex: '1000', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto'
                    });

                    const title = new Heading({ level: 3, text: 'Search Results' });
                    dialogContainer.appendChild(title.getElement());

                    const pre = document.createElement('pre');
                    pre.textContent = res.results;
                    pre.style.whiteSpace = 'pre-wrap';
                    pre.style.marginTop = Theme.spacing.md;
                    dialogContainer.appendChild(pre);

                    const closeBtn = new Button({ label: 'Close', onClick: () => document.body.removeChild(dialogContainer) });
                    dialogContainer.appendChild(closeBtn.getElement());

                    document.body.appendChild(dialogContainer);

                } catch (e: any) {
                    new NotificationToast({ message: `Failed: ${e.message}`, type: 'error' }).show();
                }
            }
        });
    }

    private sendEmailDialog() {
        FormDialog.show({
            title: 'Send Email / Order', fields: [
                { id: 'to', label: 'To', type: 'text', required: true },
                { id: 'subject', label: 'Subject', type: 'text', required: true },
                { id: 'body', label: 'Body', type: 'text', required: true },
                { id: 'productId', label: 'Product ID (for orders)', type: 'text', required: false },
                { id: 'quantity', label: 'Quantity (for orders)', type: 'text', required: false }
            ]
        }).then(async (data: any) => {
            if (data) {
                let orderDetails = undefined;
                if (data.productId && data.quantity) {
                    orderDetails = [{ productId: data.productId, quantity: parseInt(data.quantity) }];
                }
                try {
                    await this.shell.app.call('vending.email_write', {
                        to: data.to,
                        subject: data.subject,
                        body: data.body,
                        //orderDetails: orderDetails
                    });
                    new NotificationToast({ message: 'Email sent successfully', type: 'success' }).show();
                    this.renderContent();
                } catch (e: any) {
                    new NotificationToast({ message: `Failed: ${e.message}`, type: 'error' }).show();
                }
            }
        });
    }
}