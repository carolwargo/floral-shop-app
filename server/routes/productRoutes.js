// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { upload } = require('../middleware/upload');

// GET all products
router.get('/', getProducts);

// GET single product
router.get('/:id', getProductById);

// POST create product with image upload
router.post('/', auth, admin, upload.single('image'), createProduct);

// PUT update product with optional image upload
router.put('/:id', auth, admin, upload.single('image'), updateProduct);

// DELETE product
router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;