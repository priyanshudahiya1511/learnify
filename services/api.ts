import axios from 'axios';
import { secureStorage } from '../lib/secureStorage';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: 'https://api.freeapi.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await secureStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!error.response && config && config._retryCount === undefined) {
      config._retryCount = 0;
    }

    if (!error.response && config._retryCount < 3) {
      config._retryCount += 1;
      console.log(`Retrying... attempt ${config._retryCount}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return api.request(config);
    }

    if (error.response?.status === 401) {
      await secureStorage.deleteItem('access_token');
      await secureStorage.deleteItem('refresh_token');
      router.replace('/(auth)/login');
    }

    return Promise.reject(error);
  }
);

export default api;
