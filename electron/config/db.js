import sqljs from "sql.js";
import fs from "fs";
import path from "path";
import electron from "electron";

const dbPath = path.join(electron.app.getAppPath('userData'), 'app.db');
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
            `)

        console.log(`database connected`)
        return db;
    } catch (error) {
        console.error(error)
    }
}



export default () => db;