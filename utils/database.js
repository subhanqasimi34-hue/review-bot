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
    rating INTEGER,
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

export function addReview(targetId, reviewerId, rating, category, comment) {
    const stmt = db.prepare(`
        INSERT INTO reviews (target_id, reviewer_id, rating, category, comment)
        VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(targetId, reviewerId, rating, category, comment);

    const points = rating * 10;

    db.prepare(`
        INSERT INTO users (user_id, points, reviews_count)
        VALUES (?, ?, 1)
        ON CONFLICT(user_id) DO UPDATE SET
            points = points + excluded.points,
            reviews_count = reviews_count + 1
    `).run(targetId, points);
}

export function addVouch(targetId, senderId) {
    db.prepare(`
        INSERT INTO vouches (target_id, sender_id)
        VALUES (?, ?)
    `).run(targetId, senderId);

    db.prepare(`
        INSERT INTO users (user_id, points, vouches_count)
        VALUES (?, 10, 1)
        ON CONFLICT(user_id) DO UPDATE SET
            points = points + excluded.points,
            vouches_count = vouches_count + 1
    `).run(targetId);
}

export function getReviewsForUser(userId) {
    return db.prepare(`
        SELECT * FROM reviews 
        WHERE target_id = ? 
        ORDER BY id DESC
    `).all(userId);
}

export function getUserStats(userId) {
    return db.prepare(`
        SELECT * FROM users WHERE user_id = ?
    `).get(userId);
}

export function getLeaderboard(limit = 10) {
    return db.prepare(`
        SELECT * FROM users
        ORDER BY points DESC
        LIMIT ?
    `).all(limit);
}

export default db;
