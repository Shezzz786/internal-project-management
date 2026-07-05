import axios from 'axios';

const api = axios.create({
  baseURL: 'https://internal-project-management.onrender.com/api', // Render live URL
});

// Request interceptor to add the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
