/**
 * Represents the raw credential data returned by Google Identity Services.
 */
export interface GoogleCredential {
  /** The JWT credential string from Google */
  credential: string;
  /** The client_id used to request the credential */
  clientId: string;
}

/**
 * Decoded payload from the Google JWT credential.
 */
export interface GoogleTokenPayload {
  /** Unique Google user ID */
  sub: string;
  /** User's email address */
  email: string;
  /** Whether the email has been verified by Google */
  email_verified: boolean;
  /** User's full display name */
  name?: string;
  /** URL to the user's Google profile picture */
  picture?: string;
  /** User's given (first) name */
  given_name?: string;
  /** User's family (last) name */
  family_name?: string;
  /** Token issue time */
  iat: number;
  /** Token expiration time */
  exp: number;
}

/**
 * The authenticated user stored in our application context and localStorage.
 */
export interface AuthUser {
  /** Google unique ID (sub claim) */
  uid: string;
  /** User's full name (from Google displayName or derived from email) */
  name: string;
  /** User's email address */
  email: string;
  /** URL to Google profile picture (may be undefined if not available) */
  photoURL?: string;
  /** Initials derived from name, used as avatar fallback */
  initials: string;
  /** Role in the CRM — always 'Admin' for authenticated users */
  role: 'Admin' | 'User';
  /** Account status */
  status: 'Active' | 'Pending';
  /** ISO timestamp of when the user first authenticated */
  memberSince: string;
  /** Organisation name displayed in the header */
  orgName: string;
}
