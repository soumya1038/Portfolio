import { extractGoogleDriveId, getGoogleDrivePreviewUrl, getGoogleDriveThumbnailUrl } from './googleDrive';

export const extractYouTubeId = (value) => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{6,})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtube.com')) {
      const id = url.searchParams.get('v');
      if (id) return id;
    }
  } catch {
    return null;
  }

  return null;
};

export const parseVideoLink = (value) => {
  if (!value) return { type: 'unknown', url: '' };

  const driveId = extractGoogleDriveId(value);
  if (driveId) {
    return {
      type: 'drive',
      id: driveId,
      url: value,
      embedUrl: getGoogleDrivePreviewUrl(driveId),
      thumbnailUrl: getGoogleDriveThumbnailUrl(driveId, 1280),
      label: 'Google Drive',
    };
  }

  const youtubeId = extractYouTubeId(value);
  if (youtubeId) {
    return {
      type: 'youtube',
      id: youtubeId,
      url: value,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      label: 'YouTube',
    };
  }

  return {
    type: 'unknown',
    url: value,
  };
};
