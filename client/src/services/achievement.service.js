import api from './api';

export const achievementService = {
  /**
   * Get all achievements (public)
   */
  getAchievements: async () => {
    const response = await api.get('/achievements');
    return response.data;
  },

  /**
   * Get single achievement (public)
   */
  getAchievement: async (id) => {
    const response = await api.get(`/achievements/${id}`);
    return response.data;
  },

  /**
   * Create achievement (protected)
   */
  createAchievement: async (data) => {
    const response = await api.post('/achievements', data);
    return response.data;
  },

  /**
   * Update achievement (protected)
   */
  updateAchievement: async (id, data) => {
    const response = await api.put(`/achievements/${id}`, data);
    return response.data;
  },

  /**
   * Delete achievement (protected)
   */
  deleteAchievement: async (id) => {
    const response = await api.delete(`/achievements/${id}`);
    return response.data;
  },
};
