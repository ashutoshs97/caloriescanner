import apiService from './api';

const logsService = {
  // Log a meal with image analysis
  logMeal: async (imageBase64, mimeType, exerciseBurned = 0) => {
    return apiService.request('/logs/meal', {
      method: 'POST',
      body: JSON.stringify({ imageBase64, mimeType, exerciseBurned })
    });
  },

  // Log manual exercise (for days without meal)
  logExercise: async (exerciseBurned) => {
    return apiService.request('/logs/exercise', {
      method: 'POST',
      body: JSON.stringify({ exerciseBurned })
    });
  },

  // Get user's daily log history
  getHistory: async () => {
    return apiService.request('/logs/history');
  },

  // Get today's log for user
  getToday: async () => {
    return apiService.request('/logs/today');
  }
};

export default logsService;