import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('quantum_user');
    if (userData) {
      try {
        const { token } = JSON.parse(userData);
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch (_) {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage
      localStorage.removeItem('quantum_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export default api;
