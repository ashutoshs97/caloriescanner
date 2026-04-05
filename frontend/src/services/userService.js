import apiService from './api';

const userService = {
  // Get current user's profile
  getProfile: async () => {
    return apiService.request('/users/me');
  },

  // Update user's profile
  updateProfile: async (profileData) => {
    return apiService.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }
};

export default userService;