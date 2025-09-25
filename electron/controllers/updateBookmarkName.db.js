import { saveDb } from "../config/db.js";

export default (db) => (_, action) => {

    const { id, name } = action;

    if (!id || !name) return;

    db.run(`UPDATE bookmarks SET name = ? WHERE id = ?`, [name, id]);
    saveDb(db)
}