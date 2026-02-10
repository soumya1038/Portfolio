import express from 'express';
import {
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievement.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateAchievement, validateId } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', getAchievements);
router.get('/:id', validateId, getAchievement);

router.post('/', protect, validateAchievement, createAchievement);
router.put('/:id', protect, validateId, validateAchievement, updateAchievement);
router.delete('/:id', protect, validateId, deleteAchievement);

export default router;
