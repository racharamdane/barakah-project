-- ============================================================
--  Barakah Database Schema
--  Engine: SQLite 3
-- ============================================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ------------------------------------------------------------
-- Algerian cities reference table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cities (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- ------------------------------------------------------------
-- Customers
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name     TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  phone         TEXT    NOT NULL,
  city_id       INTEGER NOT NULL REFERENCES cities(id),
  password_hash TEXT    NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- ------------------------------------------------------------
-- Restaurants
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS restaurants (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  phone         TEXT    NOT NULL,
  city_id       INTEGER NOT NULL REFERENCES cities(id),
  password_hash TEXT    NOT NULL,
  logo_url      TEXT,                          -- optional uploaded logo
  is_active     INTEGER NOT NULL DEFAULT 1,    -- 0 = suspended
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_restaurants_email ON restaurants(email);
CREATE INDEX IF NOT EXISTS idx_restaurants_city  ON restaurants(city_id);

-- ------------------------------------------------------------
-- Offers (surprise bags)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS offers (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id    INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,

  -- Pricing
  original_price   REAL    NOT NULL CHECK (original_price > 0),
  reduced_price    REAL    NOT NULL CHECK (reduced_price  > 0),

  -- Availability
  total_bags       INTEGER NOT NULL CHECK (total_bags >= 1),
  bags_remaining   INTEGER NOT NULL,           -- decremented on reservation

  -- Collection window (stored as HH:MM, e.g. "18:30")
  collection_start TEXT    NOT NULL,
  collection_end   TEXT    NOT NULL,

  -- Optional extras
  description      TEXT,                       -- free-text notes from restaurant

  -- Status
  is_active        INTEGER NOT NULL DEFAULT 1, -- restaurant can toggle off
  created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT    NOT NULL DEFAULT (datetime('now')),

  CHECK (reduced_price < original_price),
  CHECK (bags_remaining >= 0),
  CHECK (bags_remaining <= total_bags)
);

CREATE INDEX IF NOT EXISTS idx_offers_restaurant ON offers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_offers_active     ON offers(is_active);

-- Keep updated_at in sync automatically
CREATE TRIGGER IF NOT EXISTS offers_updated_at
AFTER UPDATE ON offers
BEGIN
  UPDATE offers SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ------------------------------------------------------------
-- Reservations  (customer claims a bag)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservations (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id   INTEGER NOT NULL REFERENCES customers(id),
  offer_id      INTEGER NOT NULL REFERENCES offers(id),
  status        TEXT    NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','collected','cancelled')),
  reserved_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  collected_at  TEXT,

  -- One bag per customer per offer
  UNIQUE (customer_id, offer_id)
);

CREATE INDEX IF NOT EXISTS idx_reservations_customer ON reservations(customer_id);
CREATE INDEX IF NOT EXISTS idx_reservations_offer    ON reservations(offer_id);

-- Decrement bags_remaining when a reservation is created
CREATE TRIGGER IF NOT EXISTS after_reservation_insert
AFTER INSERT ON reservations
WHEN NEW.status = 'pending'
BEGIN
  UPDATE offers
  SET bags_remaining = bags_remaining - 1
  WHERE id = NEW.offer_id;
END;

-- Restore bags_remaining if a reservation is cancelled
CREATE TRIGGER IF NOT EXISTS after_reservation_cancel
AFTER UPDATE ON reservations
WHEN NEW.status = 'cancelled' AND OLD.status = 'pending'
BEGIN
  UPDATE offers
  SET bags_remaining = bags_remaining + 1
  WHERE id = NEW.offer_id;
END;
