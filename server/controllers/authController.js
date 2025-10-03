// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); 
const crypto = require('crypto'); 
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

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Step 1: Request password reset (sends email with token)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; // valid 15 min
    await user.save();

    // Send email
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: `"Floral Shop" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset.</p>
        <p>Click here to reset: <a href="${resetURL}">${resetURL}</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.json({ message: 'Password reset link sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Step 2: Reset password (user submits new password)
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
