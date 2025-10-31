import axios from 'axios';
import { getAccessToken } from '../token';
import refreshToken from './refreshtoken.service';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (refreshing) {
        await new Promise<void>((resolve) => queue.push(resolve));
        original.headers.Authorization = `Bearer ${getAccessToken()}`;
        return api(original);
      }
      original._retry = true;
      try {
        refreshing = true;
        await refreshToken(); 
        queue.forEach((fn) => fn());
        queue = [];
        return api(original);
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;


