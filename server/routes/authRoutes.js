// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email }); // Debug
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('User found:', { email: user.email, isAdmin: user.isAdmin }); // Debug
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { _id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    console.log('JWT payload:', { _id: user._id, email: user.email, isAdmin: user.isAdmin }); // Debug
    console.log('Generated token:', token); // Debug
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('Register attempt:', { email }); // Debug
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email: email.toLowerCase(), password: hashedPassword, name, isAdmin: false });
    await user.save();
    console.log('User registered:', { email: user.email, isAdmin: user.isAdmin }); // Debug
    const token = jwt.sign(
      { _id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    res.status(201).json({ token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;