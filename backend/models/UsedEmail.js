const mongoose = require('mongoose');

const usedEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  registrationType: {
    type: String,
    enum: ['regular', 'google'],
    required: true
  },
  ipAddress: {
    type: String,
    default: null
  }
});

const UsedEmail = mongoose.model('UsedEmail', usedEmailSchema);

module.exports = UsedEmail;