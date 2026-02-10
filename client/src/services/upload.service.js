import api from './api';

export const uploadService = {
  /**
   * Get Cloudinary upload signature
   */
  getSignature: async () => {
    const response = await api.get('/upload/signature');
    return response.data.data;
  },

  /**
   * Upload image (base64 or URL)
   */
  uploadImage: async (image) => {
    const response = await api.post('/upload/image', { image });
    return response.data.data;
  },

  /**
   * Delete image from Cloudinary
   */
  deleteImage: async (publicId) => {
    const response = await api.delete('/upload/image', { data: { publicId } });
    return response.data;
  },
};
