const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

router.post('/', auth, async (req, res) => {
  try {
    const { question, email } = req.body;

    //  Find the RECIPIENT by email
    const recipient = await User.findOne({ email: email.toLowerCase() });
    if (!recipient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recipient user not found with that email.' 
      });
    }

    //  Find the SENDER  to get their email
    const senderUser = await User.findById(req.user.id);
    if (!senderUser) {
      return res.status(404).json({ success: false, message: 'Sender not found' });
    }

    //  Create message linked to BOTH IDs using the fetched sender email
    const newMessage = new Message({
      sender: req.user.id,        
      recipient: recipient._id,   
      senderEmail: senderUser.email, 
      email: email.toLowerCase(), 
      question
    });

    await newMessage.save();
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error("POST ERROR:", err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get all messages where the user is either the sender OR the recipient
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { recipient: req.user.id }
      ]
    }).sort({ createdAt: -1 });

    res.json({ success: true, message: messages });
  } catch (err) {
    console.error("GET ERROR:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/message/reply/:id
// @desc    Recipient replies to the message
router.put('/reply/:id', auth, async (req, res) => {
  try {
    const { reply } = req.body;

    let message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Security:  ONLY the recipient can reply
    if (message.recipient.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to reply' });
    }

    message.reply = reply;
    await message.save();

    res.json({ success: true, message: 'Reply sent successfully!', data: message });
  } catch (err) {
    console.error("PUT ERROR:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;