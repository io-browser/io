import { saveDb } from "../config/db.js";

export default (db) => (_, action) => {
    const { id } = action;

    if (!id) return;

    db.run(`DELETE FROM downloads WHERE id = ?`, [id]);
    saveDb(db)
}