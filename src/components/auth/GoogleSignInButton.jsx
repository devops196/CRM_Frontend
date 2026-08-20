'use client';

import React, { useEffect, useRef } from 'react';
import { GOOGLE_CLIENT_ID } from '../../services/auth.service.js';

/**
 * Renders the official Google Identity Services sign-in button.
 */
const GoogleSignInButton = ({ onSuccess, onError }) => {
  const buttonRef = useRef(null);
  const isConfigured = GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID';

  useEffect(() => {
    if (!isConfigured || !buttonRef.current) return;

    const renderButton = () => {
      if (typeof window === 'undefined' || !window.google?.accounts?.id || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (response.credential) {
            onSuccess(response.credential);
          } else {
            onError?.('Google sign-in failed. Please try again.');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        shape: 'rectangular',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: 360,
        logo_alignment: 'left',
      });
    };

    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      renderButton();
    } else {
      const interval = setInterval(() => {
        if (typeof window !== 'undefined' && window.google?.accounts?.id) {
          clearInterval(interval);
          renderButton();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isConfigured, onSuccess, onError]);

  if (!isConfigured) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          style={{
            width: '100%',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            border: '1px solid var(--border)',
            cursor: 'not-allowed',
            opacity: 0.6,
          }}
          disabled
        >
          <GoogleLogoSVG />
          Continue with Google
        </button>
        <div style={{
          padding: '0.6rem 0.85rem',
          backgroundColor: 'var(--warning-light)',
          border: '1px solid var(--warning)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          color: 'var(--warning)',
          lineHeight: 1.5,
        }}>
          <strong>Setup required:</strong> Add your Google OAuth Client ID in{' '}
          <code style={{ fontFamily: 'var(--font-mono)' }}>src/services/auth.service.js</code>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={buttonRef}
      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
    />
  );
};

const GoogleLogoSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default GoogleSignInButton;
