const jwt = require('jsonwebtoken');
const db = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'swift_ship_tracker_super_secure_jwt_secret_key_2026';

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = db.get('SELECT id, name, email, role, phone, company FROM users WHERE id = ?', [decoded.id]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token: user not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}

// Optional auth: sets req.user if valid token provided, but doesn't block if not
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db.get('SELECT id, name, email, role, phone, company FROM users WHERE id = ?', [decoded.id]);
      if (user) {
        req.user = user;
      }
    }
  } catch (e) {
    // Ignore invalid token for optional auth
  }
  next();
}

module.exports = {
  authenticate,
  optionalAuth,
  JWT_SECRET,
};
