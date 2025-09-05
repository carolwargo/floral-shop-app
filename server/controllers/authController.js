const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    console.log('Signup attempt:', { email }); // Debug log
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword, name });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Signup successful:', email);
    res.status(201).json({ token, user: { id: user._id, email, name } });
  } catch (error) {
    console.error('Signup error:', error); // Debug log
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt:', { email, password }); // Debug log
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing passwords for:', email); // Debug log
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Generating JWT for:', email); // Debug log
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful:', email);
    res.json({ token, user: { id: user._id, email, name: user.name } });
  } catch (error) {
    console.error('Login error:', error); // Debug log
    res.status(500).json({ message: 'Server error' });
  }
};