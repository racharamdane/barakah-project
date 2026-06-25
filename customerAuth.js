// backend/routes/customerAuth.js
const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const { getDb } = require('../db/database');

const router = express.Router();
const SALT_ROUNDS = 10;

// POST /api/customers/register
router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, phone, city, password } = req.body;

    if (!fullName || !email || !phone || !city || !password) {
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
      'INSERT INTO customers (full_name, email, phone, city_id, password_hash) VALUES (?, ?, ?, ?, ?)'
    ).run(fullName, email, phone, cityRow.id, hash);

    const token = jwt.sign(
      { id: result.lastInsertRowid, role: 'customer', email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      customer: { id: result.lastInsertRowid, fullName, email, phone, city }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/customers/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = getDb();
    const customer = db.prepare(
      `SELECT c.*, ci.name AS city
       FROM customers c
       JOIN cities ci ON ci.id = c.city_id
       WHERE c.email = ?`
    ).get(email);

    if (!customer || !(await bcrypt.compare(password, customer.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: customer.id, role: 'customer', email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      customer: {
        id: customer.id,
        fullName: customer.full_name,
        email: customer.email,
        phone: customer.phone,
        city: customer.city
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
