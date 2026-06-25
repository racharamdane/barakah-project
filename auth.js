// backend/middleware/auth.js
// Verifies JWT and attaches decoded payload to req.user

const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header.' });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role: 'customer'|'restaurant', email }
    next();
  } catch {
    return res.status(401).json({ error: 'Token expired or invalid.' });
  }
}

// Only allows requests where req.user.role === 'restaurant'
function requireRestaurant(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'restaurant') {
      return res.status(403).json({ error: 'Restaurant account required.' });
    }
    next();
  });
}

module.exports = { requireAuth, requireRestaurant };
