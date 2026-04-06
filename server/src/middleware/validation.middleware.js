import { body, param, validationResult } from 'express-validator';
import { ApiError } from './error.middleware.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg).join(', ');
    return next(new ApiError(400, messages));
  }
  next();
};

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

export const validateChangeEmail = [
  body('newEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('A valid new email is required'),
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('recoveryPhone')
    .notEmpty()
    .withMessage('Recovery phone is required'),
  validate,
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('recoveryPhone')
    .notEmpty()
    .withMessage('Recovery phone is required'),
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters'),
  validate,
];

export const validateResetPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid login email is required'),
  body('recoveryPhone')
    .notEmpty()
    .withMessage('Recovery phone is required'),
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters'),
  validate,
];

export const validatePortfolio = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be 100 characters or less'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Title must be 150 characters or less'),
  body('availabilityTag')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Availability tag must be 60 characters or less'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio must be 1000 characters or less'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('profileImage')
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: true })
    .withMessage('Profile image must be a valid URL'),
  body('resumeUrl')
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: true })
    .withMessage('Resume URL must be a valid URL'),
  validate,
];

export const validateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 150 })
    .withMessage('Title must be 150 characters or less'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 20000 })
    .withMessage('Description must be 20000 characters or less'),
  body('techStack')
    .optional()
    .isArray()
    .withMessage('Tech stack must be an array'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('githubUrl')
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: true })
    .withMessage('GitHub URL must be a valid URL'),
  body('liveUrl')
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: true })
    .withMessage('Live URL must be a valid URL'),
  body('commentsCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Comments must be a non-negative whole number'),
  validate,
];

export const validateAchievement = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 150 })
    .withMessage('Title must be 150 characters or less'),
  body('issuer')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Issuer must be 150 characters or less'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 20000 })
    .withMessage('Description must be 20000 characters or less'),
  body('credentialUrl')
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: true })
    .withMessage('Credential URL must be a valid URL'),
  body('imageUrl')
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: true })
    .withMessage('Image URL must be a valid URL'),
  validate,
];

export const validateId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate,
];
