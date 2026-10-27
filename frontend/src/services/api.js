import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to inject JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('swiftship_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear local auth
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/track') && currentPath !== '/') {
        localStorage.removeItem('swiftship_token');
        localStorage.removeItem('swiftship_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
