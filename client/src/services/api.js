import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5501/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    const status = error.response?.status;
    
    // Only handle token expiration for auth-related 401 errors
    // Check if the error message indicates a token problem
    if (status === 401) {
      const isTokenError = 
        message.toLowerCase().includes('token') ||
        message.toLowerCase().includes('not authorized') ||
        message.toLowerCase().includes('session') ||
        message.toLowerCase().includes('log in');
      
      if (isTokenError) {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/owner')) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
