import jwt from 'jsonwebtoken';
import { ApiError } from './error.middleware.js';
import { getOwnerAuth } from '../services/ownerAuth.service.js';

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
    const ownerAuth = await getOwnerAuth();

    const decodedEmail = String(decoded.email || '').toLowerCase();
    const currentEmail = String(ownerAuth.email || '').toLowerCase();
    const decodedSessionVersion = Number(decoded.sessionVersion ?? 0);
    const currentSessionVersion = Number(ownerAuth.sessionVersion ?? 0);

    if (decodedEmail !== currentEmail || decodedSessionVersion !== currentSessionVersion) {
      throw new ApiError(401, 'Session is no longer valid. Please log in again.');
    }

    // Attach user info to request
    req.user = {
      email: ownerAuth.email,
      role: 'owner',
      sessionVersion: ownerAuth.sessionVersion,
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
export const generateToken = (email, sessionVersion = 0) => {
  return jwt.sign(
    { email, sessionVersion },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};
