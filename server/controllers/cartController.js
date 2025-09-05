const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  const userId = req.userId; // From auth middleware
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.userId;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};