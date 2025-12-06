import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

let db: Database.Database | null = null;

function ensureDataDirectory(): string {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return dataDir;
}

export function getDb(): Database.Database {
  if (!db) {
    const dataDir = ensureDataDirectory();
    const dbFilePath = path.join(dataDir, 'roulette.db');
    db = new Database(dbFilePath);
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS rolls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        place_id INTEGER,
        place_name TEXT NOT NULL,
        cuisine TEXT NOT NULL,
        price INTEGER NOT NULL,
        rating REAL NOT NULL,
        address TEXT NOT NULL,
        image TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        filters TEXT NOT NULL,
        rolled_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_rolls_user ON rolls(user_id, rolled_at DESC);
    `);
  }
  return db;
}
