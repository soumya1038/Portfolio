/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
  if (!url) return true; // Empty is valid (optional)
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate GitHub URL format
 */
export const isValidGitHubUrl = (url) => {
  if (!url) return false;
  const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
  return githubRegex.test(url);
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate max length
 */
export const maxLength = (value, max) => {
  if (!value) return true;
  return value.length <= max;
};

/**
 * Portfolio validation
 */
export const validatePortfolio = (data) => {
  const errors = {};

  if (!isRequired(data.name)) {
    errors.name = 'Name is required';
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!maxLength(data.bio, 1000)) {
    errors.bio = 'Bio must be less than 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Project validation
 */
export const validateProject = (data) => {
  const errors = {};

  if (!isRequired(data.title)) {
    errors.title = 'Title is required';
  }

  if (data.githubUrl && !isValidUrl(data.githubUrl)) {
    errors.githubUrl = 'Invalid GitHub URL';
  }

  if (data.liveUrl && !isValidUrl(data.liveUrl)) {
    errors.liveUrl = 'Invalid Live URL';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
