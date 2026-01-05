/**
 * Validation utilities for input sanitization
 */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeString(str: string, maxLength = 500): string {
  return str
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Remove potential HTML tags
}

export function validateProjectData(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false;
  
  const project = data as Record<string, unknown>;
  return (
    typeof project.title === 'string' &&
    typeof project.description === 'string' &&
    Array.isArray(project.technologies)
  );
}
