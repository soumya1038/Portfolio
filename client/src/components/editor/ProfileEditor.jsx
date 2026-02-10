import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiSave, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ImageUploader from './ImageUploader';
import { portfolioService } from '../../services/portfolio.service';
import { uploadService } from '../../services/upload.service';

const skillCategories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Other'];

function ProfileEditor({ portfolio }) {
  const queryClient = useQueryClient();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const buildFormData = (data) => ({
    name: data?.name || '',
    title: data?.title || '',
    bio: data?.bio || '',
    profileImage: data?.profileImage || '',
    email: data?.email || '',
    location: data?.location || '',
    socialLinks: {
      github: data?.socialLinks?.github || '',
      linkedin: data?.socialLinks?.linkedin || '',
      twitter: data?.socialLinks?.twitter || '',
      website: data?.socialLinks?.website || '',
    },
    skills: data?.skills || [],
    resumeUrl: data?.resumeUrl || '',
  });

  const [formData, setFormData] = useState(() => buildFormData(portfolio));

  const [newSkill, setNewSkill] = useState({ name: '', category: 'Other' });

  const updateMutation = useMutation({
    mutationFn: portfolioService.updatePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  useEffect(() => {
    if (!isEditing) {
      setFormData(buildFormData(portfolio));
    }
  }, [portfolio, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    const exists = formData.skills.some(
      (s) => s.name.toLowerCase() === newSkill.name.toLowerCase()
    );

    if (exists) {
      toast.error('Skill already exists');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { ...newSkill }],
    }));
    setNewSkill({ name: '', category: 'Other' });
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploadingImage(true);
      let profileImage = formData.profileImage;
      if (isDataUrl(profileImage)) {
        const result = await uploadService.uploadImage(profileImage);
        profileImage = result.url;
      }
      updateMutation.mutate({ ...formData, profileImage });
    } catch (error) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(buildFormData(portfolio));
  };

  const profileDetails = useMemo(() => {
    return {
      name: formData.name || '—',
      title: formData.title || '—',
      email: formData.email || '—',
      location: formData.location || '—',
      bio: formData.bio || 'No bio provided yet.',
      resumeUrl: formData.resumeUrl,
      socialLinks: formData.socialLinks,
      skills: formData.skills || [],
      profileImage: formData.profileImage,
    };
  }, [formData]);

  return (
    <div className="neo-panel p-6">
      <p className="section-kicker">Profile</p>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-ink">Profile Details</h2>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiEdit2 className="h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border border-line bg-white/80 flex items-center justify-center">
              {profileDetails.profileImage ? (
                <img
                  src={profileDetails.profileImage}
                  alt={profileDetails.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400 uppercase tracking-[0.3em]">No Image</span>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-semibold text-ink">{profileDetails.name}</h3>
                <p className="text-sm text-gray-500">{profileDetails.title}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Email</span>
                  <p>{profileDetails.email}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Location</span>
                  <p>{profileDetails.location}</p>
                </div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Bio</span>
                <p className="text-sm text-gray-600 mt-2">{profileDetails.bio}</p>
              </div>
              {profileDetails.resumeUrl && (
                <a
                  href={profileDetails.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700"
                >
                  View Resume
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Social Links</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>GitHub: {profileDetails.socialLinks.github || '—'}</p>
                <p>LinkedIn: {profileDetails.socialLinks.linkedin || '—'}</p>
                <p>Twitter: {profileDetails.socialLinks.twitter || '—'}</p>
                <p>Website: {profileDetails.socialLinks.website || '—'}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Skills</h4>
              {profileDetails.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileDetails.skills.map((skill, index) => (
                    <span
                      key={`${skill.name}-${index}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded-full border border-line"
                    >
                      {skill.name}
                      <span className="text-xs text-gray-500">({skill.category})</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills added yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <ImageUploader
          value={formData.profileImage}
          onChange={(url) => setFormData((prev) => ({ ...prev, profileImage: url }))}
          label="Profile Image"
        />

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Full Stack Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., New York, USA"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="input-field"
            placeholder="Tell visitors about yourself..."
          />
        </div>

        {/* Resume URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume URL
          </label>
          <input
            type="url"
            name="resumeUrl"
            value={formData.resumeUrl}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/resume.pdf"
          />
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub
              </label>
              <input
                type="url"
                name="github"
                value={formData.socialLinks.github}
                onChange={handleSocialChange}
                className="input-field"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleSocialChange}
                className="input-field"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.socialLinks.twitter}
                onChange={handleSocialChange}
                className="input-field"
                placeholder="https://twitter.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.socialLinks.website}
                onChange={handleSocialChange}
                className="input-field"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
          
          {/* Add Skill Form */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill((prev) => ({ ...prev, name: e.target.value }))}
              className="input-field flex-1"
              placeholder="Skill name"
            />
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill((prev) => ({ ...prev, category: e.target.value }))}
              className="input-field w-40"
            >
              {skillCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddSkill}
              className="btn-secondary flex items-center gap-1"
            >
              <FiPlus className="h-4 w-4" />
              Add
            </button>
          </div>

          {/* Skills List */}
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded-full border border-line"
              >
                {skill.name}
                <span className="text-xs text-gray-500">({skill.category})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-1 text-gray-400 hover:text-red-500"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary flex items-center gap-2"
            >
              <FiX className="h-5 w-5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending || isUploadingImage}
              className="btn-primary flex items-center gap-2"
            >
              {updateMutation.isPending || isUploadingImage ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FiSave className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      )}
    </div>
  );
}

export default ProfileEditor;
