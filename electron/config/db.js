import sqljs from "sql.js";
import fs from "fs";
import path from "path";
import electron from "electron";

const dbPath = path.join(electron.app.getPath('userData'), 'app.db');
let db;


export async function connect() {
    try {
        const SQL = await sqljs();

        if (fs.existsSync(dbPath)) {
            const fileBuffer = fs.readFileSync(dbPath);
            db = new SQL.Database(fileBuffer);
        } else {
            db = new SQL.Database();
        }

        db.run(`
                CREATE TABLE IF NOT EXISTS history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    url TEXT NOT NULL,
                    title TEXT NOT NULL,
                    favicon TEXT default '',
                    createdAt DATETIME default CURRENT_TIMESTAMP
                )
            `);

        db.run(`
                CREATE TABLE IF NOT EXISTS downloads (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    downloadItemName TEXT NOT NULL,
                    downloadLink TEXT NOT NULL,
                    savedPath TEXT NOT NULL,
                    icon TEXT NOT NULL,
                    createdAt DATETIME default CURRENT_TIMESTAMP
                )
            `);

        db.run(`
                CREATE TABLE IF NOT EXISTS bookmarks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    favicon TEXT NOT NULL,
                    name TEXT NOT NULL,
                    url TEXT NOT NULL,
                    createdAt DATETIME default CURRENT_TIMESTAMP
                )
            `);

        console.log(`database connected`)
        return db;
    } catch (error) {
        console.error(error)
    }
}

export function saveDb(db) {
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
}

export default () => db;