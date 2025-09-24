export default (db) => (_, action) => {
    const { limit = 10, page = 1 } = action;

    const offset = (page - 1) * limit

    const result = db.exec(`SELECT * FROM history ORDER BY createdAt DESC LIMIT ? OFFSET ?`, [limit, offset]);

    if (!result) return [];

    return result?.[0]?.['values']
}