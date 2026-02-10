import express from 'express';
import authRoutes from './auth.routes.js';
import portfolioRoutes from './portfolio.routes.js';
import projectRoutes from './project.routes.js';
import achievementRoutes from './achievement.routes.js';
import uploadRoutes from './upload.routes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/projects', projectRoutes);
router.use('/achievements', achievementRoutes);
router.use('/upload', uploadRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Portfolio API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      portfolio: '/api/portfolio',
      projects: '/api/projects',
      achievements: '/api/achievements',
      upload: '/api/upload',
    },
  });
});

export default router;
