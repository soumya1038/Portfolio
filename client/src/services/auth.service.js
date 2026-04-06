import api from './api';

export const authService = {
  changeEmail: async (payload) => {
    const response = await api.post('/auth/change-email', payload);
    return response.data;
  },

  changePassword: async (payload) => {
    const response = await api.post('/auth/change-password', payload);
    return response.data;
  },

  resetPassword: async (payload) => {
    const response = await api.post('/auth/reset-password', payload);
    return response.data;
  },
};
