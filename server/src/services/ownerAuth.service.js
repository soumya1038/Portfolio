import bcrypt from 'bcryptjs';
import OwnerAuth from '../models/OwnerAuth.js';
import { ApiError } from '../middleware/error.middleware.js';

const normalizeEmail = (value = '') => String(value).trim().toLowerCase();

const normalizePhone = (value = '') => String(value).replace(/\D/g, '');

const getConfiguredRecoveryPhones = () =>
  [process.env.RECOVERY_PHONE_1, process.env.RECOVERY_PHONE_2]
    .map((phone) => normalizePhone(phone || ''))
    .filter(Boolean);

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const resolveInitialPasswordHash = async () => {
  const ownerPasswordHash = process.env.OWNER_PASSWORD_HASH;
  if (!ownerPasswordHash) {
    throw new ApiError(
      500,
      'Owner authentication is not configured. Set OWNER_PASSWORD_HASH for initial setup.'
    );
  }

  if (ownerPasswordHash.startsWith('$2a$') || ownerPasswordHash.startsWith('$2b$')) {
    return ownerPasswordHash;
  }

  return hashPassword(ownerPasswordHash);
};

export const getOwnerAuth = async () => {
  let ownerAuth = await OwnerAuth.findOne();
  if (ownerAuth) return ownerAuth;

  const ownerEmail = normalizeEmail(process.env.OWNER_EMAIL || '');
  if (!ownerEmail) {
    throw new ApiError(
      500,
      'Owner authentication is not configured. Set OWNER_EMAIL for initial setup.'
    );
  }

  const passwordHash = await resolveInitialPasswordHash();
  ownerAuth = await OwnerAuth.create({
    email: ownerEmail,
    passwordHash,
    sessionVersion: 0,
    lastPasswordChangedAt: new Date(),
  });

  return ownerAuth;
};

export const verifyRecoveryPhoneOrThrow = (providedPhone) => {
  const configuredPhones = getConfiguredRecoveryPhones();
  if (configuredPhones.length === 0) {
    throw new ApiError(
      500,
      'Recovery phone numbers are not configured. Set RECOVERY_PHONE_1 and RECOVERY_PHONE_2.'
    );
  }

  const normalizedProvidedPhone = normalizePhone(providedPhone || '');
  if (!normalizedProvidedPhone || !configuredPhones.includes(normalizedProvidedPhone)) {
    throw new ApiError(401, 'Recovery phone verification failed');
  }
};

export const normalizeLoginEmail = normalizeEmail;

export const hashOwnerPassword = hashPassword;
