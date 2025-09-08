// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { name, price, image, description, stock } = req.body;
    const product = new Product({ name, price, image, description, stock });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Product create error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { name, price, image, description, stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, image, description, stock },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Product delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;