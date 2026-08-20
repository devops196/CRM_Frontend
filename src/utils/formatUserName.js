/**
 * Derives a human-readable full name from an email address when
 * a displayName is not available from the OAuth provider.
 */
export const deriveNameFromEmail = (email) => {
  const localPart = email.split('@')[0];
  return localPart
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

/**
 * Resolves the best display name from a Google profile.
 * Uses `displayName` if available; otherwise derives from email.
 */
export const resolveDisplayName = (displayName, email) => {
  if (displayName && displayName.trim().length > 0) {
    return displayName.trim();
  }
  return deriveNameFromEmail(email);
};

/**
 * Generates initials from a full name string.
 * Uses the first letter of each word (up to 2 characters).
 */
export const getInitials = (name) => {
  return name
    ? name
        .trim()
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')
    : 'U';
};
