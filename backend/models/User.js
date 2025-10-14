const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: { type: String, default: '' },
  phone: { type: String, default: null },  
  password: {
    type: String,
    
  },
  galleryImage: {
    type: [String],
    default: []    
  },
  // Нові поля для тарифних планів
  tariff: {
    type: String,
    default: 'Без тарифу'
  },
  coins: {
    type: Number,
    default: 300
  },
  eventDates: {
    type: [{
      date: {
        type: String,
        required: true
      },
      formattedDate: {
        type: String,
        required: true
      },
      isReminderEnabled: {
        type: Boolean,
        default: false
      },
      isRecurring: {
        type: Boolean,
        default: false
      },
      gender: {
        type: String,
        default: ''
      },
      age: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        required: true // обов'язкове поле
      },
      person: {
        type: String,
        default: ''
      },
      greetingSubject: {
        type: String,
        required: true // обов'язкове поле
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    default: []
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
