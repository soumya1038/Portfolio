import Portfolio from '../models/Portfolio.js';
import { ApiError } from '../middleware/error.middleware.js';
import { deleteImagesByUrl } from '../services/cloudinary.service.js';

/**
 * @desc    Get portfolio data
 * @route   GET /api/portfolio
 * @access  Public
 */
export const getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.getPortfolio();
    
    res.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update portfolio data
 * @route   PUT /api/portfolio
 * @access  Protected
 */
export const updatePortfolio = async (req, res, next) => {
  try {
    const {
      name,
      title,
      bio,
      profileImage,
      email,
      location,
      socialLinks,
      skills,
      resumeUrl,
    } = req.body;

    let portfolio = await Portfolio.getPortfolio();
    let removedImages = [];

    if (name !== undefined) portfolio.name = name;
    if (title !== undefined) portfolio.title = title;
    if (bio !== undefined) portfolio.bio = bio;
    if (email !== undefined) portfolio.email = email;
    if (location !== undefined) portfolio.location = location;
    if (socialLinks !== undefined) portfolio.socialLinks = { ...portfolio.socialLinks, ...socialLinks };
    if (skills !== undefined) portfolio.skills = skills;
    
    if (profileImage !== undefined) {
      const previousImage = portfolio.profileImage;
      if (previousImage && previousImage !== profileImage) {
        removedImages.push(previousImage);
      }
      portfolio.profileImage = profileImage;
    }
    
    if (resumeUrl !== undefined) {
      const previousResume = portfolio.resumeUrl;
      if (previousResume && previousResume !== resumeUrl) {
        removedImages.push(previousResume);
      }
      portfolio.resumeUrl = resumeUrl;
    }

    await portfolio.save();
    if (removedImages.length > 0) {
      await deleteImagesByUrl(removedImages);
    }

    res.json({
      success: true,
      message: 'Portfolio updated successfully',
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a skill
 * @route   POST /api/portfolio/skills
 * @access  Protected
 */
export const addSkill = async (req, res, next) => {
  try {
    const { name, category } = req.body;

    if (!name) {
      throw new ApiError(400, 'Skill name is required');
    }

    const portfolio = await Portfolio.getPortfolio();
    
    const exists = portfolio.skills.some(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
    
    if (exists) {
      throw new ApiError(400, 'Skill already exists');
    }

    portfolio.skills.push({ name, category: category || 'Other' });
    await portfolio.save();

    res.json({
      success: true,
      message: 'Skill added successfully',
      data: portfolio.skills,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove a skill
 * @route   DELETE /api/portfolio/skills/:skillId
 * @access  Protected
 */
export const removeSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;

    const portfolio = await Portfolio.getPortfolio();
    
    portfolio.skills = portfolio.skills.filter(
      (s) => s._id.toString() !== skillId
    );
    
    await portfolio.save();

    res.json({
      success: true,
      message: 'Skill removed successfully',
      data: portfolio.skills,
    });
  } catch (error) {
    next(error);
  }
};
