import express from 'express';
import {
  changeEmail,
  changePassword,
  generateHash,
  login,
  resetPassword,
  verifyToken,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  validateChangeEmail,
  validateChangePassword,
  validateLogin,
  validateResetPassword,
} from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/reset-password', validateResetPassword, resetPassword);
router.post('/change-email', protect, validateChangeEmail, changeEmail);
router.post('/change-password', protect, validateChangePassword, changePassword);

if (process.env.NODE_ENV === 'development') {
  router.post('/hash', generateHash);
}

router.get('/verify', protect, verifyToken);

export default router;
