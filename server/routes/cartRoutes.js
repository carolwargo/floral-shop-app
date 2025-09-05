const express = require('express');
const router = express.Router();
const { getCart, addToCart } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);

module.exports = router;