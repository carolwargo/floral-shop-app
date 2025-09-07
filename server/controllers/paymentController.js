//Stripe Payments Backend const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//Stripe Payments Frontend const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
//server/controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart');

exports.createPaymentIntent = async (req, res) => {
  const userId = req.userId; // From authMiddleware
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const amount = cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity * 100, // Convert to cents
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};