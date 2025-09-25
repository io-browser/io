import { ipcMain } from "electron";
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
import getBookmarksDb from "./getBookmarks.db.js";
import deleteBookmarkDb from "./deleteBookmark.db.js";
import updateBookmarkNameDb from "./updateBookmarkName.db.js";
import bookmarkUrlExistDb from "./bookmarkUrlExist.db.js";
import bookmarkActiveTabDb from "./bookmarkActiveTab.db.js";
import deleteBookmarkFromActiveTabDb from "./deleteBookmarkFromActiveTab.db.js";

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

    ipcMain.handle(`bookmark-active-tab:db`, bookmarkActiveTabDb(TabsClient));

    ipcMain.handle(`delete-bookmark-active-tab:db`, deleteBookmarkFromActiveTabDb(TabsClient));

    ipcMain.handle(`get-bookmarks:db`, getBookmarksDb(db));

    ipcMain.handle(`delete-bookmark:db`, deleteBookmarkDb(mainWindow, db));

    ipcMain.handle(`update-bookmark-name:db`, updateBookmarkNameDb(db));

    ipcMain.handle(`bookmark-url-exist:db`, bookmarkUrlExistDb(db));

    ipcMain.on(`open-in-file-manager`, openInFileManager())
}