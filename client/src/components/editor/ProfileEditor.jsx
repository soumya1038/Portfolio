import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FiEdit2,
  FiSave,
  FiPlus,
  FiX,
  FiShield,
  FiMail,
  FiLock,
  FiRefreshCcw,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ImageUploader from './ImageUploader';
import { portfolioService } from '../../services/portfolio.service';
import { uploadService } from '../../services/upload.service';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth';

const skillCategories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Other'];

const buildProfileFormData = (data) => ({
  name: data?.name || '',
  title: data?.title || '',
  availabilityTag: data?.availabilityTag || 'Open to work',
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

function ProfileEditor({ portfolio }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(() => buildProfileFormData(portfolio));
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Other' });

  const [changeEmailData, setChangeEmailData] = useState({
    newEmail: '',
    currentPassword: '',
    recoveryPhone: '',
  });
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    recoveryPhone: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [resetPasswordData, setResetPasswordData] = useState({
    email: user?.email || '',
    recoveryPhone: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSecuritySuccess = (message) => {
    toast.success(message || 'Security update complete. Please log in again.');
    logout();
    navigate('/login', { replace: true });
  };

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

  const changeEmailMutation = useMutation({
    mutationFn: authService.changeEmail,
    onSuccess: (response) => {
      handleSecuritySuccess(response?.message);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to change login email');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: (response) => {
      handleSecuritySuccess(response?.message);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: (response) => {
      handleSecuritySuccess(response?.message);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });

  useEffect(() => {
    if (!isEditing) {
      setFormData(buildProfileFormData(portfolio));
    }
  }, [portfolio, isEditing]);

  useEffect(() => {
    setResetPasswordData((prev) => ({
      ...prev,
      email: user?.email || prev.email || '',
    }));
  }, [user?.email]);

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
      (skill) => skill.name.toLowerCase() === newSkill.name.toLowerCase()
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
      skills: prev.skills.filter((_, itemIndex) => itemIndex !== index),
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
    setFormData(buildProfileFormData(portfolio));
  };

  const handleChangeEmailSubmit = (e) => {
    e.preventDefault();
    if (!changeEmailData.newEmail || !changeEmailData.currentPassword || !changeEmailData.recoveryPhone) {
      toast.error('All fields are required for login email update');
      return;
    }

    changeEmailMutation.mutate(changeEmailData);
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (
      !changePasswordData.currentPassword ||
      !changePasswordData.recoveryPhone ||
      !changePasswordData.newPassword ||
      !changePasswordData.confirmPassword
    ) {
      toast.error('All fields are required for password update');
      return;
    }

    if (changePasswordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: changePasswordData.currentPassword,
      recoveryPhone: changePasswordData.recoveryPhone,
      newPassword: changePasswordData.newPassword,
    });
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (
      !resetPasswordData.email ||
      !resetPasswordData.recoveryPhone ||
      !resetPasswordData.newPassword ||
      !resetPasswordData.confirmPassword
    ) {
      toast.error('All fields are required for password reset');
      return;
    }

    if (resetPasswordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    resetPasswordMutation.mutate({
      email: resetPasswordData.email,
      recoveryPhone: resetPasswordData.recoveryPhone,
      newPassword: resetPasswordData.newPassword,
    });
  };

  const profileDetails = useMemo(
    () => ({
      name: formData.name || '--',
      title: formData.title || '--',
      email: formData.email || '--',
      location: formData.location || '--',
      bio: formData.bio || 'No bio provided yet.',
      resumeUrl: formData.resumeUrl,
      availabilityTag: formData.availabilityTag || 'Open to work',
      socialLinks: formData.socialLinks,
      skills: formData.skills || [],
      profileImage: formData.profileImage,
    }),
    [formData]
  );

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
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Availability Tag</span>
                  <p>{profileDetails.availabilityTag}</p>
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
                <p>GitHub: {profileDetails.socialLinks.github || '--'}</p>
                <p>LinkedIn: {profileDetails.socialLinks.linkedin || '--'}</p>
                <p>Twitter: {profileDetails.socialLinks.twitter || '--'}</p>
                <p>Website: {profileDetails.socialLinks.website || '--'}</p>
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
          <ImageUploader
            value={formData.profileImage}
            onChange={(url) => setFormData((prev) => ({ ...prev, profileImage: url }))}
            label="Profile Image"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability Tag</label>
              <input
                type="text"
                name="availabilityTag"
                value={formData.availabilityTag}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Open to work"
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Tell visitors about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume URL</label>
            <input
              type="url"
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/resume.pdf"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
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

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>

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
                {skillCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button type="button" onClick={handleAddSkill} className="btn-secondary flex items-center gap-1">
                <FiPlus className="h-4 w-4" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={`${skill.name}-${index}`}
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

          <div className="flex justify-end pt-4 border-t">
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={handleCancel} className="btn-secondary flex items-center gap-2">
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

      <div className="mt-8 pt-6 border-t border-white/60 space-y-6">
        <div>
          <p className="section-kicker">Owner Security</p>
          <h3 className="text-2xl font-bold text-ink flex items-center gap-2">
            <FiShield className="h-5 w-5" />
            Login Security
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Use one registered recovery phone number for each security action.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <form
            onSubmit={handleChangeEmailSubmit}
            className="rounded-2xl border border-line bg-white/75 p-4 space-y-3"
          >
            <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
              <FiMail className="h-4 w-4" />
              Change Login Email
            </h4>
            <input
              type="email"
              value={changeEmailData.newEmail}
              onChange={(e) =>
                setChangeEmailData((prev) => ({ ...prev, newEmail: e.target.value }))
              }
              placeholder="New login email"
              className="input-field"
              autoComplete="email"
            />
            <input
              type="password"
              value={changeEmailData.currentPassword}
              onChange={(e) =>
                setChangeEmailData((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
              placeholder="Current password"
              className="input-field"
              autoComplete="current-password"
            />
            <input
              type="text"
              value={changeEmailData.recoveryPhone}
              onChange={(e) =>
                setChangeEmailData((prev) => ({ ...prev, recoveryPhone: e.target.value }))
              }
              placeholder="Recovery phone (any one)"
              className="input-field"
            />
            <button
              type="submit"
              disabled={changeEmailMutation.isPending}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {changeEmailMutation.isPending ? 'Updating...' : 'Update Login Email'}
            </button>
          </form>

          <form
            onSubmit={handleChangePasswordSubmit}
            className="rounded-2xl border border-line bg-white/75 p-4 space-y-3"
          >
            <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
              <FiLock className="h-4 w-4" />
              Change Password
            </h4>
            <input
              type="password"
              value={changePasswordData.currentPassword}
              onChange={(e) =>
                setChangePasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
              placeholder="Current password"
              className="input-field"
              autoComplete="current-password"
            />
            <input
              type="text"
              value={changePasswordData.recoveryPhone}
              onChange={(e) =>
                setChangePasswordData((prev) => ({ ...prev, recoveryPhone: e.target.value }))
              }
              placeholder="Recovery phone (any one)"
              className="input-field"
            />
            <input
              type="password"
              value={changePasswordData.newPassword}
              onChange={(e) =>
                setChangePasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
              }
              placeholder="New password (min 8 chars)"
              className="input-field"
              autoComplete="new-password"
            />
            <input
              type="password"
              value={changePasswordData.confirmPassword}
              onChange={(e) =>
                setChangePasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              placeholder="Confirm new password"
              className="input-field"
              autoComplete="new-password"
            />
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <form
            onSubmit={handleResetPasswordSubmit}
            className="rounded-2xl border border-line bg-white/75 p-4 space-y-3"
          >
            <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
              <FiRefreshCcw className="h-4 w-4" />
              Forgot Password Reset
            </h4>
            <input
              type="email"
              value={resetPasswordData.email}
              onChange={(e) =>
                setResetPasswordData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Current login email"
              className="input-field"
              autoComplete="email"
            />
            <input
              type="text"
              value={resetPasswordData.recoveryPhone}
              onChange={(e) =>
                setResetPasswordData((prev) => ({ ...prev, recoveryPhone: e.target.value }))
              }
              placeholder="Recovery phone (any one)"
              className="input-field"
            />
            <input
              type="password"
              value={resetPasswordData.newPassword}
              onChange={(e) =>
                setResetPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
              }
              placeholder="New password (min 8 chars)"
              className="input-field"
              autoComplete="new-password"
            />
            <input
              type="password"
              value={resetPasswordData.confirmPassword}
              onChange={(e) =>
                setResetPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              placeholder="Confirm new password"
              className="input-field"
              autoComplete="new-password"
            />
            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditor;
