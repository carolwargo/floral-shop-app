const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', createProduct); // For testing; add auth for production

module.exports = router;