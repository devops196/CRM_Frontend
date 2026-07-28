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
import { fetchTeamMembersFromApi } from '../services/team.service';

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
 * Maps an AuthUser to the legacy User shape.
 * avatar is always derived from initials (sidebar shows initials, not photo from cache)
 */
const mapToLegacyUser = (authUser: AuthUser): User => ({
  id: authUser.uid,
  name: authUser.name,
  email: authUser.email,
  orgId: 'org_quickads',
  orgName: authUser.orgName,
  role: 'admin',
  // Never use cached photoURL from localStorage as avatar — use initials only
  // The sidebar avatar reads from DB via ProfileCard separately
  avatar: authUser.initials,
  googleUser: authUser,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  /**
   * Fetches the user's live record from the DB and syncs it into state.
   * This is the ONLY source of truth for credits, picture, role, and status.
   * localStorage only stores identity fields (uid, email, name, initials, memberSince).
   */
  const syncWithDb = useCallback(async (baseUser: AuthUser) => {
    try {
      const dbMembers = await fetchTeamMembersFromApi({ search: baseUser.email });
      const found =
        dbMembers.find((m: any) => m.email.toLowerCase() === baseUser.email.toLowerCase()) ||
        (dbMembers.length > 0 ? dbMembers[0] : null);

      if (found) {
        // All mutable fields come from DB — never from localStorage cache
        const dbPhotoURL = found.photoURL && found.photoURL.trim() !== '' ? found.photoURL : undefined;
        const syncedUser: AuthUser = {
          // Keep identity fields from the base session
          uid: baseUser.uid,
          email: baseUser.email,
          initials: getInitials(found.name || baseUser.name),
          memberSince: baseUser.memberSince,
          orgName: baseUser.orgName,
          // All of these come ONLY from the DB — never from localStorage
          name: found.name,
          photoURL: dbPhotoURL,
          role: (found.role === 'Admin' ? 'Admin' : 'Customer') as AuthUser['role'],
          status: (found.accountStatus === 'Active' ? 'Active' : 'Inactive') as AuthUser['status'],
          creditsAvailable: found.creditsAvailable,
          totalCredits: found.totalCredits,
        };
        // Save only identity fields back to localStorage (strip mutable DB fields)
        saveIdentitySession(syncedUser);
        setAuthUser(syncedUser);
        setUser(mapToLegacyUser(syncedUser));
        setIsLoggedIn(true);
        return syncedUser;
      }
    } catch (err) {
      console.error('Failed to sync auth user with database:', err);
    }
    // DB unavailable — at least restore the session identity
    setAuthUser(baseUser);
    setUser(mapToLegacyUser(baseUser));
    setIsLoggedIn(true);
    return baseUser;
  }, []);

  // On mount — restore session identity from localStorage, then immediately fetch fresh DB data
  useEffect(() => {
    const savedUser = loadUserSession();
    if (savedUser) {
      // Set identity only first (no stale credits/photo flash)
      const identityOnly: AuthUser = {
        uid: savedUser.uid,
        email: savedUser.email,
        name: savedUser.name,
        initials: savedUser.initials,
        memberSince: savedUser.memberSince,
        orgName: savedUser.orgName,
        role: savedUser.role,
        status: savedUser.status,
        // Deliberately omit photoURL, creditsAvailable, totalCredits
        // They will be filled in by syncWithDb below
      };
      setAuthUser(identityOnly);
      setUser(mapToLegacyUser(identityOnly));
      setIsLoggedIn(true);

      // Immediately fetch fresh data from DB
      syncWithDb(savedUser);
    }
  }, [syncWithDb]);

  // Initialize Google Identity Services script
  useEffect(() => {
    if ((GOOGLE_CLIENT_ID as string) === 'YOUR_GOOGLE_CLIENT_ID') return;

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

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
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
      // Send ID token to Backend API
      const response = await fetch('http://localhost:5001/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credential }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error - Use valid login credentials.');
      }

      // Build identity-only AuthUser — DB data will be fetched by syncWithDb
      const dbPicture = data.user.picture && data.user.picture.trim() !== '' ? data.user.picture : undefined;
      const newAuthUser: AuthUser = {
        uid: data.user.id || payload.sub,
        name: data.user.name || resolveDisplayName(payload.name, payload.email),
        email: data.user.email || payload.email,
        photoURL: dbPicture,
        initials: getInitials(data.user.name || payload.name || payload.email),
        role: (data.user.role === 'ADMIN' ? 'Admin' : 'Customer') as AuthUser['role'],
        status: (data.user.accountStatus === 'ACTIVE' ? 'Active' : 'Inactive') as AuthUser['status'],
        creditsAvailable: data.user.creditsAvailable,
        totalCredits: data.user.totalCredits,
        memberSince: data.user.createdAt || new Date().toISOString(),
        orgName: 'QuickAds',
      };

      saveIdentitySession(newAuthUser);
      setAuthUser(newAuthUser);
      setUser(mapToLegacyUser(newAuthUser));
      setIsLoggedIn(true);
    } catch (err: any) {
      if (err.message && err.message !== 'Failed to fetch') {
        throw new Error(err.message);
      }

      // Client-side fallback when backend is offline
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
    syncWithDb(mockUser);
  }, [syncWithDb]);

  const logout = useCallback(() => {
    clearUserSession();
    setAuthUser(null);
    setUser(null);
    setIsLoggedIn(false);

    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  /** Legacy switchRole — kept so DemoControlPanel doesn't break */
  const switchRole = useCallback((_role: UserRole) => {
    // No-op in the new Google-only auth flow.
  }, []);

  const role: UserRole | null = user ? user.role : null;

  return (
    <AuthContext.Provider value={{ user, authUser, role, isLoggedIn, loginWithGoogle, devLogin, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Saves only identity fields to localStorage.
 * Mutable DB fields (credits, picture, role, status) are intentionally excluded
 * so they are always fetched fresh from the DB on next load.
 */
function saveIdentitySession(user: AuthUser): void {
  const SESSION_KEY = 'crm_auth_user_v2';
  const identity = {
    uid: user.uid,
    email: user.email,
    name: user.name,
    initials: user.initials,
    memberSince: user.memberSince,
    orgName: user.orgName,
    role: user.role,
    status: user.status,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(identity));
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
