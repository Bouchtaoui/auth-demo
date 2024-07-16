import sqlite from "better-sqlite3";

export const db = sqlite("src/lib/data/data.db");

db.exec(`CREATE TABLE IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

db.exec(`CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
)`);

db.exec(`CREATE TABLE IF NOT EXISTS account (
    id TEXT NOT NULL PRIMARY KEY,
    verified INTEGER DEFAULT 0 CHECK (verified IN (0, 1)), -- 0 for unverified, 1 for verified
    admin INTEGER DEFAULT 0 CHECK (admin IN (0, 1)), -- 0 for non-admin, 1 for admin
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
)`);

export interface DatabaseUser {
	id: string;
	email: string;
	password: string;
}
