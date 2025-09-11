const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, admin, async (req, res) => {
  try {
    const { email, password, name, isAdmin } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email: email.toLowerCase(), password: hashedPassword, name, isAdmin: !!isAdmin });
    await user.save();
    res.status(201).json({ email: user.email, name: user.name, isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { email, name, isAdmin, password } = req.body;
    const updates = { email: email.toLowerCase(), name, isAdmin: !!isAdmin };
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, admin, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(403).json({ error: 'Cannot delete yourself' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;