export const isDataUrl = (value) =>
  typeof value === 'string' && value.startsWith('data:');

export const isPdfAsset = (value) => {
  if (!value || typeof value !== 'string') return false;
  const target = value.trim().toLowerCase();
  return (
    target.startsWith('data:application/pdf') ||
    target.includes('/raw/upload/') ||
    target.includes('format=pdf') ||
    /\.pdf(?:$|[?#])/.test(target)
  );
};

export const isImageAsset = (value) => Boolean(value) && !isPdfAsset(value);

export const getFileLabelFromUrl = (value, fallback = 'Document') => {
  if (!value || typeof value !== 'string') return fallback;

  try {
    const parsed = new URL(value);
    const rawName = parsed.pathname.split('/').filter(Boolean).pop();
    if (!rawName) return fallback;
    return decodeURIComponent(rawName);
  } catch {
    return fallback;
  }
};
