const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    windowMinimize: () => ipcRenderer.send(`window-control`, `minimize`),
    windowMaximize: () => ipcRenderer.send(`window-control`, `maximize`),
    windowClose: () => ipcRenderer.send(`window-control`, `close`),
    createNewTab: ({ tabId, url }) => ipcRenderer.send(`create-new-tab`, { tabId, url }),
    closeTab: ({ tabId }) => ipcRenderer.send(`close-tab`, `${tabId}`),
    switchTab: ({ tabId }) => ipcRenderer.send(`switch-tab`, `${tabId}`),

    onTabCreated: (callback) => ipcRenderer.on(`tab-created`, callback),
    onTabTitleUpdated: (callback) => ipcRenderer.on(`tab-title-updated`, callback),
    onTabUrlUpdated: (callback) => ipcRenderer.on('tab-url-updated', callback),
    onTabLoadingStart: (callback) => ipcRenderer.on('tab-loading-start', callback),
    onTabLoadingStop: (callback) => ipcRenderer.on('tab-loading-stop', callback),
    onTabFaviconUpdated: (callback) => ipcRenderer.on('tab-favicon-updated', callback),
    onTabSwitched: (callback) => ipcRenderer.on(`tab-switched`, callback),
})