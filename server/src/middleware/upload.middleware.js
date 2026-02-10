import { deleteImagesByUrl } from '../services/cloudinary.service.js';

export const withImageRollback = (handler) => {
  return async (req, res, next) => {
    const uploadedImages = [];
    
    req.trackImage = (imageUrl) => {
      if (imageUrl) uploadedImages.push(imageUrl);
    };
    
    req.clearTrackedImages = () => {
      uploadedImages.length = 0;
    };

    try {
      await handler(req, res, next);
    } catch (error) {
      if (uploadedImages.length > 0) {
        await deleteImagesByUrl(uploadedImages);
      }
      next(error);
    }
  };
};
