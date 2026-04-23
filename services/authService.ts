import api from './api';
import { secureStorage } from '../lib/secureStorage';

export const authService = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/api/v1/users/register', {
      username,
      email,
      password,
    });
    return response.data.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/api/v1/users/login', {
      email,
      password,
    });
    const { accessToken, refreshToken } = response.data.data;
    await secureStorage.setItem('access_token', accessToken);
    await secureStorage.setItem('refresh_token', refreshToken);
    return response.data.data;
  },

  logout: async () => {
    await api.post('/api/v1/users/logout');
    await secureStorage.deleteItem('access_token');
    await secureStorage.deleteItem('refresh_token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/v1/users/current-user');
    return response.data.data;
  },

  isLoggedIn: async (): Promise<boolean> => {
    const token = await secureStorage.getItem('access_token');
    return !!token;
  },
};
