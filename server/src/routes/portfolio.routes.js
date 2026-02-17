import express from 'express';
import {
  getPortfolio,
  getEngagementSummary,
  registerVisitor,
  submitRating,
  getOwnerSettings,
  updateOwnerSettings,
  getSuggestions,
  deleteSuggestion,
  clearSuggestions,
  updatePortfolio,
  addSkill,
  removeSkill,
} from '../controllers/portfolio.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validatePortfolio } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', getPortfolio);
router.get('/engagement', getEngagementSummary);
router.post('/engagement/visit', registerVisitor);
router.post('/engagement/rating', submitRating);
router.post('/visit', registerVisitor);
router.post('/rating', submitRating);
router.get('/owner-settings', protect, getOwnerSettings);
router.put('/owner-settings', protect, updateOwnerSettings);

router.put('/', protect, validatePortfolio, updatePortfolio);
router.post('/skills', protect, addSkill);
router.delete('/skills/:skillId', protect, removeSkill);
router.get('/suggestions', protect, getSuggestions);
router.delete('/suggestions', protect, clearSuggestions);
router.delete('/suggestions/:suggestionId', protect, deleteSuggestion);

export default router;
