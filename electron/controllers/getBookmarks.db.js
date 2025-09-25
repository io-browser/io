export default (db) => (_, action) => {

    const result = db.exec(`SELECT * FROM bookmarks ORDER BY createdAt`);

    if (!result) return [];

    return result?.[0]?.['values']
}