import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

// Pfad zur SQLite-Datenbank
const dbPath = path.join(process.cwd(), "data", "database.sqlite");

// Pfad zum migrations-Ordner
const migrationsPath = path.join(process.cwd(), "data", "migrations");

// Verbindung zur sqlite db
sqlite3.verbose();
export const db = new sqlite3.Database(dbPath, err => {
    if (err) {
        console.error("[DB] Fehler beim Verbinden:", err.message);
        return;
    }
    console.log("[DB] Erfolgreich verbunden.");
    runMigrations();
});

// Funktion zum Ausführen von SQL-Befehlen
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

// Migrationssystem
async function runMigrations() {
    console.log("[DB] Starte Migrationen…");

    try {
        // Prüfen, ob migrations Tabelle existiert
        await execSQL(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                applied_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const appliedMigrations = await getAppliedMigrations();

        const files = fs
            .readdirSync(migrationsPath)
            .filter(f => f.endsWith(".sql"))
            .sort();

        for (const file of files) {
            if (appliedMigrations.includes(file)) {
                console.log(`[DB] ✔ Migration übersprungen (bereits ausgeführt): ${file}`);
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

// Bereits ausgeführte Migrationen auslesen
function getAppliedMigrations() {
    return new Promise((resolve, reject) => {
        db.all("SELECT name FROM migrations", (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(r => r.name));
        });
    });
}

// Migration als ausgeführt markieren
function markMigrationAsApplied(name) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO migrations (name) VALUES (?)",
            [name],
            err => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}
