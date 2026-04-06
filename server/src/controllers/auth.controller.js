import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.middleware.js';
import { ApiError } from '../middleware/error.middleware.js';
import {
  getOwnerAuth,
  hashOwnerPassword,
  normalizeLoginEmail,
  verifyRecoveryPhoneOrThrow,
} from '../services/ownerAuth.service.js';

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

    const ownerAuth = await getOwnerAuth();
    const normalizedEmail = normalizeLoginEmail(email);

    // Verify email
    if (normalizedEmail !== ownerAuth.email) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, ownerAuth.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(ownerAuth.email, ownerAuth.sessionVersion);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        email: ownerAuth.email,
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
 * @desc    Change login email
 * @route   POST /api/auth/change-email
 * @access  Protected
 */
export const changeEmail = async (req, res, next) => {
  try {
    const { currentPassword, recoveryPhone, newEmail } = req.body;
    const ownerAuth = await getOwnerAuth();
    const normalizedNewEmail = normalizeLoginEmail(newEmail);

    const isMatch = await bcrypt.compare(currentPassword, ownerAuth.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    verifyRecoveryPhoneOrThrow(recoveryPhone);

    if (normalizedNewEmail === ownerAuth.email) {
      throw new ApiError(400, 'New email must be different from current login email');
    }

    ownerAuth.email = normalizedNewEmail;
    ownerAuth.sessionVersion += 1;
    await ownerAuth.save();

    res.json({
      success: true,
      message: 'Login email updated successfully. Please log in again.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password (known current password)
 * @route   POST /api/auth/change-password
 * @access  Protected
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, recoveryPhone, newPassword } = req.body;
    const ownerAuth = await getOwnerAuth();

    const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, ownerAuth.passwordHash);
    if (!isCurrentPasswordMatch) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    verifyRecoveryPhoneOrThrow(recoveryPhone);

    const isSameAsCurrentPassword = await bcrypt.compare(newPassword, ownerAuth.passwordHash);
    if (isSameAsCurrentPassword) {
      throw new ApiError(400, 'New password must be different from current password');
    }

    ownerAuth.passwordHash = await hashOwnerPassword(newPassword);
    ownerAuth.lastPasswordChangedAt = new Date();
    ownerAuth.sessionVersion += 1;
    await ownerAuth.save();

    res.json({
      success: true,
      message: 'Password updated successfully. Please log in again.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password (forgot current password)
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, recoveryPhone, newPassword } = req.body;
    const ownerAuth = await getOwnerAuth();
    const normalizedEmail = normalizeLoginEmail(email);

    if (normalizedEmail !== ownerAuth.email) {
      throw new ApiError(401, 'Recovery details are invalid');
    }

    verifyRecoveryPhoneOrThrow(recoveryPhone);

    const isSameAsCurrentPassword = await bcrypt.compare(newPassword, ownerAuth.passwordHash);
    if (isSameAsCurrentPassword) {
      throw new ApiError(400, 'New password must be different from current password');
    }

    ownerAuth.passwordHash = await hashOwnerPassword(newPassword);
    ownerAuth.lastPasswordChangedAt = new Date();
    ownerAuth.sessionVersion += 1;
    await ownerAuth.save();

    res.json({
      success: true,
      message: 'Password reset successful. Please log in again.',
    });
  } catch (error) {
    next(error);
  }
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
      note: 'Copy this hash to your .env file as OWNER_PASSWORD_HASH for initial owner auth setup',
    });
  } catch (error) {
    next(error);
  }
};
