const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true
  },
  senderEmail: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  reply: {
    type: String,
    default: '' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('message', MessageSchema);