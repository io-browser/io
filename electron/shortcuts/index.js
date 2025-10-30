import { Menu, MenuItem } from "electron"
import { CPShift, CTR } from "./constants.js"
import { nanoid } from "@reduxjs/toolkit"

export default (mainWindow, TabsClient) => {

    const menu = new Menu();

    // TODO: CMD/CTR + B - Toggle Manu Bar

    // CMD/CTR + D - Bookmark Page
    menu.append(new MenuItem({
        accelerator: `${CTR}+D`,
        click: () => {
            if (!TabsClient.activeTabId) return;
            const tab = TabsClient.tabs.get(TabsClient.activeTabId);

            if (!tab) return;

            TabsClient.bookmarkActiveTab();
        },
        label: 'Bookmark Active Tab'
    }));

    // CMD/CTR + H - Open History Page
    menu.append(new MenuItem({
        accelerator: `${CTR}+H`,
        click: () => {
            if (!TabsClient.activeTabId) return;
            const tab = TabsClient.tabs.get(TabsClient.activeTabId);

            if (!tab) return;

            TabsClient.updateTabUrl(TabsClient.activeTabId, `io://history`)
        },
        label: 'Open History Page'
    }));

    // CMD/CTR + j - Open Downloads Page
    menu.append(new MenuItem({
        accelerator: `${CTR}+J`,
        click: () => {
            if (!TabsClient.activeTabId) return;
            const tab = TabsClient.tabs.get(TabsClient.activeTabId);

            if (!tab) return;

            TabsClient.updateTabUrl(TabsClient.activeTabId, `io://downloads`)
        },
        label: 'Open Downloads Page'
    }));

    // CMD/CTR + N - Open New Tab
    menu.append(new MenuItem({
        accelerator: `${CTR}+N`,
        click: () => {
            mainWindow.webContents.send(`tab-created`, { tabId: nanoid(), tabFavicon: null, tabTitle: `New Tab`, tabUrl: `https://startpage.com` })
        },
        label: 'Open New Tab'
    }));

    // CMD/CTR + (Shift + ) R - Reload Active Tab
    menu.append(new MenuItem({
        accelerator: `${CTR}+R`,
        click: () => {
            if (!TabsClient.activeTabId) return;
            TabsClient.reloadTab(TabsClient.activeTabId);
        },
        label: 'Reload Active Tab'
    }));

    menu.append(new MenuItem({
        accelerator: `${CPShift}+R`,
        click: () => {
            if (!TabsClient.activeTabId) return;
            TabsClient.reloadTab(TabsClient.activeTabId);
        },
        label: 'Reload Active Tab'
    }));

    // TODO: CMD/CTR + U - View Source Code in New Tab

    // CMD/CTR + W - Close Active Tab
    menu.append(new MenuItem({
        accelerator: `${CTR}+W`,
        click: () => {
            if (!TabsClient.activeTabId) return;
            mainWindow.webContents.send(`tab-closed`, { tabId: TabsClient.activeTabId })
        },
        label: 'Close Active Tab'
    }));


    /**
     * CTR + Shift Commands
    */


    // CMD/CTR + Shift + I - Toggle Dev Tools
    menu.append(new MenuItem({
        accelerator: `${CPShift}+I`,
        click: () => {

            TabsClient.toggleDevTools();
        },
        label: 'Toggle Dev Tools'
    }));

    // CMD/CTR + Shift + O - Open Bookmarks Page
    menu.append(new MenuItem({
        accelerator: `${CPShift}+O`,
        click: () => {
            if (!TabsClient.activeTabId) return;
            const tab = TabsClient.tabs.get(TabsClient.activeTabId);

            if (!tab) return;

            TabsClient.updateTabUrl(TabsClient.activeTabId, `io://bookmarks`)
        },
        label: 'Open Bookmarks Manager Page'
    }));

    // CMD/CTR + Shift + B - Toggle Bookmarks Section
    menu.append(new MenuItem({
        accelerator: `${CPShift}+B`,
        click: () => {
            TabsClient.toggleBookmarksSection();
        },
        label: 'Open Bookmarks Manager Page'
    }));

    Menu.setApplicationMenu(menu);
}