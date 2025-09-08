// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth middleware token:', token);
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    const user = await User.findById(decoded._id);
    if (!user) {
      console.log('User not found for ID:', decoded._id);
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    console.log('Authenticated user:', user);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};