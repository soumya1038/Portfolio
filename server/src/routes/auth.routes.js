import express from 'express';
import { login, verifyToken, generateHash } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateLogin } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/login', validateLogin, login);

if (process.env.NODE_ENV === 'development') {
  router.post('/hash', generateHash);
}

router.get('/verify', protect, verifyToken);

export default router;
