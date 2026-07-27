/**
 * Derives a human-readable full name from an email address when
 * a displayName is not available from the OAuth provider.
 *
 * @example
 * deriveNameFromEmail('john.doe@quickads.ai') // 'John Doe'
 * deriveNameFromEmail('alice@quickads.ai')    // 'Alice'
 */
export const deriveNameFromEmail = (email: string): string => {
  const localPart = email.split('@')[0];
  return localPart
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

/**
 * Resolves the best display name from a Google profile.
 * Uses `displayName` if available; otherwise derives from email.
 *
 * @param displayName - The displayName from the Google token payload (may be undefined).
 * @param email - The user's email address used as a fallback.
 * @returns A formatted display name string.
 */
export const resolveDisplayName = (
  displayName: string | undefined,
  email: string
): string => {
  if (displayName && displayName.trim().length > 0) {
    return displayName.trim();
  }
  return deriveNameFromEmail(email);
};

/**
 * Generates initials from a full name string.
 * Uses the first letter of each word (up to 2 characters).
 *
 * @example
 * getInitials('John Doe')   // 'JD'
 * getInitials('Alice')      // 'A'
 */
export const getInitials = (name: string): string => {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
};
