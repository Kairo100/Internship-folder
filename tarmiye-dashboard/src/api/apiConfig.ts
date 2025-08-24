// src/lib/api-services/apiConfig.ts
import axios from 'axios';

// Replace with your actual backend API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add an interceptor to include JWT token in requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or a more secure storage method
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add an interceptor to handle token expiration or 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors, e.g., redirect to login
      // This is a client-side concern, so we'll handle it in AuthProvider or specific pages
      console.error('Unauthorized API request, token might be expired or invalid.');
      // You might want to trigger a logout here, but be careful with redirects on server components.
      // For now, just log and let the AuthProvider handle the global state change.
    }
    return Promise.reject(error);
  }
);

export default api;
