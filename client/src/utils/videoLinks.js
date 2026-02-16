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

export const extractVimeoId = (value) => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const patterns = [
    /vimeo\.com\/(?:video\/)?([0-9]{6,})/,
    /player\.vimeo\.com\/video\/([0-9]{6,})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('vimeo.com')) {
      const segments = url.pathname.split('/').filter(Boolean);
      const numericSegment = segments.reverse().find((segment) => /^[0-9]{6,}$/.test(segment));
      if (numericSegment) return numericSegment;
    }
  } catch {
    return null;
  }

  return null;
};

const VIDEO_FILE_EXTENSION_PATTERN = /\.(mp4|webm|ogg|mov|m4v|m3u8)(?:$|[?#])/i;

export const isDirectVideoUrl = (value) => {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith('data:video/')) return true;
  if (VIDEO_FILE_EXTENSION_PATTERN.test(trimmed)) return true;

  try {
    const parsed = new URL(trimmed);
    return VIDEO_FILE_EXTENSION_PATTERN.test(parsed.pathname || '');
  } catch {
    return false;
  }
};

const uniqueUrls = (items) => [...new Set((items || []).filter(Boolean))];

export const parseVideoLink = (value) => {
  if (!value || typeof value !== 'string') return { type: 'unknown', url: '' };
  const trimmed = value.trim();

  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    const embedUrls = uniqueUrls([
      getGoogleDrivePreviewUrl(driveId),
      `https://drive.google.com/uc?export=preview&id=${driveId}`,
      `https://docs.google.com/file/d/${driveId}/preview`,
    ]);

    return {
      type: 'drive',
      id: driveId,
      url: trimmed,
      openUrl: `https://drive.google.com/file/d/${driveId}/view`,
      embedUrl: embedUrls[0] || '',
      embedUrls,
      thumbnailUrl: getGoogleDriveThumbnailUrl(driveId, 1280),
      label: 'Google Drive',
    };
  }

  const youtubeId = extractYouTubeId(trimmed);
  if (youtubeId) {
    const embedUrls = uniqueUrls([
      `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`,
      `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`,
    ]);

    return {
      type: 'youtube',
      id: youtubeId,
      url: trimmed,
      openUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      embedUrl: embedUrls[0] || '',
      embedUrls,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      label: 'YouTube',
    };
  }

  const vimeoId = extractVimeoId(trimmed);
  if (vimeoId) {
    const embedUrls = [`https://player.vimeo.com/video/${vimeoId}?autoplay=1`];
    return {
      type: 'vimeo',
      id: vimeoId,
      url: trimmed,
      openUrl: `https://vimeo.com/${vimeoId}`,
      embedUrl: embedUrls[0],
      embedUrls,
      thumbnailUrl: '',
      label: 'Vimeo',
    };
  }

  if (isDirectVideoUrl(trimmed)) {
    return {
      type: 'direct',
      url: trimmed,
      openUrl: trimmed,
      embedUrl: '',
      embedUrls: [],
      thumbnailUrl: '',
      label: 'Direct video',
    };
  }

  return {
    type: 'unknown',
    url: trimmed,
    openUrl: trimmed,
    embedUrl: '',
    embedUrls: [],
  };
};
