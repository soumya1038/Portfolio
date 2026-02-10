import { uploadService } from '../services/upload.service';

export const extractPublicIdFromUrl = (url) => {
  try {
    if (!url || typeof url !== 'string') return null;
    
    const parsed = new URL(url);
    if (!parsed.hostname.includes('cloudinary.com')) return null;
    
    const parts = parsed.pathname.split('/').filter(Boolean);
    const uploadIndex = parts.findIndex((part) => part === 'upload');
    if (uploadIndex === -1) return null;
    
    const afterUpload = parts.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex((part) => /^v\d+$/.test(part));
    const publicIdParts = versionIndex === -1 ? afterUpload : afterUpload.slice(versionIndex + 1);
    
    if (!publicIdParts.length) return null;
    
    const last = publicIdParts[publicIdParts.length - 1];
    const withoutExt = last.includes('.') ? last.slice(0, last.lastIndexOf('.')) : last;
    const fullParts = [...publicIdParts.slice(0, -1), withoutExt];
    
    return fullParts.join('/');
  } catch {
    return null;
  }
};

export const cleanupImages = async (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) return;
  
  const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
  
  await Promise.allSettled(
    urls.map(async (url) => {
      const publicId = extractPublicIdFromUrl(url);
      if (publicId) {
        try {
          await uploadService.deleteImage(publicId);
        } catch (error) {
          console.warn(`Failed to cleanup image: ${publicId}`);
        }
      }
    })
  );
};

export const withImageCleanup = async (operation, newImages = []) => {
  const imagesToCleanup = [];
  
  try {
    const images = Array.isArray(newImages) ? newImages : [newImages].filter(Boolean);
    imagesToCleanup.push(...images);
    
    const result = await operation();
    return result;
  } catch (error) {
    await cleanupImages(imagesToCleanup);
    throw error;
  }
};
