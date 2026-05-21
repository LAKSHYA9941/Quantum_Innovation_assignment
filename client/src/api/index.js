import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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

// Auth endpoints that should NEVER trigger a redirect on 401
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register'];

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) =>
      error.config?.url?.includes(path)
    );

    // Only redirect on 401 for PROTECTED routes, not login/register
    if (error.response?.status === 401 && !isAuthEndpoint) {
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