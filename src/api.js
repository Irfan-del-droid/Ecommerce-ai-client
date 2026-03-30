/**
 * LOKI STORES - Centalized API Interface
 * Handles all backend communication for the frontend.
 */

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://ecommerce-ai-server-4m7o.onrender.com';

/**
 * Core API fetch helper with authentication and error handling
 */
export const apiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('lokiToken') || sessionStorage.getItem('lokiToken');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Call [${endpoint}] failed:`, error);
    throw error;
  }
};

/**
 * Authentication Services
 */
export const auth = {
  login: (credentials) => apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  signup: (userData) => apiCall('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  googleAuth: (accessToken) => apiCall('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ accessToken })
  }),

  getProfile: () => apiCall('/api/auth/me'),
};

/**
 * Product Services
 */
export const products = {
  getAll: () => apiCall('/api/products'),
  getById: (id) => apiCall(`/api/products/${id}`),
};

/**
 * Contact & Support Services
 */
export const contact = {
  sendMessage: (messageData) => apiCall('/api/contact', {
    method: 'POST',
    body: JSON.stringify(messageData)
  }),
};

/**
 * Newsletter Services
 */
export const newsletter = {
  subscribe: (email) => apiCall('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
};

export default {
  auth,
  products,
  contact,
  newsletter,
  apiCall,
  API_BASE_URL
};
