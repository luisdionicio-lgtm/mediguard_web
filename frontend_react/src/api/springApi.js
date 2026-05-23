import axios from 'axios';

const springApi = axios.create({
  baseURL: import.meta.env.VITE_SPRING_API_URL || 'http://127.0.0.1:8081/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default springApi;
