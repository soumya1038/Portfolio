import crypto from 'crypto';
import Portfolio from '../models/Portfolio.js';
import { ApiError } from '../middleware/error.middleware.js';
import { deleteImagesByUrl } from '../services/cloudinary.service.js';

const VISITOR_HASH_SALT = process.env.VISITOR_HASH_SALT || process.env.JWT_SECRET || 'portfolio-visitor-salt';

const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const firstForwarded =
    typeof forwardedFor === 'string'
      ? forwardedFor.split(',')[0]?.trim()
      : Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : null;

  const ip = firstForwarded || req.ip || req.connection?.remoteAddress || '';
  return ip.replace('::ffff:', '').replace('::1', '127.0.0.1');
};

const hashVisitorIp = (ip) =>
  crypto.createHash('sha256').update(`${VISITOR_HASH_SALT}:${ip}`).digest('hex');

const getRaterFingerprint = (req) => {
  const clientIp = getClientIp(req);
  if (clientIp) {
    return hashVisitorIp(clientIp);
  }

  const userAgent = req.headers['user-agent'] || 'unknown-agent';
  const acceptedLanguage = req.headers['accept-language'] || 'unknown-language';
  return hashVisitorIp(`ua:${userAgent}|lang:${acceptedLanguage}`);
};

const buildEngagementSummary = (portfolio) => {
  const engagement = portfolio?.engagement || {};
  const averageRating = Number(engagement.averageRating || 0);

  return {
    uniqueVisitors: Number(engagement.uniqueVisitors || 0),
    averageRating: Number.isFinite(averageRating) ? averageRating : 0,
    totalRatings: Number(engagement.totalRatings || 0),
  };
};

const buildOwnerSettings = (portfolio) => ({
  keepServerAwake: Boolean(portfolio?.ownerSettings?.keepServerAwake),
});

const ensureOwnerSettingsState = (portfolio) => {
  if (!portfolio.ownerSettings || typeof portfolio.ownerSettings !== 'object') {
    portfolio.ownerSettings = {};
  }

  if (typeof portfolio.ownerSettings.keepServerAwake !== 'boolean') {
    portfolio.ownerSettings.keepServerAwake = false;
  }
};

const ensureEngagementState = (portfolio) => {
  if (!portfolio.engagement) {
    portfolio.engagement = {};
  }

  if (!Array.isArray(portfolio.engagement.visitorFingerprints)) {
    portfolio.engagement.visitorFingerprints = [];
  }

  if (!Array.isArray(portfolio.engagement.feedback)) {
    portfolio.engagement.feedback = [];
  }

  if (!Number.isFinite(Number(portfolio.engagement.uniqueVisitors))) {
    portfolio.engagement.uniqueVisitors = 0;
  }

  if (!Number.isFinite(Number(portfolio.engagement.totalRatings))) {
    portfolio.engagement.totalRatings = 0;
  }

  if (!Number.isFinite(Number(portfolio.engagement.ratingSum))) {
    portfolio.engagement.ratingSum = 0;
  }

  if (!Number.isFinite(Number(portfolio.engagement.averageRating))) {
    portfolio.engagement.averageRating = 0;
  }
};

const computeRatingStats = (entries = []) => {
  const totalRatings = entries.length;
  const ratingSum = entries.reduce((sum, entry) => sum + Number(entry.rating || 0), 0);
  const averageRating = totalRatings > 0 ? Number((ratingSum / totalRatings).toFixed(2)) : 0;

  return {
    totalRatings,
    ratingSum,
    averageRating,
  };
};

/**
 * @desc    Get portfolio data
 * @route   GET /api/portfolio
 * @access  Public
 */
