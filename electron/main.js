import { app, BrowserWindow, ipcMain } from 'electron';
import path from "path";
import { fileURLToPath } from 'url';
import TabsManager from './libs/tabsManager.js';
import db, { connect } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let mainWindow;
export let TabsClient;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.cjs')
        },
        show: false,
        frame: false
    });

    const startUrl = !app.isPackaged ? 'http://localhost:5173' : `file://${__dirname, '/dist-react/index.html'}`;

    mainWindow.loadURL(startUrl);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.on('resize', () => {
        const currentView = mainWindow.getBrowserView();
        if (currentView) {
            const bounds = mainWindow.getBounds();

            currentView.setBounds({
                x: 0,
                y: 80,
                width: bounds.width,
                height: bounds.height - 80
            });
        }
    });

    TabsClient = new TabsManager(mainWindow);

    await connect();
    console.log(db().exec(`SELECT * FROM history`))
    return mainWindow;
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Re-create window on macOS when dock icon is clicked
app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        await createWindow();
    }
});

ipcMain.on(`window-control`, (_, action) => {

    if (!mainWindow) return;

    switch (action) {
        case "minimize":
            mainWindow.minimize();
            break;
        case "maximize":
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
            break;
        case "close":
            mainWindow.close();
            break;
    }
})

ipcMain.on(`create-new-tab`, (_, action) => {
    const { tabId, url } = action;

    if (!tabId) return;

    TabsClient.createTab(tabId, url);
});

ipcMain.on(`close-tab`, (_, action) => {
    const tabId = action;

    if (!tabId) return;

    TabsClient.closeTab(tabId);
});

ipcMain.on(`switch-tab`, (_, action) => {
    const tabId = action;

    if (!tabId) return;

    TabsClient.switchToTab(tabId);

    // Update bounds
    TabsClient.updateActiveTabBounds();
});

ipcMain.on(`reload-tab`, (_, action) => {
    const tabId = action;

    if (!tabId) return;

    TabsClient.reloadTab(tabId);
})

ipcMain.on(`go-back`, (_, action) => {

    TabsClient.goBack();
})

ipcMain.on(`go-forward`, (_, action) => {

    TabsClient.goForward();
})

ipcMain.on(`update-tab-url`, (_, action) => {
    const { tabId, url } = action;

    if (!tabId) return;

    TabsClient.updateTabUrl(tabId, url);
})