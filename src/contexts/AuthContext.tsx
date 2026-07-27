import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthUser } from '../types/user';
import {
  decodeGoogleJwt,
  validateGooglePayload,
  buildAuthUser,
  saveUserSession,
  loadUserSession,
  clearUserSession,
  GOOGLE_CLIENT_ID,
  simulateDevLogin,
} from '../services/auth.service';
import { resolveDisplayName, getInitials } from '../utils/formatUserName';

// ─────────────────────────────────────────────────────────────
// Legacy types kept for compatibility with existing CRM modules
// that rely on useAuth (DemoControlPanel, App.tsx, etc.)
// ─────────────────────────────────────────────────────────────
export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'employee'
  | 'sales_rep'
  | 'support_agent'
  | 'finance'
  | 'marketing'
  | 'customer';

/** Legacy User shape — mapped from AuthUser for existing components */
export interface User {
  id: string;
  name: string;
  email: string;
  orgId: string;
  orgName: string;
  role: UserRole;
  /** Avatar is now a photoURL string or emoji fallback */
  avatar?: string;
  /** Full Google auth user data */
  googleUser?: AuthUser;
}

interface AuthContextType {
  /** Legacy user object for backwards compatibility with existing components */
  user: User | null;
  /** The rich AuthUser object from Google sign-in */
  authUser: AuthUser | null;
  role: UserRole | null;
  isLoggedIn: boolean;
  /**
   * Processes a Google credential JWT string.
   * Validates domain, builds user, saves session.
   * @throws {Error} with message "Use a valid login credentials." on domain failure.
   */
  loginWithGoogle: (credential: string) => void;
  /** Bypass Google OAuth for local dev */
  devLogin: (email: string) => void;
  logout: () => void;
  /** Legacy method kept for DemoControlPanel compatibility */
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Maps an AuthUser (Google) to the legacy User shape expected by
 * existing components like the sidebar, header badge, etc.
 */
const mapToLegacyUser = (authUser: AuthUser): User => ({
  id: authUser.uid,
  name: authUser.name,
  email: authUser.email,
  orgId: 'org_quickads',
  orgName: authUser.orgName,
  role: 'admin',
  avatar: authUser.photoURL || authUser.initials,
  googleUser: authUser,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedUser = loadUserSession();
    if (savedUser) {
      setAuthUser(savedUser);
      setUser(mapToLegacyUser(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Initialize Google Identity Services script
  useEffect(() => {
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') return;

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: () => {
            // Callback handled imperatively via prompt/renderButton
          },
        });
      }
    };

    // If the GSI script is already loaded
    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      // Wait for the script to load
      const script = document.getElementById('google-gsi-script');
      if (script) {
        script.addEventListener('load', initGsi);
        return () => script.removeEventListener('load', initGsi);
      }
    }
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    let payload: any;
    try {
      payload = decodeGoogleJwt(credential);
    } catch {
      throw new Error('Error - Use valid login credentials.');
    }

    try {
      // 1. Send ID token credential to Backend API to execute authentication & LoginAttempt logging
      const response = await fetch('http://localhost:5001/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credential }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error - Use valid login credentials.');
      }

      // 2. Successful login from Backend API
      const newAuthUser: AuthUser = {
        uid: data.user.id || payload.sub,
        name: data.user.name || resolveDisplayName(payload.name, payload.email),
        email: data.user.email || payload.email,
        photoURL: data.user.picture || payload.picture,
        initials: getInitials(data.user.name || payload.name || payload.email),
        role: data.user.role === 'ADMIN' ? 'Admin' : 'User',
        status: data.user.accountStatus === 'ACTIVE' ? 'Active' : 'Inactive',
        memberSince: data.user.createdAt || new Date().toISOString(),
        orgName: 'QuickAds',
      };

      saveUserSession(newAuthUser);
      setAuthUser(newAuthUser);
      setUser(mapToLegacyUser(newAuthUser));
      setIsLoggedIn(true);
    } catch (err: any) {
      // If backend API returned error (e.g. non-@quickads.ai email rejected)
      if (err.message && err.message !== 'Failed to fetch') {
        throw new Error(err.message);
      }

      // Standalone client fallback if backend server is not running locally
      validateGooglePayload(payload);
      const newAuthUser = buildAuthUser(payload);
      saveUserSession(newAuthUser);
      setAuthUser(newAuthUser);
      setUser(mapToLegacyUser(newAuthUser));
      setIsLoggedIn(true);
    }
  }, []);

  const devLogin = useCallback((email: string) => {
    const mockUser = simulateDevLogin(email);
    setAuthUser(mockUser);
    setUser(mapToLegacyUser(mockUser));
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    clearUserSession();
    setAuthUser(null);
    setUser(null);
    setIsLoggedIn(false);

    // Sign out from Google to prevent instant re-login
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  /** Legacy switchRole — kept so DemoControlPanel doesn't break */
  const switchRole = useCallback((_role: UserRole) => {
    // No-op in the new Google-only auth flow.
    // DemoControlPanel still calls this but it has no effect.
  }, []);

  const role: UserRole | null = user ? user.role : null;

  return (
    <AuthContext.Provider value={{ user, authUser, role, isLoggedIn, loginWithGoogle, devLogin, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
