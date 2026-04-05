// Base API service with configuration
// In production the frontend is served from the same server, so we use a relative path
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const apiService = {
  // Set authorization header for requests that require auth
  setAuthToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Remove auth token (for logout)
  removeAuthToken: () => {
    localStorage.removeItem('token');
  },

  // Get auth token from localStorage
  getAuthToken: () => {
    return localStorage.getItem('token');
  },

  // Generic request handler
  request: async (endpoint, options = {}) => {
    const token = apiService.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method: options.method || 'GET',
      headers,
      ...options,
    };

    // Remove headers if we're overriding them
    if (options.headers) {
      delete config.headers;
      config.headers = headers;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      // Handle non-JSON responses (like empty responses) efficiently
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = text;
      }

      if (!response.ok) {
        throw new Error(data.message || data || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiService;