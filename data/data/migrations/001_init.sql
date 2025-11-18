-- Create initial users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    discriminator TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
