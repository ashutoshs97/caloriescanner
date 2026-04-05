import apiService from './api';

const authService = {
  // Register a new user
  register: async (userData) => {
    return apiService.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Login user
  login: async (credentials) => {
    return apiService.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Get current user profile
  getCurrentUser: async () => {
    return apiService.request('/auth/me');
  },

  // Logout user (client-side only)
  logout: () => {
    apiService.removeAuthToken();
    // In a real app, you might also call a logout endpoint to invalidate server-side token
  }
};

export default authService;