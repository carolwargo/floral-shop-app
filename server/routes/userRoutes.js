const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;