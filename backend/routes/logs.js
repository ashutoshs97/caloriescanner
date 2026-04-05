const express = require('express');
const router = express.Router();
const User = require('../models/User');
const DailyLog = require('../models/DailyLog');
const { processDailyLog } = require('../controllers/calorieController');
const authenticateToken = require('../middleware/auth');



// Import jwt
const jwt = require('jsonwebtoken');

// @route   POST api/logs/meal
// @desc    Log a meal with image analysis
// @access  Private
router.post('/meal', authenticateToken, async (req, res) => {
  try {
    const { imageBase64, mimeType, exerciseBurned = 0 } = req.body;

    // Validate input
    if (!imageBase64) {
      return res.status(400).json({ message: 'Image data is required' });
    }

    // Import geminiService here to avoid circular dependencies
    const { analyzeFoodImage } = require('../services/geminiService');

    // 1. Analyze food image with Gemini
    let mealData;
    try {
      mealData = await analyzeFoodImage(imageBase64, mimeType);
    } catch (geminiError) {
      return res.status(500).json({
        message: 'Failed to analyze food image',
        error: geminiError.message
      });
    }

    // 2. Process the daily log (BMR calculation, calorie bank update, etc.)
    const result = await processDailyLog(
      req.user.id,
      mealData,
      exerciseBurned
    );

    // 3. Return success response
    res.status(201).json({
      message: 'Meal logged successfully',
      user: {
        id: result.user.id,
        username: result.user.username,
        calorieBank: result.user.calorieBank,
        lastBankUpdate: result.user.lastBankUpdate,
      },
      log: {
        id: result.dailyLog._id,
        date: result.dailyLog.date,
        meal: result.dailyLog.meal,
        exerciseBurned: result.dailyLog.exerciseBurned,
        totalConsumed: result.dailyLog.totalConsumed,
        totalBurned: result.dailyLog.totalBurned,
        netCalories: result.dailyLog.netCalories,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST api/logs/exercise
// @desc    Log manual exercise (for days without meal)
// @access  Private
router.post('/exercise', authenticateToken, async (req, res) => {
  try {
    const { exerciseBurned } = req.body;

    if (typeof exerciseBurned !== 'number' || exerciseBurned < 0) {
      return res.status(400).json({ message: 'Valid exerciseBurned (number >= 0) is required' });
    }

    // For exercise-only log, we need to create a minimal meal entry
    // We'll use placeholder data since no meal was consumed
    const placeholderMeal = {
      foodType: 'No meal logged',
      portionSize: 'N/A',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    };

    // Process the daily log with just exercise
    const result = await processDailyLog(
      req.user.id,
      placeholderMeal,
      exerciseBurned
    );

    res.status(201).json({
      message: 'Exercise logged successfully',
      user: {
        id: result.user.id,
        username: result.user.username,
        calorieBank: result.user.calorieBank,
        lastBankUpdate: result.user.lastBankUpdate,
      },
      log: {
        id: result.dailyLog._id,
        date: result.dailyLog.date,
        meal: result.dailyLog.meal,
        exerciseBurned: result.dailyLog.exerciseBurned,
        totalConsumed: result.dailyLog.totalConsumed,
        totalBurned: result.dailyLog.totalBurned,
        netCalories: result.dailyLog.netCalories,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET api/logs/history
// @desc    Get user's daily log history
// @access  Private
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const logs = await DailyLog.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(30); // Last 30 days

    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/logs/today
// @desc    Get today's log for user
// @access  Private
router.get('/today', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await DailyLog.findOne({
      user: req.user.id,
      date: { $gte: today },
    });

    if (!log) {
      return res.status(404).json({ message: 'No log found for today' });
    }

    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;