// server/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
} = require('../controllers/cartController');

// GET cart for logged-in user
router.get('/', auth, getCart);

// POST add item to cart
router.post('/', auth, addToCart);

// PUT update cart item quantity
router.put('/:itemId', auth, updateCartItem);

// DELETE remove item from cart
router.delete('/:itemId', auth, deleteCartItem);

// DELETE clear entire cart
router.delete('/', auth, clearCart);

module.exports = router;