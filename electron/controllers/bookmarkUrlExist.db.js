export default (db) => (_, action) => {

    const { url } = action;

    if (!url) return;

    const result = db.exec(`SELECT * FROM bookmarks WHERE url = ?`, [url]);

    if (!result.length) return false;

    return true
}