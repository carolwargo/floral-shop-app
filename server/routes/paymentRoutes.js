// server/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { auth } = require('../middleware/auth'); // ✅ FIXED

router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'usd', items } = req.body || {};
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount),
      currency,
      automatic_payment_methods: { enabled: true },
    });

    // Save order
    const order = new Order({
      userId: req.user._id,
      items: items || [],
      total: amount / 100,
      status: 'pending'
    });
    await order.save();

    res.json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
