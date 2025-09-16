const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { auth, admin } = require('../middleware/auth');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Message submission error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, admin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/reply', auth, admin, async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { reply, updatedAt: Date.now() },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Send email reply
    await transporter.sendMail({
      from: `"Floral Shop" <${process.env.EMAIL_USER}>`,
      to: message.email,
      subject: 'Response to Your Inquiry',
      text: `Dear ${message.name},\n\nThank you for contacting Floral Shop. Here is our response:\n\n${reply}\n\nBest regards,\nFloral Shop Team`,
      html: `<p>Dear ${message.name},</p><p>Thank you for contacting Floral Shop. Here is our response:</p><p>${reply}</p><p>Best regards,<br>Floral Shop Team</p>`,
    });

    res.json(message);
  } catch (error) {
    console.error('Message reply error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Message delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;