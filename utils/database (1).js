import Database from "better-sqlite3";

const db = new Database("database.db");

// Create tables
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
    text TEXT,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS vouches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_id TEXT,
    sender_id TEXT,
    created_at TEXT
);
`);

// Ensure user row exists
function ensureUser(userId) {
    db.prepare("INSERT OR IGNORE INTO users (user_id) VALUES (?)").run(userId);
}

// Add review
export function addReview(target, reviewer, stars, category, text) {
    ensureUser(target);
    ensureUser(reviewer);

    db.prepare(`
        INSERT INTO reviews (target_id, reviewer_id, stars, category, text, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(target, reviewer, stars, category, text);

    db.prepare(`
        UPDATE users
        SET points = points + ?, reviews_count = reviews_count + 1
        WHERE user_id = ?
    `).run(stars * 5, target); // example: 5 stars = 25 points
}

// Get reviews
export function getReviews(userId) {
    return db.prepare(`
        SELECT * FROM reviews
        WHERE target_id = ?
        ORDER BY id DESC
        LIMIT 10
    `).all(userId);
}

// Add vouch (+10 points)
export function addVouch(target, sender) {
    ensureUser(target);
    ensureUser(sender);

    db.prepare(`
        INSERT INTO vouches (target_id, sender_id, created_at)
        VALUES (?, ?, datetime('now'))
    `).run(target, sender);

    db.prepare(`
        UPDATE users
        SET points = points + 10, vouches_count = vouches_count + 1
        WHERE user_id = ?
    `).run(target);
}

// Get user stats
export function getUserStats(userId) {
    return db.prepare("SELECT * FROM users WHERE user_id = ?").get(userId);
}

// Leaderboard
export function getLeaderboard() {
    return db.prepare(`
        SELECT * FROM users
        ORDER BY points DESC
        LIMIT 10
    `).all();
}
