import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.middleware.js';
import { ApiError } from '../middleware/error.middleware.js';

/**
 * @desc    Login owner
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ApiError(400, 'Please provide email and password');
    }

    // Get owner credentials from environment
    const ownerEmail = process.env.OWNER_EMAIL;
    const ownerPasswordHash = process.env.OWNER_PASSWORD_HASH;

    // Check if owner credentials are configured
    if (!ownerEmail || !ownerPasswordHash) {
      throw new ApiError(500, 'Owner credentials not configured');
    }

    // Verify email
    if (email.toLowerCase() !== ownerEmail.toLowerCase()) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, ownerPasswordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        email: ownerEmail,
        role: 'owner',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify token validity
 * @route   GET /api/auth/verify
 * @access  Protected
 */
export const verifyToken = async (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: req.user,
  });
};

/**
 * @desc    Generate password hash (utility endpoint for setup)
 * @route   POST /api/auth/hash
 * @access  Public (only in development)
 */
export const generateHash = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      throw new ApiError(403, 'This endpoint is disabled in production');
    }

    const { password } = req.body;

    if (!password) {
      throw new ApiError(400, 'Please provide a password');
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    res.json({
      success: true,
      message: 'Password hashed successfully',
      hash,
      note: 'Copy this hash to your .env file as OWNER_PASSWORD_HASH',
    });
  } catch (error) {
    next(error);
  }
};
