import { resolveDisplayName, getInitials } from '../utils/formatUserName.js';
import { validateCompanyEmail } from '../utils/validateCompanyEmail.js';

export const GOOGLE_CLIENT_ID = '53885266153-q6f4istflc5601bkqa2q0kponskcodb0.apps.googleusercontent.com';

const SESSION_KEY = 'crm_auth_user_v2';

/**
 * Decodes a Google JWT credential (base64url) without signature verification.
 */
export const decodeGoogleJwt = (credential) => {
  const [, payloadBase64] = credential.split('.');
  const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
  const jsonStr = atob(base64);
  return JSON.parse(jsonStr);
};

/**
 * Validates the decoded token payload against company domain rules.
 */
export const validateGooglePayload = (payload) => {
  if (!validateCompanyEmail(payload.email)) {
    throw new Error('Use a valid login credentials.');
  }
};

/**
 * Constructs an AuthUser object from the decoded Google token payload.
 */
export const buildAuthUser = (payload) => {
  const name = resolveDisplayName(payload.name, payload.email);
  const initials = getInitials(name);

  return {
    uid: payload.sub,
    name,
    email: payload.email,
    photoURL: payload.picture,
    initials,
    role: 'Admin',
    status: 'Active',
    memberSince: new Date().toISOString(),
    orgName: 'QuickAds',
  };
};

/**
 * Persists the authenticated user to localStorage.
 */
export const saveUserSession = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

/**
 * Retrieves the authenticated user from localStorage.
 */
export const loadUserSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Clears the authenticated user session from localStorage.
 */
export const clearUserSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

/**
 * Temporary mock login for development purposes.
 */
export const simulateDevLogin = (email) => {
  const name = resolveDisplayName(undefined, email);
  const initials = getInitials(name);
  const prefix = email.split('@')[0].toLowerCase();

  const mockUser = {
    uid: `mock_${prefix}`,
    name,
    email,
    photoURL: undefined,
    initials,
    role: 'Admin',
    status: 'Active',
    memberSince: new Date().toISOString(),
    orgName: 'QuickAds',
  };

  saveUserSession(mockUser);
  return mockUser;
};
