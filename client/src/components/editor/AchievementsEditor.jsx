import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiSave, FiPlus, FiTrash2, FiEdit2, FiX, FiExternalLink, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ImageUploader from './ImageUploader';
import { achievementService } from '../../services/achievement.service';
import { uploadService } from '../../services/upload.service';

const emptyAchievement = {
  title: '',
  issuer: '',
  date: '',
  description: '',
  credentialUrl: '',
  imageUrl: '',
};

function AchievementsEditor({ achievements: incomingAchievements = [] }) {
  const queryClient = useQueryClient();
  const formRef = useRef(null);
  const [achievements, setAchievements] = useState(incomingAchievements || []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyAchievement);
  const [editingId, setEditingId] = useState(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  useEffect(() => {
    setAchievements(incomingAchievements || []);
  }, [incomingAchievements]);

  const sortedAchievements = useMemo(() => {
    return [...(achievements || [])].sort((a, b) => {
      const aTime = new Date(a.date || a.createdAt || 0).getTime() || 0;
      const bTime = new Date(b.date || b.createdAt || 0).getTime() || 0;
      return bTime - aTime;
    });
  }, [achievements]);

  const createMutation = useMutation({
    mutationFn: achievementService.createAchievement,
    onSuccess: (response) => {
      if (response?.data) {
        queryClient.setQueryData(['achievements'], (old) => {
          const current = old?.data || [];
          const next = [response.data, ...current];
          if (!old) {
            return { success: true, count: next.length, data: next };
          }
          return { ...old, count: next.length, data: next };
        });
      }
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast.success(response?.message || 'Achievement created');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create achievement');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => achievementService.updateAchievement(id, data),
    onSuccess: (response) => {
      if (response?.data) {
        queryClient.setQueryData(['achievements'], (old) => {
          const current = old?.data || [];
          const next = current.map((item) =>
            item._id === response.data._id ? response.data : item
          );
          if (!old) {
            return { success: true, count: next.length, data: next };
          }
          return { ...old, count: next.length, data: next };
        });
      }
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast.success(response?.message || 'Achievement updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update achievement');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: achievementService.deleteAchievement,
    onSuccess: (response, id) => {
      if (id) {
        queryClient.setQueryData(['achievements'], (old) => {
          const current = old?.data || [];
          const next = current.filter((item) => item._id !== id);
          if (!old) {
            return { success: true, count: next.length, data: next };
          }
          return { ...old, count: next.length, data: next };
        });
      }
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast.success(response?.message || 'Achievement deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete achievement');
    },
  });

  const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:');

  const uploadAchievementImage = async (imageUrl) => {
    if (imageUrl && isDataUrl(imageUrl)) {
      const result = await uploadService.uploadImage(imageUrl);
      return { imageUrl: result.url, publicId: result.publicId };
    }
    return { imageUrl, publicId: null };
  };

  const persistAchievement = async (payload) => {
    setIsUploadingImages(true);
    let uploadedPublicId = null;
    try {
      const { imageUrl, publicId } = await uploadAchievementImage(payload.imageUrl);
      uploadedPublicId = publicId;
      const resolved = { ...payload, imageUrl };
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: resolved });
      } else {
        await createMutation.mutateAsync(resolved);
      }
      return true;
    } catch (error) {
      if (uploadedPublicId) {
        try {
          await uploadService.deleteImage(uploadedPublicId);
        } catch (cleanupError) {
          console.warn('Image cleanup failed:', cleanupError);
        }
      }
      toast.error(error.message || 'Failed to save achievement');
      return false;
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Achievement title is required');
      return;
    }

    const payload = {
      ...formData,
      date: formData.date || null,
    };

    const didSave = await persistAchievement(payload);
    if (didSave) {
      setFormData(emptyAchievement);
      setEditingId(null);
      setShowForm(false);
    }
  };

  const handleEdit = (achievement) => {
    setEditingId(achievement._id);
    setShowForm(true);
    setFormData({
      title: achievement.title || '',
      issuer: achievement.issuer || '',
      date: achievement.date ? new Date(achievement.date).toISOString().slice(0, 10) : '',
      description: achievement.description || '',
      credentialUrl: achievement.credentialUrl || '',
      imageUrl: achievement.imageUrl || '',
    });
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleDelete = async (achievement) => {
    if (!achievement?._id) return;
    const confirmed = window.confirm('Are you sure you want to delete this achievement?');
    if (!confirmed) return;
    await deleteMutation.mutateAsync(achievement._id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(emptyAchievement);
    setShowForm(false);
  };

  return (
    <div className="neo-panel p-6 space-y-6">
      <div>
        <p className="section-kicker">Achievements</p>
        <h2 className="text-2xl font-bold text-ink">Certificates & Awards</h2>
        <p className="text-sm text-gray-500 mt-1">Showcase certifications, awards, and recognition.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">
          {editingId ? 'Edit Achievement' : 'Create Achievement'}
        </h3>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus className="h-4 w-4" />
            Add Achievement
          </button>
        )}
      </div>

      {showForm && (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="input-field"
              placeholder="AWS Certified Developer"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issuer</label>
            <input
              type="text"
              value={formData.issuer}
              onChange={(e) => setFormData((prev) => ({ ...prev, issuer: e.target.value }))}
              className="input-field"
              placeholder="Amazon Web Services"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Credential URL</label>
            <input
              type="url"
              value={formData.credentialUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, credentialUrl: e.target.value }))}
              className="input-field"
              placeholder="https://verify.example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="input-field"
            placeholder="What the certification covers..."
          />
        </div>

        <div>
          <ImageUploader
            value={formData.imageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
            label="Certificate Image"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={createMutation.isPending || updateMutation.isPending || isUploadingImages}
          >
            <FiSave className="h-4 w-4" />
            {createMutation.isPending || updateMutation.isPending || isUploadingImages
              ? 'Saving...'
              : editingId
                ? 'Update Achievement'
                : 'Add Achievement'}
          </button>
          {(editingId || showForm) && (
            <button type="button" onClick={handleCancel} className="btn-secondary flex items-center gap-2">
              <FiX className="h-4 w-4" />
              Cancel
            </button>
          )}
        </div>
      </form>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">Existing Achievements</h3>
          <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
            {achievements.length} total
          </span>
        </div>
        {achievements.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-primary-200 rounded-2xl bg-white/70">
            <FiStar className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No achievements yet. Add your first certificate.</p>
          </div>
        ) : (
          sortedAchievements.map((achievement) => {
            const key = achievement._id || achievement.title;
            return (
              <div
                key={key}
                className="border border-white/70 bg-white/80 rounded-2xl p-4 hover:border-primary-200 hover:-translate-y-0.5 hover:shadow-glow transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink">{achievement.title}</h3>
                      {achievement.issuer && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {achievement.issuer}
                        </span>
                      )}
                      {achievement.date && (
                        <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full">
                          {new Date(achievement.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {achievement.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {achievement.description}
                      </p>
                    )}
                    {achievement.credentialUrl && (
                      <a
                        href={achievement.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-primary-700 mt-3"
                      >
                        View Credential
                        <FiExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  {achievement.imageUrl && (
                    <div className="w-full lg:w-44 h-28 rounded-2xl overflow-hidden border border-line flex-shrink-0">
                      <img
                        src={achievement.imageUrl}
                        alt={achievement.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 lg:flex-col lg:items-end">
                    <button
                      type="button"
                      onClick={() => handleEdit(achievement)}
                      className="p-2 text-gray-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(achievement)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AchievementsEditor;
