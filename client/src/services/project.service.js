import api from './api';

export const projectService = {
  /**
   * Get all projects (public)
   */
  getProjects: async (featured = false) => {
    let isFeatured = featured;
    if (featured && typeof featured === 'object') {
      isFeatured = featured?.queryKey?.[1]?.featured ?? false;
    }
    const params = isFeatured ? { featured: 'true' } : {};
    const response = await api.get('/projects', { params });
    return response.data;
  },

  /**
   * Get single project (public)
   */
  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  /**
   * Create project (protected)
   */
  createProject: async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  /**
   * Update project (protected)
   */
  updateProject: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  /**
   * Delete project (protected)
   */
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  /**
   * Reorder projects (protected)
   */
  reorderProjects: async (orderedIds) => {
    const response = await api.put('/projects/reorder', { orderedIds });
    return response.data;
  },
};
