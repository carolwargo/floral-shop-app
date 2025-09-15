// server/controllers/productController.js  
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { search, limit } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const products = await Product.find(query).limit(parseInt(limit) || 0);
    res.json(products);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Fetch product error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, admin, async (req, res) => {
  try {
    const { name, price, image, description, stock } = req.body;
    const product = new Product({ name, price, image, description, stock });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Product create error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, admin, async (req, res) => {
  try {
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

router.delete('/:id', auth, admin, async (req, res) => {
  try {
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

export default router;