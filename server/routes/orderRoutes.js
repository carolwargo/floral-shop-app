// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
  try {
    console.log('Order request user:', req.user);
    const orders = await Order.find({ userId: req.user._id }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const orders = await Order.find().populate('items.productId');
    res.json(orders);
  } catch (error) {
    console.error('All orders fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;