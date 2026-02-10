import jwt from 'jsonwebtoken';
import { ApiError } from './error.middleware.js';

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized. No token provided.');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      email: decoded.email,
      role: 'owner',
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(error);
    } else if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Not authorized. Token verification failed.'));
    }
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (email) => {
  return jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};
