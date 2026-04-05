const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // Meal data from Gemini API
  meal: {
    // We'll store the analyzed meal data as an object
    // Expected structure from Gemini: { foodType, portionSize, calories, protein, carbs, fats }
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  // Manual exercise log (in kcal burned)
  exerciseBurned: {
    type: Number,
    default: 0,
  },
  // Total consumed calories for the day (from meal)
  totalConsumed: {
    type: Number,
    required: true,
  },
  // Total burned calories for the day (BMR + exercise)
  totalBurned: {
    type: Number,
    required: true,
  },
  // Net calories for the day (consumed - burned)
  netCalories: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries by user and date
dailyLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('DailyLog', dailyLogSchema);