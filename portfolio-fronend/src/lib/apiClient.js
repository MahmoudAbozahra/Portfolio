import axios from 'axios';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const resolveMediaUrl = (value) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/.test(value)) return value;
  return `${API_BASE_URL}${value}`;
};

let csrfToken = null;
export const setCsrfToken = (value) => { csrfToken = value || null; };

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  withCredentials: true,
  headers: { Accept: 'application/json' }
});

apiClient.interceptors.request.use((config) => {
  const method = String(config.method || 'get').toLowerCase();
  if (csrfToken && !['get', 'head', 'options'].includes(method)) config.headers['X-CSRF-Token'] = csrfToken;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.endsWith('/auth/login')) {
      csrfToken = null;
      window.dispatchEvent(new CustomEvent('portfolio:session-expired'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
