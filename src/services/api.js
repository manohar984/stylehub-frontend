const API_BASE_URL = 'https://stylehub-backend-6968.onrender.com';

import axios from 'axios';

// Create Axios Instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

// Axios Request Interceptor: Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios Response Interceptor: Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and reload if unauthorized on admin path
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin') {
        localStorage.removeItem('jwt_token');
        window.location.href = '/admin?message=session_expired';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const apiService = {
  // Auth API
  loginAdmin: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data; // Expected: { token: '...' }
  },

  // Product APIs
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data; // Expected: { products, page, pages, totalProducts, categories }
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (formData) => {
    // Note: FormData requires 'multipart/form-data' content type
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id, formData) => {
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Analytics Stats API
  getDashboardStats: async () => {
    const response = await api.get('/products/stats');
    return response.data; // Expected: { totalProducts, totalCategories, recentProducts, categoryStats, dbStatus }
  },
  
  // Helper to get raw server URL
  getServerURL: () => API_BASE_URL
};

export default api;
