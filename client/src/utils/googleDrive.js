export const extractGoogleDriveId = (value) => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (!trimmed.includes('/') && !trimmed.includes('?') && !trimmed.startsWith('http')) {
    return trimmed;
  }

  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?export=download&id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  try {
    const url = new URL(trimmed);
    const idParam = url.searchParams.get('id');
    if (idParam) return idParam;

    const parts = url.pathname.split('/').filter(Boolean);
    const dIndex = parts.indexOf('d');
    if (dIndex !== -1 && parts[dIndex + 1]) {
      return parts[dIndex + 1];
    }
  } catch {
    return null;
  }

  return null;
};

export const getGoogleDriveThumbnailUrl = (id, size = 640) => {
  if (!id) return '';
  const normalizedSize = Number.isFinite(size) ? Math.max(200, Math.min(1280, size)) : 640;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${normalizedSize}`;
};

export const getGoogleDrivePreviewUrl = (id) => {
  if (!id) return '';
  return `https://drive.google.com/file/d/${id}/preview`;
};
