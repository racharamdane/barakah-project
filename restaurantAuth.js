// backend/routes/restaurantAuth.js
const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const { getDb } = require('../db/database');

const router = express.Router();
const SALT_ROUNDS = 10;

// POST /api/restaurants/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, city, password } = req.body;

    if (!name || !email || !phone || !city || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const db = getDb();

    const cityRow = db.prepare('SELECT id FROM cities WHERE name = ?').get(city);
    if (!cityRow) {
      return res.status(400).json({ error: `City "${city}" is not supported.` });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = db.prepare(
      'INSERT INTO restaurants (name, email, phone, city_id, password_hash) VALUES (?, ?, ?, ?, ?)'
    ).run(name, email, phone, cityRow.id, hash);

    const token = jwt.sign(
      { id: result.lastInsertRowid, role: 'restaurant', email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      restaurant: { id: result.lastInsertRowid, name, email, phone, city }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/restaurants/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = getDb();
    const restaurant = db.prepare(
      `SELECT r.*, ci.name AS city
       FROM restaurants r
       JOIN cities ci ON ci.id = r.city_id
       WHERE r.email = ?`
    ).get(email);

    if (!restaurant || !(await bcrypt.compare(password, restaurant.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    if (!restaurant.is_active) {
      return res.status(403).json({ error: 'This restaurant account has been suspended.' });
    }

    const token = jwt.sign(
      { id: restaurant.id, role: 'restaurant', email: restaurant.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        email: restaurant.email,
        phone: restaurant.phone,
        city: restaurant.city,
        logoUrl: restaurant.logo_url
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
