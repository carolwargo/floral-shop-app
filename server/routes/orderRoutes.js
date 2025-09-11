// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'email').populate('items.product', 'name price');
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, admin, async (req, res) => {
  try {
    const { userId, items, status } = req.body;
    if (!userId || !items || !items.length) {
      return res.status(400).json({ error: 'User ID and items are required' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      total += product.price * item.quantity;
    }
    const order = new Order({
      user: userId,
      items: items.map(item => ({ product: item.productId, quantity: item.quantity })),
      total,
      status
    });
    await order.save();
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }
    res.status(201).json(order);
  } catch (error) {
    console.error('Add order error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { items, status } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: 'Items are required' });
    }
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }
      total += product.price * item.quantity;
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        items: items.map(item => ({ product: item.productId, quantity: item.quantity })),
        total,
        status
      },
      { new: true }
    ).populate('user', 'email').populate('items.product', 'name price');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;