import express from 'express';
import {
  generateUploadSignature,
  uploadImage,
  deleteImage,
} from '../services/cloudinary.service.js';
import { importGitHubRepo } from '../services/github.service.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All upload routes are protected
router.use(protect);

// Cloudinary routes
router.get('/signature', generateUploadSignature);
router.post('/image', uploadImage);
router.delete('/image', deleteImage);

// GitHub import route
router.post('/github', importGitHubRepo);

export default router;
