import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const normalizedBaseUrl = rawBaseUrl.endsWith('/api')
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: normalizedBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from main site if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('main_site_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
