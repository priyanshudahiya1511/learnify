import api from './api';

export const courseService = {
  getCourses: async (page: number = 1, limit: number = 10) => {
    const response = await api.get('/api/v1/public/randomproducts', {
      params: { page, limit },
    });
    return response.data.data;
  },

  getInstructors: async (page: number = 1, limit: number = 10) => {
    const response = await api.get('/api/v1/public/randomusers', {
      params: { page, limit },
    });
    return response.data.data;
  },

  getCourseById: async (id: string) => {
    const response = await api.get(`/api/v1/public/randomproducts/${id}`);
    return response.data.data;
  },
};
