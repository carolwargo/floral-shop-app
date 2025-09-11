// server/routes/cartRoutes.js
// server/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { auth } = require('../middleware/auth'); // ✅ destructure the function

// GET cart for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    console.log('Cart request user:', req.user);
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
