import Achievement from '../models/Achievement.js';
import { ApiError } from '../middleware/error.middleware.js';
import { deleteImagesByUrl } from '../services/cloudinary.service.js';
import { withImageRollback } from '../middleware/upload.middleware.js';

/**
 * @desc    Get all achievements
 * @route   GET /api/achievements
 * @access  Public
 */
export const getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find().sort({
      order: 1,
      date: -1,
      createdAt: -1,
    });

    res.json({
      success: true,
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single achievement
 * @route   GET /api/achievements/:id
 * @access  Public
 */
export const getAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      throw new ApiError(404, 'Achievement not found');
    }

    res.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create achievement
 * @route   POST /api/achievements
 * @access  Protected
 */
export const createAchievement = withImageRollback(async (req, res, next) => {
  try {
    const {
      title,
      issuer,
      date,
      description,
      credentialUrl,
      imageUrl,
      order,
    } = req.body;

    if (!title) {
      throw new ApiError(400, 'Achievement title is required');
    }

    if (imageUrl) req.trackImage(imageUrl);

    const achievement = await Achievement.create({
      title,
      issuer,
      date: date || undefined,
      description,
      credentialUrl,
      imageUrl,
      order,
    });

    req.clearTrackedImages();

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Update achievement
 * @route   PUT /api/achievements/:id
 * @access  Protected
 */
export const updateAchievement = async (req, res, next) => {
  try {
    const {
      title,
      issuer,
      date,
      description,
      credentialUrl,
      imageUrl,
      order,
    } = req.body;

    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      throw new ApiError(404, 'Achievement not found');
    }

    let removedImages = [];

    if (title !== undefined) achievement.title = title;
    if (issuer !== undefined) achievement.issuer = issuer;
    if (date !== undefined) achievement.date = date || undefined;
    if (description !== undefined) achievement.description = description;
    if (credentialUrl !== undefined) achievement.credentialUrl = credentialUrl;
    if (order !== undefined) achievement.order = order;
    if (imageUrl !== undefined) {
      const previousImage = achievement.imageUrl;
      if (previousImage && previousImage !== imageUrl) {
        removedImages = [previousImage];
      }
      achievement.imageUrl = imageUrl;
    }

    await achievement.save();
    if (removedImages.length > 0) {
      await deleteImagesByUrl(removedImages);
    }

    res.json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete achievement
 * @route   DELETE /api/achievements/:id
 * @access  Protected
 */
export const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      throw new ApiError(404, 'Achievement not found');
    }

    const imagesToDelete = achievement.imageUrl ? [achievement.imageUrl] : [];

    await achievement.deleteOne();
    if (imagesToDelete.length > 0) {
      await deleteImagesByUrl(imagesToDelete);
    }

    res.json({
      success: true,
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
