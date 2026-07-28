import type { GoogleTokenPayload, AuthUser } from '../types/user';
import { resolveDisplayName, getInitials } from '../utils/formatUserName';
import { validateCompanyEmail } from '../utils/validateCompanyEmail';

/**
 * ─────────────────────────────────────────────────────────────
 * GOOGLE CLIENT ID
 *
 * Replace the value below with your actual Google OAuth 2.0
 * Client ID from Google Cloud Console.
 *
 * Steps:
 *   1. Go to https://console.cloud.google.com/
 *   2. APIs & Services → Credentials
 *   3. Create OAuth 2.0 Client ID (Web Application)
 *   4. Add http://localhost:5173 to "Authorized JavaScript origins"
 *   5. Paste the Client ID below.
 * ─────────────────────────────────────────────────────────────
 */
export const GOOGLE_CLIENT_ID = '53885266153-q6f4istflc5601bkqa2q0kponskcodb0.apps.googleusercontent.com';

const SESSION_KEY = 'crm_auth_user_v2';

/**
 * Decodes a Google JWT credential (base64url) without signature verification.
 * Signature is already verified by Google's servers; we only need the payload.
 */
export const decodeGoogleJwt = (credential: string): GoogleTokenPayload => {
  const [, payloadBase64] = credential.split('.');
  // Convert base64url to base64
  const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
  const jsonStr = atob(base64);
  return JSON.parse(jsonStr) as GoogleTokenPayload;
};

/**
 * Validates the decoded token payload against company domain rules.
 *
 * @throws {Error} if email is not from the company domain.
 */
export const validateGooglePayload = (payload: GoogleTokenPayload): void => {
  if (!validateCompanyEmail(payload.email)) {
    throw new Error('Use a valid login credentials.');
  }
};

/**
 * Constructs an `AuthUser` object from the decoded Google token payload.
 */
export const buildAuthUser = (payload: GoogleTokenPayload): AuthUser => {
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
export const saveUserSession = (user: AuthUser): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

/**
 * Retrieves the authenticated user from localStorage.
 * Returns `null` if no valid session exists.
 */
export const loadUserSession = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

/**
 * Clears the authenticated user session from localStorage.
 */
export const clearUserSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

/**
 * Temporary mock login for development purposes.
 * Bypasses the Google JWT flow to instantly log in a specific user.
 */
export const simulateDevLogin = (email: string): AuthUser => {
  const name = resolveDisplayName(undefined, email);
  const initials = getInitials(name);
  const prefix = email.split('@')[0].toLowerCase();

  const mockUser: AuthUser = {
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
