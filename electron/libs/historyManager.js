import db, { saveDb } from "../config/db.js";

export default class HistoryManager {
    constructor() {
        this.pendingEntry = null;
        this.history = [];
    }

    createPendingEntry(url, navigationMethod = 'navigate') {
        this.pendingEntry = {
            url: url,
            title: "",
            favicon: null,
            timestamp: Date.now(),
            method: navigationMethod
        };
    }

    updateTitle(title) {
        if (this.pendingEntry) {
            this.pendingEntry.title = title;
        }
    }

    updateFavicon(faviconUrl) {
        if (this.pendingEntry) {
            this.pendingEntry.favicon = faviconUrl;
        }
    }

    finalizeEntry() {
        if (this.pendingEntry) {

            const lastEntry = this.history[this.history.length - 1];
            if (!lastEntry || lastEntry.url !== this.pendingEntry.url) {
                this.history.push({ ...this.pendingEntry });
                db()?.run(`INSERT INTO history (title, url, favicon) VALUES (?, ?, ?)`, [this.pendingEntry.title, this.pendingEntry.url, this.pendingEntry.favicon]);
                saveDb(db());
            }
            this.pendingEntry = null;
        }
    }
}