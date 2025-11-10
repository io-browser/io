import { app, BrowserWindow, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import TabsManager from "./libs/tabsManager.js";
import db, { connect, saveDb } from "./config/db.js";
import shortcuts from "./shortcuts/index.js";
import controllers from "./controllers/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let mainWindow;
export let TabsClient;

export async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
    show: false,
    frame: false,
  });

  const startUrl = !app.isPackaged
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "../dist/index.html#")}`;

  mainWindow.loadURL(startUrl);

  if (!app.isPackaged) mainWindow.webContents.openDevTools();

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.on("resize", () => {
    const currentView = mainWindow.getBrowserView();
    if (currentView) {
      const bounds = mainWindow.getBounds();

      currentView.setBounds({
        x: 0,
        y: 80,
        width: bounds.width,
        height: bounds.height - 80,
      });
    }
  });

  mainWindow.webContents.session.on("will-download", async (event, item) => {
    try {
      event.preventDefault();
      const downloadItemName = item.getFilename();
      const downloadLink = item.getURL();
      const defaultPath = path.join(app.getPath("downloads"), downloadItemName);

      const { canceled, filePath } = await dialog.showSaveDialog({
        title: downloadLink,
        defaultPath,
        buttonLabel: "Save",
      });

      if (canceled || !filePath) {
        item.cancel();
        return;
      }

      item.setSavePath(filePath);
      const icon = await app.getFileIcon(filePath, { size: "normal" });

      db()?.run(
        `INSERT INTO downloads (downloadItemName, downloadLink, savedPath, icon) VALUES (?, ?, ?, ?)`,
        [downloadItemName, downloadLink, filePath, icon.toDataURL()]
      );
      saveDb(db());
    } catch (error) {
      console.error(error);
    }
  });

  TabsClient = new TabsManager(mainWindow);

  await connect();

  shortcuts(mainWindow, TabsClient);

  controllers(mainWindow, TabsClient, db());
  return mainWindow;
}
