import { WebContentsView } from "electron";
import { nanoid } from "@reduxjs/toolkit";

export default class TabsManager {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.activeTabId = null;
        this.tabs = new Map();
        this.uiHieght = 80; // 80px

        this.setupResizeHandling();
    }

    createTab(tabId, url = 'https://startpage.com/') {

        const view = new WebContentsView({
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: true,
                webSecurity: true,
                allowRunningInsecureContent: false,
                experimentalFeatures: false,
            }
        });

        this.tabs.set(tabId, {
            view,
            url,
            favicon: null,
            title: 'New Tab',
            isLoading: false,
        });

        this.initializeTabEventListeners(tabId)

        // TODO: Add switchTab method call.

        this.activeTabId = tabId;
        this.mainWindow.contentView.addChildView(view)
        view.webContents.loadURL(url);
        view.setBounds({ x: 0, y: 80, width: this.mainWindow.getBounds().width, height: this.mainWindow.getBounds().height - 80 });

        // this.mainWindow.webContents.send('tab-created', {
        //     tabId,
        //     isActive: true,
        //     favicon: null,
        //     title: 'New Tab',
        //     url,
        // });
    }

    closeTab(tabId) {

        if (Array.from(this.tabs).length <= 1) return;

        const tab = this.tabs.get(tabId);
        if (!tab) {
            console.error(`Tab ${tabId} not found`);
            return false;
        }

        // If this is the active tab, we need to switch to another
        const wasActive = this.activeTabId == tabId;

        // Remove from window if active
        if (wasActive) {
            this.mainWindow.contentView.removeChildView(tab.view);
            this.activeTabId = null;
        }

        // Destroy the webContents to free memory
        if (!tab.view.webContents.isDestroyed()) {
            tab.view.webContents.removeAllListeners()
            tab.view.webContents.destroy();
        }

        // Remove from tabs map
        this.tabs.delete(tabId);

        // If this was the active tab, switch to another tab
        if (wasActive && this.tabs.size > 0) {
            // Switch to the last tab
            const remainingTabs = Array.from(this.tabs.keys());
            const nextTabId = remainingTabs[remainingTabs.length - 1];
            this.activeTabId = nextTabId;
            this.switchToTab(nextTabId);
        }
    }

    initializeTabEventListeners(tabId) {

        const tab = this.tabs.get(tabId);

        if (!tab) {
            console.error(`Tab does not found`, tabId);
            return null;
        }

        tab.view.webContents.on(`page-title-updated`, (_, title) => {
            tab.title = title;

            this.mainWindow.webContents.send('tab-title-updated', { tabId, title });
        });

        tab.view.webContents.on('page-favicon-updated', (event, favicons) => {
            const favicon = favicons.length > 0 ? favicons[0] : null;
            tab.favicon = favicon;
            this.mainWindow.webContents.send('tab-favicon-updated', { tabId, favicon });
        });

        tab.view.webContents.on('did-start-loading', () => {
            tab.isLoading = true;
            this.mainWindow.webContents.send('tab-loading-start', { tabId });
        });

        tab.view.webContents.on('did-stop-loading', () => {
            tab.isLoading = false;
            this.mainWindow.webContents.send('tab-loading-stop', { tabId });
        });

        tab.view.webContents.setWindowOpenHandler(({ url, frameName, _, disposition }) => {

            const newTabId = nanoid();

            if (disposition === 'new-window' || disposition === 'foreground-tab') {
                this.mainWindow.webContents.send('tab-created', {
                    tabId: newTabId,
                    isActive: true,
                    favicon: tab.favicon,
                    title: tab.title,
                    url,
                });
            } else if (disposition === 'background-tab') {
                this.mainWindow.webContents.send('tab-created', {
                    tabId: newTabId,
                    isActive: true,
                    favicon: null,
                    title: 'New Tab',
                    url,
                });
            } else {
                this.mainWindow.webContents.send('tab-created', {
                    tabId: newTabId,
                    isActive: true,
                    favicon: tab.favicon,
                    title: tab.title,
                    url,
                });
            }
            return { action: 'deny' };
        });

        tab.view.webContents.on('did-navigate', (_, url) => {
            tab.url = url;

            this.mainWindow.webContents.send('tab-url-updated', {
                tabId,
                url,
            });
        });

        tab.view.webContents.on('did-navigate-in-page', (event, url, isMainFrame) => {
            if (isMainFrame) {
                tab.url = url;

                this.mainWindow.webContents.send('tab-url-updated', {
                    tabId,
                    url,
                });
            }
        });
    }

    switchToTab(tabId, uiDimensions = null) {

        if (Array.from(this.tabs).length <= 1) return;

        const tab = this.tabs.get(tabId);
        const activeTab = this.tabs.get(this.activeTabId);

        if (!tab) {
            console.error(`Tab ${tabId} not found`);
            return false;
        }

        // Hide current active tab
        if (this.activeTabId && this.activeTabId !== tabId) {
            const currentTab = this.tabs.get(this.activeTabId);
            if (currentTab) {
                this.mainWindow.contentView.removeChildView(currentTab.view);
            }
        }

        this.mainWindow.contentView.removeChildView(activeTab.view)
        this.mainWindow.contentView.addChildView(tab.view)

        this.activeTabId = tabId;

        // Focus the webContents
        tab.view.webContents.focus();

        // Notify renderer
        this.mainWindow.webContents.send('tab-switched', {
            tabId,
            url: tab.url,
            title: tab.title
        });

        return true;
    }

    reloadTab(tabId) {

        const tab = this.tabs.get(tabId);

        if (!tab) {
            console.error(`Tab ${tabId} not found`);
            return false;
        }

        tab.view.webContents.reload()
    }

    setupResizeHandling() {
        // Handle resize events
        this.mainWindow.on('resize', () => {
            this.updateActiveTabBounds();
        });

        // Handle window state changes
        this.mainWindow.on('maximize', () => {
            this.updateActiveTabBounds();
        });

        this.mainWindow.on('unmaximize', () => {
            this.updateActiveTabBounds();
        });

        this.mainWindow.on('restore', () => {
            this.updateActiveTabBounds();
        });
    }

    updateActiveTabBounds() {
        if (this.activeTabId) {
            const activeTab = this.tabs.get(this.activeTabId);
            if (activeTab) {
                this.updateSingleTabBounds(activeTab.view);
            }
        }
    }

    updateSingleTabBounds(view) {
        const windowBounds = this.mainWindow.getBounds();

        const newBounds = {
            x: 0,
            y: this.uiHieght,
            width: windowBounds.width,
            height: windowBounds.height - this.uiHieght
        };

        view.setBounds(newBounds);
    }
}