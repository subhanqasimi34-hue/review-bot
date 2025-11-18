import Database from "better-sqlite3";

const db = new Database("./data/database.sqlite");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    points INTEGER DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    vouches_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_id TEXT,
    reviewer_id TEXT,
    stars INTEGER,
    category TEXT,
    comment TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vouches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_id TEXT,
    sender_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);
