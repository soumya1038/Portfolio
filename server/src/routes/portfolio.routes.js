import express from 'express';
import {
  getPortfolio,
  updatePortfolio,
  addSkill,
  removeSkill,
} from '../controllers/portfolio.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validatePortfolio, validateId } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', getPortfolio);

router.put('/', protect, validatePortfolio, updatePortfolio);
router.post('/skills', protect, addSkill);
router.delete('/skills/:skillId', protect, validateId, removeSkill);

export default router;
