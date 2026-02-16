import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from '../middleware/error.middleware.js';

export const initCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Warning: Cloudinary credentials not fully configured');
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return true;
};

const isPdfSource = (value) => {
  if (!value || typeof value !== 'string') return false;
  const target = value.trim().toLowerCase();
  return (
    target.startsWith('data:application/pdf') ||
    target.includes('/raw/upload/') ||
    target.includes('format=pdf') ||
    /\.pdf(?:$|[?#])/.test(target)
  );
};

const inferUploadResourceType = (value) => (isPdfSource(value) ? 'raw' : 'image');
const inferResourceTypeFromUrl = (url) => (isPdfSource(url) ? 'raw' : 'image');

export const generateUploadSignature = (req, res, next) => {
  try {
    if (!initCloudinary()) {
      throw new ApiError(500, 'Cloudinary not configured');
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'portfolio';

    const params = {
      timestamp,
      folder,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || undefined,
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      success: true,
      data: {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!initCloudinary()) {
      throw new ApiError(500, 'Cloudinary not configured');
    }

    const { image, folder = 'portfolio' } = req.body;

    if (!image) {
      throw new ApiError(400, 'Media data is required');
    }

    const resourceType = inferUploadResourceType(image);
    const uploadOptions = {
      folder,
      resource_type: resourceType,
    };

    if (resourceType === 'image') {
      uploadOptions.transformation = [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ];
    }

    const result = await cloudinary.uploader.upload(image, uploadOptions);

    res.json({
      success: true,
      message: resourceType === 'raw' ? 'File uploaded successfully' : 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError(500, `Upload failed: ${error.message}`));
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    if (!initCloudinary()) {
      throw new ApiError(500, 'Cloudinary not configured');
    }

    const { publicId } = req.body;

    if (!publicId) {
      throw new ApiError(400, 'Public ID is required');
    }

    let result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: 'image',
    });

    if (result.result === 'not found') {
      result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        resource_type: 'raw',
      });
    }

    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new ApiError(400, 'Failed to delete image');
    }

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError(500, `Delete failed: ${error.message}`));
  }
};

const extractPublicIdFromUrl = (url) => {
  try {
    if (!url || typeof url !== 'string') return null;

    const parsed = new URL(url);
    if (!parsed.hostname.includes('cloudinary.com')) return null;

    const parts = parsed.pathname.split('/').filter(Boolean);
    const uploadIndex = parts.findIndex((part) => part === 'upload');
    if (uploadIndex === -1) return null;

    const afterUpload = parts.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex((part) => /^v\d+$/.test(part));
    let publicIdParts = versionIndex === -1 ? afterUpload : afterUpload.slice(versionIndex + 1);

    if (versionIndex === -1) {
      const transformPattern = /^[a-z_]+_[^/]+(,[a-z_]+_[^/]+)*$/;
      while (publicIdParts.length > 0 && transformPattern.test(publicIdParts[0])) {
        publicIdParts = publicIdParts.slice(1);
      }
    }

    if (!publicIdParts.length) return null;

    const last = publicIdParts[publicIdParts.length - 1];
    const withoutExt = last.includes('.') ? last.slice(0, last.lastIndexOf('.')) : last;
    const fullParts = [...publicIdParts.slice(0, -1), withoutExt];

    return fullParts.join('/');
  } catch (error) {
    return null;
  }
};

export const deleteImagesByUrl = async (urls = []) => {
  try {
    if (!initCloudinary()) {
      console.warn('[Cloudinary] Not configured, skipping deletion');
      return;
    }

    const trackedAssets = urls
      .filter(Boolean)
      .map((url) => {
        const publicId = extractPublicIdFromUrl(url);
        return {
          publicId,
          resourceType: inferResourceTypeFromUrl(url),
        };
      })
      .filter((asset) => Boolean(asset.publicId));

    if (trackedAssets.length === 0) {
      console.log('[Cloudinary] No valid publicIds to delete');
      return;
    }

    console.log(`[Cloudinary] Deleting ${trackedAssets.length} assets`);

    const results = await Promise.allSettled(
      trackedAssets.map(async ({ publicId, resourceType }) => {
        try {
          let result = await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
            resource_type: resourceType,
          });
          if (result.result === 'not found') {
            result = await cloudinary.uploader.destroy(publicId, {
              invalidate: true,
              resource_type: resourceType === 'image' ? 'raw' : 'image',
            });
          }
          console.log(`[Cloudinary] Delete ${publicId}: ${result.result}`);
          return result;
        } catch (error) {
          console.error(`[Cloudinary] Failed ${publicId}:`, error.message);
          throw error;
        }
      })
    );

    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
      console.warn(`[Cloudinary] ${failed.length} deletions failed`);
    }
  } catch (error) {
    console.error('[Cloudinary] Cleanup error:', error.message);
  }
};
