const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

// @route   GET api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/me
// @desc    Update user's profile
// @access  Private
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { age, gender, weight, height, activityLevel } = req.body;

    // Build update object
    const userFields = {};
    if (age) userFields.age = age;
    if (gender) userFields.gender = gender;
    if (weight) userFields.weight = weight;
    if (height) userFields.height = height;
    if (activityLevel) userFields.activityLevel = activityLevel;

    // Update user
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;