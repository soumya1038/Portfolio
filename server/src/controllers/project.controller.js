import Project from '../models/Project.js';
import { ApiError } from '../middleware/error.middleware.js';
import { deleteImagesByUrl } from '../services/cloudinary.service.js';
import { withImageRollback } from '../middleware/upload.middleware.js';

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req, res, next) => {
  try {
    const { featured } = req.query;
    
    let query = {};
    if (featured === 'true') {
      query.featured = true;
    }

    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to sanitize githubMeta object
 * Removes undefined values and ensures proper structure
 */
const sanitizeGithubMeta = (meta) => {
  if (!meta || typeof meta !== 'object') return {};
  
  const sanitized = { ...meta };
  
  if (sanitized.owner === undefined || sanitized.owner === null) {
    delete sanitized.owner;
  } else if (typeof sanitized.owner === 'object') {
    sanitized.owner = {
      login: sanitized.owner.login || '',
      avatarUrl: sanitized.owner.avatarUrl || '',
      type: sanitized.owner.type || 'User',
    };
  }
  
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === undefined) {
      delete sanitized[key];
    }
  });
  
  return sanitized;
};

/**
 * @desc    Create new project
 * @route   POST /api/projects
 * @access  Protected
 */
export const createProject = withImageRollback(async (req, res, next) => {
  try {
    const {
      title,
      description,
      techStack,
      images,
      demoVideoUrl,
      demoVideos,
      githubUrl,
      liveUrl,
      source,
      featured,
      githubMeta,
    } = req.body;

    if (!title) {
      throw new ApiError(400, 'Project title is required');
    }

    const projectImages = images || [];
    projectImages.forEach(img => req.trackImage(img));

    const normalizedDemoVideos = Array.isArray(demoVideos)
      ? demoVideos.filter((item) => item && String(item).trim())
      : [];

    if (normalizedDemoVideos.length === 0 && demoVideoUrl) {
      normalizedDemoVideos.push(demoVideoUrl);
    }

    const project = await Project.create({
      title,
      description,
      techStack: techStack || [],
      images: images || [],
      demoVideoUrl: normalizedDemoVideos[0] || demoVideoUrl || '',
      demoVideos: normalizedDemoVideos,
      githubUrl,
      liveUrl,
      source: source || 'manual',
      featured: featured || false,
      githubMeta: sanitizeGithubMeta(githubMeta),
    });

    req.clearTrackedImages();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Protected
 */
export const updateProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      techStack,
      images,
      demoVideoUrl,
      demoVideos,
      githubUrl,
      liveUrl,
      source,
      featured,
      order,
      githubMeta,
    } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    let removedImages = [];

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (techStack !== undefined) project.techStack = techStack;
    if (images !== undefined) {
      removedImages = (project.images || []).filter(
        (img) => !images.includes(img)
      );
      project.images = images;
    }
    if (demoVideos !== undefined) {
      const normalizedDemoVideos = Array.isArray(demoVideos)
        ? demoVideos.filter((item) => item && String(item).trim())
        : [];
      project.demoVideos = normalizedDemoVideos;
      project.demoVideoUrl = normalizedDemoVideos[0] || project.demoVideoUrl || '';
    }
    if (demoVideoUrl !== undefined) {
      project.demoVideoUrl = demoVideoUrl;
      if (!project.demoVideos || project.demoVideos.length === 0) {
        project.demoVideos = demoVideoUrl ? [demoVideoUrl] : [];
      }
    }
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (source !== undefined) project.source = source;
    if (featured !== undefined) project.featured = featured;
    if (order !== undefined) project.order = order;
    if (githubMeta !== undefined) {
      const existingMeta = project.githubMeta?.toObject ? project.githubMeta.toObject() : (project.githubMeta || {});
      const sanitizedNewMeta = sanitizeGithubMeta(githubMeta);
      project.githubMeta = { ...existingMeta, ...sanitizedNewMeta };
    }

    await project.save();
    if (removedImages.length > 0) {
      await deleteImagesByUrl(removedImages);
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Protected
 */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    const imagesToDelete = project.images || [];
    await project.deleteOne();
    await deleteImagesByUrl(imagesToDelete);

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reorder projects
 * @route   PUT /api/projects/reorder
 * @access  Protected
 */
export const reorderProjects = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;

    if (!orderedIds || !Array.isArray(orderedIds)) {
      throw new ApiError(400, 'orderedIds array is required');
    }

    const updates = orderedIds.map((id, index) =>
      Project.findByIdAndUpdate(id, { order: index + 1 })
    );

    await Promise.all(updates);

    const projects = await Project.find().sort({ order: 1 });

    res.json({
      success: true,
      message: 'Projects reordered successfully',
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};
