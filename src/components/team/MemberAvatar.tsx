import React, { useState } from 'react';

interface MemberAvatarProps {
  /** URL to the profile photo (Google avatar) */
  photoURL?: string;
  /** Initials fallback (e.g. "JD") */
  initials: string;
  /** Display name — used for the img alt attribute */
  name: string;
  /** Size of the avatar in pixels. Defaults to 36. */
  size?: number;
  /** Role badge: 'Admin' renders a gold ring, 'User' / 'Customer' renders a subtle border */
  role?: 'Admin' | 'User' | 'Customer' | string;
}

/**
 * Displays a user avatar.
 * Shows the Google profile photo when available,
 * otherwise renders a colored circle with initials.
 */
const MemberAvatar: React.FC<MemberAvatarProps> = ({
  photoURL,
  initials,
  name,
  size = 36,
  role,
}) => {
  const [hasError, setHasError] = useState(false);

  const borderColor =
    role === 'Admin' ? 'var(--primary)' : 'var(--border)';
  const borderWidth = role === 'Admin' ? '2px' : '1px';

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    border: `${borderWidth} solid ${borderColor}`,
    overflow: 'hidden',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: role === 'Admin' ? 'var(--shadow-primary)' : 'none',
  };

  if (photoURL && !hasError) {
    return (
      <div style={containerStyle}>
        <img
          src={photoURL}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        ...containerStyle,
        backgroundColor: stringToColor(name),
        color: '#fff',
        fontSize: `${Math.round(size * 0.38)}px`,
        fontWeight: 700,
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.02em',
      }}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
};

/**
 * Deterministically maps a name string to a color from the design palette.
 * Ensures consistent avatar colors per user across sessions.
 */
const AVATAR_COLORS = [
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#ef4444', // red
  '#84cc16', // lime
  '#ec4899', // pink
];

const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export default MemberAvatar;
