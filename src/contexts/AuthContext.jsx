'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  decodeGoogleJwt,
  validateGooglePayload,
  buildAuthUser,
  saveUserSession,
  loadUserSession,
  clearUserSession,
  GOOGLE_CLIENT_ID,
  simulateDevLogin,
} from '../services/auth.service.js';
import { resolveDisplayName, getInitials } from '../utils/formatUserName.js';
import { fetchTeamMembersFromApi } from '../services/team.service.js';

const AuthContext = createContext(undefined);

/**
 * Maps an AuthUser to the legacy User shape.
 */
const mapToLegacyUser = (authUser) => ({
  id: authUser.uid,
  name: authUser.name,
  email: authUser.email,
  orgId: 'org_quickads',
  orgName: authUser.orgName,
  role: 'admin',
  avatar: authUser.initials,
  googleUser: authUser,
});

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * Fetches the user's live record from the DB and syncs it into state.
   */
  const syncWithDb = useCallback(async (baseUser) => {
    try {
      const dbMembers = await fetchTeamMembersFromApi({ search: baseUser.email });
      const found =
        dbMembers.find((m) => m.email.toLowerCase() === baseUser.email.toLowerCase()) ||
        (dbMembers.length > 0 ? dbMembers[0] : null);

      if (found) {
        const dbPhotoURL = found.photoURL && found.photoURL.trim() !== '' ? found.photoURL : undefined;
        const syncedUser = {
          uid: baseUser.uid,
          email: baseUser.email,
          initials: getInitials(found.name || baseUser.name),
          memberSince: baseUser.memberSince,
          orgName: baseUser.orgName,
          name: found.name,
          photoURL: dbPhotoURL,
          role: found.role === 'Admin' ? 'Admin' : 'Customer',
          status: found.accountStatus === 'Active' ? 'Active' : 'Inactive',
          creditsAvailable: found.creditsAvailable,
          totalCredits: found.totalCredits,
        };
        saveIdentitySession(syncedUser);
        setAuthUser(syncedUser);
        setUser(mapToLegacyUser(syncedUser));
        setIsLoggedIn(true);
        return syncedUser;
      }
    } catch (err) {
      console.error('Failed to sync auth user with database:', err);
    }
    setAuthUser(baseUser);
    setUser(mapToLegacyUser(baseUser));
    setIsLoggedIn(true);
    return baseUser;
  }, []);

  // On mount — restore session identity from localStorage, then fetch fresh DB data
  useEffect(() => {
    const savedUser = loadUserSession();
    if (savedUser) {
      const identityOnly = {
        uid: savedUser.uid,
        email: savedUser.email,
        name: savedUser.name,
        initials: savedUser.initials,
        memberSince: savedUser.memberSince,
        orgName: savedUser.orgName,
        role: savedUser.role,
        status: savedUser.status,
      };
      setAuthUser(identityOnly);
      setUser(mapToLegacyUser(identityOnly));
      setIsLoggedIn(true);

      syncWithDb(savedUser);
    }
  }, [syncWithDb]);

  // Initialize Google Identity Services script
  useEffect(() => {
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') return;

    const initGsi = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: () => {},
        });
      }
    };

    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      initGsi();
    } else if (typeof document !== 'undefined') {
      const script = document.getElementById('google-gsi-script');
      if (script) {
        script.addEventListener('load', initGsi);
        return () => script.removeEventListener('load', initGsi);
      }
    }
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    let payload;
    try {
      payload = decodeGoogleJwt(credential);
    } catch {
      throw new Error('Error - Use valid login credentials.');
    }

    try {
      const response = await fetch('http://localhost:5001/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credential }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error - Use valid login credentials.');
      }

      const dbPicture = data.user.picture && data.user.picture.trim() !== '' ? data.user.picture : undefined;
      const newAuthUser = {
        uid: data.user.id || payload.sub,
        name: data.user.name || resolveDisplayName(payload.name, payload.email),
        email: data.user.email || payload.email,
        photoURL: dbPicture,
        initials: getInitials(data.user.name || payload.name || payload.email),
        role: data.user.role === 'ADMIN' ? 'Admin' : 'Customer',
        status: data.user.accountStatus === 'ACTIVE' ? 'Active' : 'Inactive',
        creditsAvailable: data.user.creditsAvailable,
        totalCredits: data.user.totalCredits,
        memberSince: data.user.createdAt || new Date().toISOString(),
        orgName: 'QuickAds',
      };

      saveIdentitySession(newAuthUser);
      setAuthUser(newAuthUser);
      setUser(mapToLegacyUser(newAuthUser));
      setIsLoggedIn(true);
    } catch (err) {
      if (err.message && err.message !== 'Failed to fetch') {
        throw new Error(err.message);
      }

      validateGooglePayload(payload);
      const newAuthUser = buildAuthUser(payload);
      saveUserSession(newAuthUser);
      setAuthUser(newAuthUser);
      setUser(mapToLegacyUser(newAuthUser));
      setIsLoggedIn(true);
    }
  }, []);

  const devLogin = useCallback((email) => {
    const mockUser = simulateDevLogin(email);
    syncWithDb(mockUser);
  }, [syncWithDb]);

  const logout = useCallback(() => {
    clearUserSession();
    setAuthUser(null);
    setUser(null);
    setIsLoggedIn(false);

    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  const switchRole = useCallback((_role) => {}, []);

  const role = user ? user.role : null;

  return (
    <AuthContext.Provider value={{ user, authUser, role, isLoggedIn, loginWithGoogle, devLogin, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

function saveIdentitySession(user) {
  if (typeof window === 'undefined') return;
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
