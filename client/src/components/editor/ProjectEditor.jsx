import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiSave, FiX, FiPlus, FiGithub, FiMove, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ImageUploader from './ImageUploader';
import { projectService } from '../../services/project.service';
import { githubService } from '../../services/github.service';
import { uploadService } from '../../services/upload.service';
import DemoVideoPlayer from '../common/DemoVideoPlayer';

function ProjectEditor({ project, onClose }) {
  const isEditing = !!project;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    techStack: project?.techStack || [],
    images: project?.images || [],
    demoVideos: project?.demoVideos?.length
      ? project.demoVideos
      : project?.demoVideoUrl
        ? [project.demoVideoUrl]
        : [],
    githubUrl: project?.githubUrl || '',
    liveUrl: project?.liveUrl || '',
    source: project?.source || 'manual',
    featured: project?.featured || false,
    githubMeta: project?.githubMeta || {},
  });

  const [newTech, setNewTech] = useState('');
  const [githubImportUrl, setGithubImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [dragState, setDragState] = useState({ type: null, index: null });

  const createMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create project');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => projectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update project');
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTech = () => {
    if (!newTech.trim()) return;
    if (formData.techStack.includes(newTech.trim())) {
      toast.error('Technology already added');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      techStack: [...prev.techStack, newTech.trim()],
    }));
    setNewTech('');
  };

  const handleRemoveTech = (tech) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tech),
    }));
  };

  const handleImageChange = (url, index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      if (url) {
        newImages[index] = url;
      } else {
        newImages.splice(index, 1);
      }
      return { ...prev, images: newImages };
    });
  };

  const handleVideoChange = (url, index) => {
    setFormData((prev) => {
      const newVideos = [...prev.demoVideos];
      if (url !== undefined) {
        newVideos[index] = url;
      }
      return { ...prev, demoVideos: newVideos };
    });
  };

  const handleAddImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  const handleAddVideo = () => {
    setFormData((prev) => ({
      ...prev,
      demoVideos: [...(prev.demoVideos || []), ''],
    }));
  };

  const handleRemoveVideo = (index) => {
    setFormData((prev) => ({
      ...prev,
      demoVideos: prev.demoVideos.filter((_, i) => i !== index),
    }));
  };

  const handleGitHubImport = async () => {
    if (!githubImportUrl.trim()) {
      toast.error('Please enter a GitHub URL');
      return;
    }

    setIsImporting(true);

    try {
      const repoData = await githubService.importRepo(githubImportUrl);
      
      setFormData((prev) => ({
        ...prev,
        title: repoData.title || prev.title,
        description: repoData.description || prev.description,
        techStack: repoData.techStack?.length > 0 ? repoData.techStack : prev.techStack,
        githubUrl: repoData.githubUrl || prev.githubUrl,
        liveUrl: repoData.liveUrl || prev.liveUrl,
        source: 'github',
        githubMeta: repoData.githubMeta || {},
      }));

      toast.success('Repository imported successfully');
      setGithubImportUrl('');
    } catch (error) {
      toast.error(error.message || 'Failed to import repository');
    } finally {
      setIsImporting(false);
    }
  };

  const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:');

  const uploadIfNeeded = async (value) => {
    if (!value) return '';
    if (isDataUrl(value)) {
      const result = await uploadService.uploadImage(value);
      return result;
    }
    return { url: value, publicId: null };
  };

  const moveItem = (list, fromIndex, toIndex) => {
    const updated = [...list];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    return updated;
  };

  const handleDragStart = (type, index) => (event) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', `${type}:${index}`);
    setDragState({ type, index });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (type, index) => (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    if (!data) return;
    const [dragType, dragIndexRaw] = data.split(':');
    if (dragType !== type) return;
    const dragIndex = Number(dragIndexRaw);
    if (Number.isNaN(dragIndex) || dragIndex === index) return;

    if (type === 'image') {
      setFormData((prev) => ({
        ...prev,
        images: moveItem(prev.images, dragIndex, index),
      }));
    }

    if (type === 'video') {
      setFormData((prev) => ({
        ...prev,
        demoVideos: moveItem(prev.demoVideos, dragIndex, index),
      }));
    }

    setDragState({ type: null, index: null });
  };

  const handleDragEnd = () => {
    setDragState({ type: null, index: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Project title is required');
      return;
    }

    // Filter out empty image URLs
    const cleanedImages = formData.images.filter((img) => img && img.trim());
    const cleanedVideos = (formData.demoVideos || [])
      .map((item) => (item ? item.trim() : ''))
      .filter(Boolean);

    try {
      setIsUploadingImages(true);
      const uploadedImages = await Promise.all(cleanedImages.map(uploadIfNeeded));
      const uploadedUrls = uploadedImages.map((img) => img.url);
      const uploadedPublicIds = uploadedImages
        .map((img) => img.publicId)
        .filter(Boolean);
      const cleanedData = {
        ...formData,
        images: uploadedUrls,
        demoVideos: cleanedVideos,
      };

      try {
        if (isEditing) {
          await updateMutation.mutateAsync({ id: project._id, data: cleanedData });
        } else {
          await createMutation.mutateAsync(cleanedData);
        }
      } catch (error) {
        if (uploadedPublicIds.length > 0) {
          await Promise.all(
            uploadedPublicIds.map(async (publicId) => {
              try {
                await uploadService.deleteImage(publicId);
              } catch (cleanupError) {
                console.warn('Image cleanup failed:', cleanupError);
              }
            })
          );
        }
        throw error;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isUploadingImages;

  return (
    <div className="neo-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="section-kicker">Projects</p>
          <h2 className="text-2xl font-bold text-ink">
          {isEditing ? 'Edit Project' : 'Add New Project'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {/* GitHub Import Section */}
      {!isEditing && (
        <div className="mb-6 p-4 bg-white/70 border border-line rounded-2xl">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FiGithub className="h-4 w-4" />
            Import from GitHub
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={githubImportUrl}
              onChange={(e) => setGithubImportUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={handleGitHubImport}
              disabled={isImporting}
              className="btn-secondary"
            >
              {isImporting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              ) : (
                'Import'
              )}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Describe your project..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Live Demo URL
            </label>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://myproject.com"
            />
          </div>

        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tech Stack
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
              className="input-field flex-1"
              placeholder="e.g., React, Node.js"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="btn-secondary flex items-center gap-1"
            >
              <FiPlus className="h-4 w-4" />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="ml-1 text-gray-400 hover:text-red-500"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Drag images left or right to set the cover image (first position).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((img, index) => (
              <div
                key={`${img}-${index}`}
                draggable
                onDragStart={handleDragStart('image', index)}
                onDragOver={handleDragOver}
                onDrop={handleDrop('image', index)}
                onDragEnd={handleDragEnd}
                className={`relative rounded-2xl border border-line bg-white/70 p-3 ${
                  dragState.type === 'image' && dragState.index === index ? 'ring-2 ring-primary-400/60 opacity-80' : ''
                }`}
              >
                <div className="absolute -top-2 -left-2 bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full border border-line flex items-center gap-1">
                  <FiMove className="h-3 w-3" />
                  {index === 0 ? 'Cover' : `Image ${index + 1}`}
                </div>
                <ImageUploader
                  value={img}
                  onChange={(url) => handleImageChange(url, index)}
                  label=""
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <FiPlus className="h-8 w-8 mb-1" />
              <span className="text-xs">Add Image</span>
            </button>
          </div>
        </div>

        {/* Demo Videos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Demo Videos
          </label>
          <p className="text-xs text-gray-500 mb-4">
            Add Google Drive or YouTube links. Drag to reorder.
          </p>
          <div className="space-y-4">
            {formData.demoVideos.map((video, index) => (
              <div
                key={`${video}-${index}`}
                draggable
                onDragStart={handleDragStart('video', index)}
                onDragOver={handleDragOver}
                onDrop={handleDrop('video', index)}
                onDragEnd={handleDragEnd}
                className={`rounded-2xl border border-line bg-white/70 p-4 ${
                  dragState.type === 'video' && dragState.index === index ? 'ring-2 ring-primary-400/60 opacity-80' : ''
                }`}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex-1 min-w-[220px]">
                    <label className="text-xs font-semibold text-gray-600 flex items-center gap-2 mb-2">
                      <FiMove className="h-3 w-3" />
                      Video {index + 1}
                    </label>
                    <input
                      type="url"
                      value={video}
                      onChange={(e) => handleVideoChange(e.target.value, index)}
                      placeholder="https://drive.google.com/file/d/... or https://youtube.com/watch?v=..."
                      className="input-field"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                    title="Remove video"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
                {video && (
                  <div className="mt-4">
                    <DemoVideoPlayer
                      videoUrl={video}
                      title={`Demo video ${index + 1}`}
                      heightClass="h-40"
                      showHelper={false}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddVideo}
            className="btn-secondary mt-4 flex items-center gap-2"
          >
            <FiPlus className="h-4 w-4" />
            Add Video
          </button>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Featured project (shown prominently on portfolio)
          </label>
        </div>

        {/* GitHub Meta (if imported) */}
        {formData.source === 'github' && formData.githubMeta && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiGithub className="h-4 w-4" />
              GitHub Repository Info
            </h4>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-2 rounded text-center">
                <div className="text-lg font-bold text-gray-900">{formData.githubMeta.stars || 0}</div>
                <div className="text-xs text-gray-500">Stars</div>
              </div>
              <div className="bg-white p-2 rounded text-center">
                <div className="text-lg font-bold text-gray-900">{formData.githubMeta.forks || 0}</div>
                <div className="text-xs text-gray-500">Forks</div>
              </div>
              <div className="bg-white p-2 rounded text-center">
                <div className="text-lg font-bold text-gray-900">{formData.githubMeta.watchers || 0}</div>
                <div className="text-xs text-gray-500">Watchers</div>
              </div>
              <div className="bg-white p-2 rounded text-center">
                <div className="text-lg font-bold text-gray-900">{formData.githubMeta.openIssues || 0}</div>
                <div className="text-xs text-gray-500">Issues</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              {formData.githubMeta.language && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  {formData.githubMeta.language}
                </span>
              )}
              {formData.githubMeta.license && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                  {formData.githubMeta.license}
                </span>
              )}
              {formData.githubMeta.defaultBranch && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  Branch: {formData.githubMeta.defaultBranch}
                </span>
              )}
            </div>

            {/* Topics */}
            {formData.githubMeta.topics?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.githubMeta.topics.map((topic) => (
                  <span key={topic} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FiSave className="h-5 w-5" />
                {isEditing ? 'Update Project' : 'Create Project'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectEditor;
