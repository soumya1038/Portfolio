const sanitizeMarkdownToText = (value) =>
  value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_~|]/g, '')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const getMarkdownPreview = (value, maxLength = 180) => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  const plainText = sanitizeMarkdownToText(value);
  if (!plainText) {
    return '';
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  if (maxLength <= 3) {
    return plainText.slice(0, maxLength);
  }

  return `${plainText.slice(0, maxLength - 3).trimEnd()}...`;
};