export const getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.getPortfolio();
    const portfolioData = portfolio.toObject ? portfolio.toObject() : portfolio;
    delete portfolioData.engagement;
    
    res.json({
      success: true,
      data: portfolioData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public engagement summary
 * @route   GET /api/portfolio/engagement
 * @access  Public
 */
export const getEngagementSummary = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.getPortfolio();

    res.json({
      success: true,
      data: buildEngagementSummary(portfolio),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register visitor by unique IP
 * @route   POST /api/portfolio/engagement/visit
 * @access  Public
 */
export const registerVisitor = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.getPortfolio();
    const visitorIp = getClientIp(req);

    if (visitorIp) {
      const visitorFingerprint = hashVisitorIp(visitorIp);

      await Portfolio.updateOne(
        {
          _id: portfolio._id,
          'engagement.visitorFingerprints': { $ne: visitorFingerprint },
        },
        {
          $addToSet: { 'engagement.visitorFingerprints': visitorFingerprint },
          $inc: { 'engagement.uniqueVisitors': 1 },
        }
      );
    }

    const latestPortfolio = await Portfolio.getPortfolio();

    res.json({
      success: true,
      data: buildEngagementSummary(latestPortfolio),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit a rating and optional feedback
 * @route   POST /api/portfolio/engagement/rating
 * @access  Public
 */
export const submitRating = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    const ratingValue = Number(rating);
    const note = typeof feedback === 'string' ? feedback.trim() : '';

    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      throw new ApiError(400, 'Rating must be an integer between 1 and 5');
    }

    if (ratingValue <= 3 && !note) {
      throw new ApiError(400, 'Feedback is required for ratings of 3 stars or less');
    }

    if (note.length > 700) {
      throw new ApiError(400, 'Feedback cannot exceed 700 characters');
    }

    const portfolio = await Portfolio.getPortfolio();
    ensureEngagementState(portfolio);
    const raterFingerprint = getRaterFingerprint(req);
    const now = new Date();

    const existingEntry = portfolio.engagement.feedback.find(
      (entry) => entry.raterFingerprint && entry.raterFingerprint === raterFingerprint
    );

    if (existingEntry) {
      existingEntry.rating = ratingValue;
      existingEntry.message = note;
      existingEntry.updatedAt = now;
    } else {
      portfolio.engagement.feedback.push({
        raterFingerprint,
        rating: ratingValue,
        message: note,
        createdAt: now,
        updatedAt: now,
      });
    }

    const { totalRatings, ratingSum, averageRating } = computeRatingStats(portfolio.engagement.feedback);
    portfolio.engagement.totalRatings = totalRatings;
    portfolio.engagement.ratingSum = ratingSum;
    portfolio.engagement.averageRating = averageRating;

    await portfolio.save();

    res.json({
      success: true,
      message: existingEntry ? 'Rating updated successfully' : 'Thanks for the rating',
      data: buildEngagementSummary(portfolio),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get owner dashboard settings
 * @route   GET /api/portfolio/owner-settings
 * @access  Protected
 */
export const getOwnerSettings = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.getPortfolio();
    ensureOwnerSettingsState(portfolio);

    res.json({
      success: true,
      data: buildOwnerSettings(portfolio),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update owner dashboard settings
 * @route   PUT /api/portfolio/owner-settings
 * @access  Protected
 */
export const updateOwnerSettings = async (req, res, next) => {
  try {
    const { keepServerAwake } = req.body;

    if (typeof keepServerAwake !== 'boolean') {
      throw new ApiError(400, 'keepServerAwake must be true or false');
    }

    const portfolio = await Portfolio.getPortfolio();
    ensureOwnerSettingsState(portfolio);

    portfolio.ownerSettings.keepServerAwake = keepServerAwake;
    await portfolio.save();

    res.json({
      success: true,
      message: 'Owner settings updated successfully',
      data: buildOwnerSettings(portfolio),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all suggestions/feedback
 * @route   GET /api/portfolio/suggestions
 * @access  Protected
 */
export const getSuggestions = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.getPortfolio();
    ensureEngagementState(portfolio);

    const suggestions = portfolio.engagement.feedback
      .filter((item) => typeof item.message === 'string' && item.message.trim().length > 0)
      .map((item) => ({
        _id: item._id,
        rating: item.rating,
        message: item.message || '',
        createdAt: item.updatedAt || item.createdAt,
      }))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete one suggestion/feedback entry
 * @route   DELETE /api/portfolio/suggestions/:suggestionId
 * @access  Protected
 */
export const deleteSuggestion = async (req, res, next) => {
  try {
    const { suggestionId } = req.params;

    if (!suggestionId) {
      throw new ApiError(400, 'Suggestion ID is required');
    }

    const portfolio = await Portfolio.getPortfolio();
    ensureEngagementState(portfolio);

    const suggestion = portfolio.engagement.feedback.find((item) => item._id.toString() === suggestionId);

    if (!suggestion) {
      throw new ApiError(404, 'Suggestion not found');
    }

    suggestion.message = '';
    suggestion.updatedAt = new Date();

    await portfolio.save();

    const remainingSuggestions = portfolio.engagement.feedback.filter(
      (item) => typeof item.message === 'string' && item.message.trim().length > 0
    ).length;

    res.json({
      success: true,
      message: 'Suggestion deleted successfully',
      data: remainingSuggestions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete all suggestions/feedback entries
 * @route   DELETE /api/portfolio/suggestions
 * @access  Protected
 */
export const clearSuggestions = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.getPortfolio();
    ensureEngagementState(portfolio);

    portfolio.engagement.feedback.forEach((item) => {
      item.message = '';
      item.updatedAt = new Date();
    });
    await portfolio.save();

    res.json({
      success: true,
      message: 'All suggestions deleted successfully',
      data: [],
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
