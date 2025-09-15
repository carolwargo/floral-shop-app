const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    const subscription = new Subscription({ email });
    await subscription.save();
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; // Changed from export default