import axios from 'axios';

const userApi = axios.create({
  baseURL: import.meta.env.VITE_SPRING_API_URL || 'http://127.0.0.1:8080/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default userApi;
