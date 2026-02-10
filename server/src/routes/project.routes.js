import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from '../controllers/project.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateProject, validateId } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', validateId, getProject);

router.post('/', protect, validateProject, createProject);
router.put('/reorder', protect, reorderProjects);
router.put('/:id', protect, validateId, validateProject, updateProject);
router.delete('/:id', protect, validateId, deleteProject);

export default router;
