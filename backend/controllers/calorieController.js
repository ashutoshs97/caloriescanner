const mongoose = require('mongoose');
const User = require('../models/User');
const DailyLog = require('../models/DailyLog');

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation.
 * @param {Object} user - User document containing age, gender, weight, height
 * @returns {number} BMR in kcal/day
 */
const calculateBMR = (user) => {
  const { age, gender, weight, height } = user;
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

/**
 * Process a daily log: calculate BMR, total burned, net calories, and update Calorie Bank.
 * @param {string} userId - The user's ID
 * @param {Object} mealData - Object containing meal analysis from Gemini (should include calories)
 * @param {number} exerciseBurned - Calories burned from exercise (manual input)
 * @returns {Promise<Object>} Updated user and created daily log
 */
const processDailyLog = async (userId, mealData, exerciseBurned = 0) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Get user
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    // 2. Calculate BMR
    const bmr = calculateBMR(user);

    // 3. Calculate total burned (BMR + exercise)
    const totalBurned = bmr + exerciseBurned;

    // 4. Extract total consumed from mealData
    // Assuming mealData has a calories field (number)
    const totalConsumed = mealData.calories || 0;

    // 5. Calculate net calories (consumed - burned)
    const netCalories = totalConsumed - totalBurned;

    // 6. Update Calorie Bank
    let updatedBank = user.calorieBank;
    if (netCalories > 0) {
      // Surplus: add to bank (increasing debt)
      updatedBank += netCalories;
    } else {
      // Deficit or break-even: use to pay off bank debt
      const deficit = -netCalories; // positive number
      const amountToPayOff = Math.min(user.calorieBank, deficit);
      updatedBank -= amountToPayOff;
      // Note: Any remaining deficit (deficit - amountToPayOff) is weight loss and not stored
    }

    // Ensure bank doesn't go below zero (shouldn't happen with our logic, but safety)
    updatedBank = Math.max(updatedBank, 0);

    // 7. Update user's calorieBank and lastBankUpdate
    user.calorieBank = updatedBank;
    user.lastBankUpdate = new Date();
    await user.save({ session });

    // 8. Create daily log entry
    const dailyLog = new DailyLog({
      user: userId,
      meal: mealData,
      exerciseBurned,
      totalConsumed,
      totalBurned,
      netCalories,
    });
    await dailyLog.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { user, dailyLog };
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  calculateBMR,
  processDailyLog,
};