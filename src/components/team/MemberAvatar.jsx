'use client';

import React, { useState } from 'react';

/**
 * Displays a user avatar.
 */
const MemberAvatar = ({
  photoURL,
  initials,
  name,
  size = 36,
  role,
}) => {
  const [hasError, setHasError] = useState(false);

  const borderColor = role === 'Admin' ? 'var(--primary)' : 'var(--border)';
  const borderWidth = role === 'Admin' ? '2px' : '1px';

  const containerStyle = {
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
        backgroundColor: stringToColor(name || 'User'),
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

const AVATAR_COLORS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#06b6d4',
  '#8b5cf6',
  '#ef4444',
  '#84cc16',
  '#ec4899',
];

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export default MemberAvatar;
