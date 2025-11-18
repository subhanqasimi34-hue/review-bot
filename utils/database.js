import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Stelle sicher, dass der Pfad immer relativ zu dieser Datei berechnet wird
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite Datei -> /data/database.sqlite
const dbPath = path.join(__dirname, "..", "data", "database.sqlite");

// migrations Ordner -> /data/migrations/
const migrationsPath = path.join(__dirname, "..", "data", "migrations");

sqlite3.verbose();

// Verbindung herstellen
export const db = new sqlite3.Database(dbPath, err => {
    if (err) {
        console.error("[DB] Fehler beim Verbinden:", err.message);
        return;
    }
    console.log("[DB] Erfolgreich verbunden.");
    runMigrations();
});

// SQL Helper
function execSQL(sql) {
    return new Promise((resolve, reject) => {
        db.exec(sql, err => {
            if (err) {
                console.error("[DB] SQL Fehler:", err.message);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Migrationen durchführen
async function runMigrations() {
    console.log("[DB] Starte Migrationen…");

    try {
        // Tabelle migrations erstellen
        await execSQL(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                applied_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const appliedMigrations = await getAppliedMigrations();
        const files = fs.readdirSync(migrationsPath)
            .filter(f => f.endsWith(".sql"))
            .sort();

        for (const file of files) {
            if (appliedMigrations.includes(file)) {
                console.log(`[DB] ✔ Migration übersprungen: ${file}`);
                continue;
            }

            const filePath = path.join(migrationsPath, file);
            const sql = fs.readFileSync(filePath, "utf8");

            console.log(`[DB] ➜ Führe Migration aus: ${file}`);
            await execSQL(sql);

            await markMigrationAsApplied(file);
            console.log(`[DB] ✔ Migration erfolgreich: ${file}`);
        }

        console.log("[DB] ✓ Alle Migrationen abgeschlossen.");
    } catch (err) {
        console.error("[DB] ❌ Fehler bei Migrationen:", err);
    }
}

function getAppliedMigrations() {
    return new Promise((resolve, reject) => {
        db.all("SELECT name FROM migrations", (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(r => r.name));
        });
    });
}

function markMigrationAsApplied(name) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO migrations (name) VALUES (?)", [name], err => {
            if (err) reject(err);
            else resolve();
        });
    });
}
