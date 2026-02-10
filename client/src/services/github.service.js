import api from './api';

export const githubService = {
  /**
   * Import repository details from GitHub
   */
  importRepo: async (githubUrl) => {
    const response = await api.post('/upload/github', { githubUrl });
    return response.data.data;
  },
};
