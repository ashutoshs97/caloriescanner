const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  // Profile information for BMR calculation
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  weight: {
    type: Number, // in kg
    required: true,
    min: 1,
  },
  height: {
    type: Number, // in cm
    required: true,
    min: 1,
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'lightly active', 'moderately active', 'very active', 'extra active'],
    default: 'sedentary',
  },
  // Calorie Bank state (rolling debt/surplus)
  calorieBank: {
    type: Number, // positive = surplus (debt to burn), negative = deficit (credit)
    default: 0,
  },
  lastBankUpdate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);