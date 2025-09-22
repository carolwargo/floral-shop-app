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
const { upload } = require('../middleware/upload'); // ← MAKE SURE THIS LINE EXISTS

// GET all products (no auth needed)
router.get('/', getProducts);

// GET single product (no auth needed)
router.get('/:id', getProductById);

// POST create product - WITH MULTER MIDDLEWARE
router.post('/', auth, admin, upload.single('image'), createProduct); // ← THIS WAS MISSING!

// PUT update product - WITH MULTER MIDDLEWARE  
router.put('/:id', auth, admin, upload.single('image'), updateProduct); // ← THIS WAS MISSING!

// DELETE product (admin only)
router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;