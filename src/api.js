/**
 * LOKI STORES - Centalized API Interface
 * Handles all backend communication for the frontend.
 */

// Local Django (`npm start` → NODE_ENV development); production build uses .env.production or Render fallback.
export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : 'https://ecommerce-django-backend-bcw7.onrender.com');

/**
 * Paths that must not send Authorization: expired/invalid JWT would make
 * JWTAuthentication fail with 401 before AllowAny runs (products, newsletter, etc.).
 */
const PUBLIC_API_PREFIXES = ['/api/products', '/api/categories', '/api/newsletter', '/api/contact'];

function isPublicEndpoint(endpoint) {
  return PUBLIC_API_PREFIXES.some((p) => endpoint.startsWith(p));
}

/** Normalize DRF / SimpleJWT error payloads into a single string. */
function messageFromErrorBody(data) {
  if (!data || typeof data !== 'object') return '';
  if (typeof data.error === 'string' && data.error.trim()) return data.error;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  const d = data.detail;
  if (typeof d === 'string' && d.trim()) return d;
  if (Array.isArray(d)) return d.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' ');
  if (d && typeof d === 'object') {
    if (Array.isArray(d.non_field_errors)) return d.non_field_errors.join(' ');
    return JSON.stringify(d);
  }
  if (typeof data.code === 'string' && data.code === 'no_active_account') {
    return 'No active account found with the given credentials.';
  }
  return '';
}

/**
 * Core API fetch helper with authentication and error handling
 */
export const apiCall = async (endpoint, options = {}) => {
  try {
    const { skipAuth, headers: optionHeaders, ...fetchOptions } = options;
    const token = localStorage.getItem('lokiToken') || sessionStorage.getItem('lokiToken');

    const headers = {
      'Content-Type': 'application/json',
      ...optionHeaders
    };

    const attachAuth = token && !skipAuth && !isPublicEndpoint(endpoint);
    if (attachAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers
    });

    const rawText = await response.text();
    let data = {};
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { detail: rawText };
      }
    }

    if (!response.ok) {
      if (response.status === 401 && attachAuth) {
        try {
          localStorage.removeItem('lokiToken');
          sessionStorage.removeItem('lokiToken');
          localStorage.removeItem('lokiLoggedIn');
          sessionStorage.removeItem('lokiLoggedIn');
        } catch (_) {
          /* ignore */
        }
      }
      const msg =
        messageFromErrorBody(data) || `HTTP error! status: ${response.status}`;
      throw new Error(msg);
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
    body: JSON.stringify(credentials),
    skipAuth: true
  }),

  signup: (userData) => apiCall('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
    skipAuth: true
  }),

  googleAuth: (accessToken) => apiCall('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ accessToken }),
    skipAuth: true
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

const api = {
  auth,
  products,
  contact,
  newsletter,
  apiCall,
  API_BASE_URL
};

export default api;
