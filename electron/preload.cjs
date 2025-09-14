const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    windowMinimize: () => ipcRenderer.send(`window-control`, `minimize`),
    windowMaximize: () => ipcRenderer.send(`window-control`, `maximize`),
    windowClose: () => ipcRenderer.send(`window-control`, `close`),
})