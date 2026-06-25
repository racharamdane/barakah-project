// backend/server.js
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const errorHandler = require('./middleware/errorHandler');

const customerAuth  = require('./routes/customerAuth');
const restaurantAuth= require('./routes/restaurantAuth');
const offers        = require('./routes/offers');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/customers',   customerAuth);
app.use('/api/restaurants', restaurantAuth);
app.use('/api/offers',      offers);

// Cities shortcut
app.get('/api/cities', (req, res) => {
  const { getDb } = require('./db/database');
  const cities = getDb().prepare('SELECT name FROM cities ORDER BY name').all();
  res.json(cities.map(c => c.name));
});

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// ── Error handler ────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🟢 Barakah API running on http://localhost:${PORT}\n`);
});
