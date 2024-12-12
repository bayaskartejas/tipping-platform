import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tipnex-server.tipnex.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (endpoint, credentials) => api.post(endpoint, credentials);
export const fetchUserData = () => api.get('/user');
// Add other API calls as needed 

export default api;