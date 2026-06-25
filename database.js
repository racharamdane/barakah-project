// backend/db/database.js
// Initialises the SQLite database, runs schema + seed if first launch.

const path    = require('path');
const fs      = require('fs');
const Database = require('better-sqlite3');

const DB_PATH     = path.join(__dirname, '..', 'barakah.sqlite');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const SEED_PATH   = path.join(__dirname, 'seed.sql');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH, { verbose: process.env.NODE_ENV === 'development' ? console.log : null });
    db.pragma('foreign_keys = ON');
    db.pragma('journal_mode = WAL');
    initialise(db);
  }
  return db;
}

function initialise(db) {
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema);

  // Only seed if the cities table is still empty
  const cityCount = db.prepare('SELECT COUNT(*) as n FROM cities').get().n;
  if (cityCount === 0) {
    const seed = fs.readFileSync(SEED_PATH, 'utf8');
    db.exec(seed);
    console.log('[DB] Seed data inserted.');
  }

  console.log('[DB] Database ready at', DB_PATH);
}

module.exports = { getDb };
