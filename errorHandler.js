// backend/middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error('[Error]', err);

  // SQLite unique constraint
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error.' });
}

module.exports = errorHandler;
