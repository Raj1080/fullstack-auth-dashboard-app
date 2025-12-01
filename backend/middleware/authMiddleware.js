// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// Middleware to protect routes
exports.requireAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token; // read token from httpOnly cookie

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user ID to request object for later use
    req.userId = decoded.id;

    next(); // allow request to continue
  }
  catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
