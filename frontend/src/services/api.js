import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Demo mode auth interceptor
api.interceptors.request.use(
  (config) => {
    const demoUser = localStorage.getItem('demo_username');
    const demoPass = localStorage.getItem('demo_password');
    
    if (demoUser && demoPass) {
      config.auth = {
        username: demoUser,
        password: demoPass,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        console.error('Authentication Error:', error.response.data);
        // Force logout if not already on login page
        if (window.location.pathname !== '/login') {
            localStorage.removeItem('demo_username');
            localStorage.removeItem('demo_password');
            window.location.href = '/login';
        }
      } else if (status === 404) {
        console.error('Not Found:', error.response.data);
      } else if (status >= 500) {
        console.error('Server Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network Error - Backend might be offline');
    }
    return Promise.reject(error);
  }
);

export default api;
