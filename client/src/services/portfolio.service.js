import api from './api';

export const portfolioService = {
  /**
   * Get portfolio data (public)
   */
  getPortfolio: async () => {
    const response = await api.get('/portfolio');
    return response.data;
  },

  /**
   * Update portfolio data (protected)
   */
  updatePortfolio: async (data) => {
    const response = await api.put('/portfolio', data);
    return response.data;
  },

  /**
   * Add a skill (protected)
   */
  addSkill: async (skill) => {
    const response = await api.post('/portfolio/skills', skill);
    return response.data;
  },

  /**
   * Remove a skill (protected)
   */
  removeSkill: async (skillId) => {
    const response = await api.delete(`/portfolio/skills/${skillId}`);
    return response.data;
  },
};
