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
   * Get engagement stats (public)
   */
  getEngagementSummary: async () => {
    const response = await api.get('/portfolio/engagement');
    return response.data;
  },

  /**
   * Register visitor by unique IP (public)
   */
  registerVisitor: async () => {
    try {
      const response = await api.post('/portfolio/engagement/visit');
      return response.data;
    } catch (error) {
      if (error.message?.includes('Not Found - /api/portfolio/engagement/visit')) {
        const fallbackResponse = await api.post('/portfolio/visit');
        return fallbackResponse.data;
      }
      throw error;
    }
  },

  /**
   * Submit rating and optional feedback (public)
   */
  submitRating: async (payload) => {
    try {
      const response = await api.post('/portfolio/engagement/rating', payload);
      return response.data;
    } catch (error) {
      if (error.message?.includes('Not Found - /api/portfolio/engagement/rating')) {
        const fallbackResponse = await api.post('/portfolio/rating', payload);
        return fallbackResponse.data;
      }
      throw error;
    }
  },

  /**
   * Ping backend to keep instance warm
   */
  pingKeepAlive: async () => {
    const response = await api.get(`/?ping=${Date.now()}`);
    return response.data;
  },

  /**
   * Get owner dashboard settings (protected)
   */
  getOwnerSettings: async () => {
    const response = await api.get('/portfolio/owner-settings');
    return response.data;
  },

  /**
   * Update owner dashboard settings (protected)
   */
  updateOwnerSettings: async (settings) => {
    const response = await api.put('/portfolio/owner-settings', settings);
    return response.data;
  },

  /**
   * Get suggestions (protected)
   */
  getSuggestions: async () => {
    const response = await api.get('/portfolio/suggestions');
    return response.data;
  },

  /**
   * Delete one suggestion (protected)
   */
  deleteSuggestion: async (suggestionId) => {
    const response = await api.delete(`/portfolio/suggestions/${suggestionId}`);
    return response.data;
  },

  /**
   * Delete all suggestions (protected)
   */
  clearSuggestions: async () => {
    const response = await api.delete('/portfolio/suggestions');
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
