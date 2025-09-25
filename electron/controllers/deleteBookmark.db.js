import { saveDb } from "../config/db.js";

export default (mainWindow, db) => (_, action) => {
    const { id } = action;

    if (!id) return;

    db.run(`DELETE FROM bookmarks WHERE id = ?`, [id]);
    saveDb(db);

    mainWindow.webContents.send(`remove-bookmarked`, { id });
}