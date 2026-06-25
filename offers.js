// backend/routes/offers.js
const express = require('express');
const { getDb } = require('../db/database');
const { requireAuth, requireRestaurant } = require('../middleware/auth');

const router = express.Router();

// ------------------------------------------------------------------
// GET /api/offers  — public, filterable by city
// ------------------------------------------------------------------
router.get('/', (req, res, next) => {
  try {
    const db = getDb();
    const { city } = req.query;

    let sql = `
      SELECT
        o.id,
        o.original_price,
        o.reduced_price,
        o.total_bags,
        o.bags_remaining,
        o.collection_start,
        o.collection_end,
        o.description,
        o.created_at,
        r.id        AS restaurant_id,
        r.name      AS restaurant_name,
        r.phone     AS restaurant_phone,
        r.logo_url  AS restaurant_logo,
        ci.name     AS city
      FROM offers o
      JOIN restaurants r  ON r.id  = o.restaurant_id
      JOIN cities ci       ON ci.id = r.city_id
      WHERE o.is_active = 1
        AND o.bags_remaining > 0
        AND r.is_active = 1
    `;

    const params = [];
    if (city) {
      sql += ' AND ci.name = ?';
      params.push(city);
    }

    sql += ' ORDER BY o.created_at DESC';

    const offers = db.prepare(sql).all(...params);
    res.json(offers);
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------------------
// GET /api/offers/mine — restaurant's own offers (auth required)
// ------------------------------------------------------------------
router.get('/mine', requireRestaurant, (req, res, next) => {
  try {
    const db = getDb();
    const offers = db.prepare(`
      SELECT
        o.*,
        ci.name AS city
      FROM offers o
      JOIN restaurants r ON r.id = o.restaurant_id
      JOIN cities ci     ON ci.id = r.city_id
      WHERE o.restaurant_id = ?
      ORDER BY o.created_at DESC
    `).all(req.user.id);

    res.json(offers);
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------------------
// POST /api/offers — create a new offer
// ------------------------------------------------------------------
router.post('/', requireRestaurant, (req, res, next) => {
  try {
    const {
      originalPrice,
      reducedPrice,
      totalBags,
      collectionStart,
      collectionEnd,
      description
    } = req.body;

    if (!originalPrice || !reducedPrice || !totalBags || !collectionStart || !collectionEnd) {
      return res.status(400).json({ error: 'originalPrice, reducedPrice, totalBags, collectionStart and collectionEnd are required.' });
    }
    if (Number(reducedPrice) >= Number(originalPrice)) {
      return res.status(400).json({ error: 'Reduced price must be lower than original price.' });
    }
    if (Number(totalBags) < 1) {
      return res.status(400).json({ error: 'At least 1 bag must be offered.' });
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO offers
        (restaurant_id, original_price, reduced_price, total_bags, bags_remaining,
         collection_start, collection_end, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      Number(originalPrice),
      Number(reducedPrice),
      Number(totalBags),
      Number(totalBags),     // bags_remaining starts at total_bags
      collectionStart,
      collectionEnd,
      description || null
    );

    const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(offer);
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------------------
// PUT /api/offers/:id — update an offer (owner only)
// ------------------------------------------------------------------
router.put('/:id', requireRestaurant, (req, res, next) => {
  try {
    const db = getDb();
    const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(req.params.id);

    if (!offer) return res.status(404).json({ error: 'Offer not found.' });
    if (offer.restaurant_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own offers.' });
    }

    const {
      originalPrice,
      reducedPrice,
      totalBags,
      collectionStart,
      collectionEnd,
      description,
      isActive
    } = req.body;

    const newOriginal  = originalPrice  !== undefined ? Number(originalPrice)  : offer.original_price;
    const newReduced   = reducedPrice   !== undefined ? Number(reducedPrice)   : offer.reduced_price;
    const newTotal     = totalBags      !== undefined ? Number(totalBags)      : offer.total_bags;
    const newStart     = collectionStart ?? offer.collection_start;
    const newEnd       = collectionEnd   ?? offer.collection_end;
    const newDesc      = description    !== undefined ? description            : offer.description;
    const newActive    = isActive       !== undefined ? (isActive ? 1 : 0)    : offer.is_active;

    if (newReduced >= newOriginal) {
      return res.status(400).json({ error: 'Reduced price must be lower than original price.' });
    }

    db.prepare(`
      UPDATE offers SET
        original_price   = ?,
        reduced_price    = ?,
        total_bags       = ?,
        bags_remaining   = MAX(0, bags_remaining + (? - total_bags)),
        collection_start = ?,
        collection_end   = ?,
        description      = ?,
        is_active        = ?
      WHERE id = ?
    `).run(newOriginal, newReduced, newTotal, newTotal, newStart, newEnd, newDesc, newActive, offer.id);

    const updated = db.prepare('SELECT * FROM offers WHERE id = ?').get(offer.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------------------
// DELETE /api/offers/:id — remove an offer (owner only)
// ------------------------------------------------------------------
router.delete('/:id', requireRestaurant, (req, res, next) => {
  try {
    const db = getDb();
    const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(req.params.id);

    if (!offer) return res.status(404).json({ error: 'Offer not found.' });
    if (offer.restaurant_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own offers.' });
    }

    db.prepare('DELETE FROM offers WHERE id = ?').run(offer.id);
    res.json({ message: 'Offer deleted.' });
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------------------
// GET /api/cities — helper for dropdowns
// ------------------------------------------------------------------
router.get('/cities', (req, res, next) => {
  try {
    const db = getDb();
    const cities = db.prepare('SELECT name FROM cities ORDER BY name').all();
    res.json(cities.map(c => c.name));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
