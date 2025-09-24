import { ipcMain, shell } from "electron";
import windowControl from "./windowControl.js";
import createNewTab from "./createNewTab.js";
import closeTab from "./closeTab.js";
import switchTab from "./switchTab.js";
import reloadTab from "./reloadTab.js";
import goBack from "./goBack.js";
import goForward from "./goForward.js";
import updateTabUrl from "./updateTabUrl.js";
import getHistoryDb from "./getHistory.db.js";
import getDownloadsDb from "./getDownloads.db.js";
import deleteDownloadItemDb from "./deleteDownloadItem.db.js";
import openInFileManager from "./openInFileManager.js";

export default (mainWindow, TabsClient, db) => {
    ipcMain.on(`window-control`, windowControl(mainWindow))

    ipcMain.on(`create-new-tab`, createNewTab(TabsClient));

    ipcMain.on(`close-tab`, closeTab(TabsClient));

    ipcMain.on(`switch-tab`, switchTab(TabsClient));

    ipcMain.on(`reload-tab`, reloadTab(TabsClient))

    ipcMain.on(`go-back`, goBack(TabsClient))

    ipcMain.on(`go-forward`, goForward(TabsClient))

    ipcMain.on(`update-tab-url`, updateTabUrl(TabsClient))

    ipcMain.handle(`get-history:db`, getHistoryDb(db))

    ipcMain.handle(`get-downloads:db`, getDownloadsDb(db));

    ipcMain.on(`delete-download-item:db`, deleteDownloadItemDb(db));

    ipcMain.on(`open-in-file-manager`, openInFileManager())
}