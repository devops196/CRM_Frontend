'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCRMState } from '../contexts/CRMStateContext.jsx';

// Views
import { AuthPages } from '../views/AuthPages.jsx';
import { SuperAdminDashboard } from '../views/SuperAdminDashboard.jsx';
import { AdminDashboard } from '../views/AdminDashboard.jsx';
import { CustomerPortal } from '../views/CustomerPortal.jsx';
import { CustomersList, LeadKanban, CommunicationHub, TaskList, SettingsPanel, TeamLookupView, UserCreditDetailsView } from '../views/CRMMicroModules.jsx';
import { AdminCreditControlView } from '../views/AdminCreditControlView.jsx';

// Components
import { WorkflowBuilder } from '../components/WorkflowBuilder.jsx';
import MemberAvatar from '../components/team/MemberAvatar.jsx';

// Services
import { fetchTeamMembersFromApi } from '../services/team.service.js';

// Lucide Icons
import {
  Zap,
  Users,
  Search,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

const DashboardShell = ({ currentView, setCurrentView, selectedUserIdentifier, setSelectedUserIdentifier }) => {
  const { authUser, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { resetDatabase } = useCRMState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const currentRole = (authUser?.role || user?.role || '').toUpperCase();
  const isAdmin = currentRole === 'ADMIN';

  // Command Palette states
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // User search states
  const [userResults, setUserResults] = useState([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const debounceRef = useRef(null);

  // Keyboard shortcut for command palette (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset state when palette closes
  useEffect(() => {
    if (!commandPaletteOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setUserResults([]);
      setUserSearchLoading(false);
    }
  }, [commandPaletteOpen]);

  // Live user search via API (debounced 300ms — same as TeamLookupView)
  const fetchUsers = useCallback(async (query) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setUserResults([]);
      setUserSearchLoading(false);
      return;
    }
    setUserSearchLoading(true);
    try {
      const data = await fetchTeamMembersFromApi({ search: trimmed });
      setUserResults(data || []);
    } catch (err) {
      console.error('Navbar user search error:', err);
      setUserResults([]);
    } finally {
      setUserSearchLoading(false);
    }
  }, []);

  // Command/nav search logic (synchronous)
  const getCommandResults = useCallback((val) => {
    if (!val) return [];
    const query = val.toLowerCase();
    const results = [];
    if ('team lookup account search'.includes(query)) {
      results.push({ category: 'Navigation', text: 'Open Team Lookup', action: () => { if (typeof window !== 'undefined') window.history.pushState({}, '', '/team_lookup'); setCurrentView('team_lookup'); setCommandPaletteOpen(false); } });
    }
    if (isAdmin && 'credit control admin'.includes(query)) {
      results.push({ category: 'Navigation', text: 'Open Credit Control', action: () => { if (typeof window !== 'undefined') window.history.pushState({}, '', '/credit_control'); setCurrentView('credit_control'); setCommandPaletteOpen(false); } });
    }
    if ('profile settings user account'.includes(query)) {
      results.push({ category: 'Navigation', text: 'Open Your Profile', action: () => { setCurrentView('settings'); setCommandPaletteOpen(false); } });
    }
    if ('reset database'.includes(query)) {
      results.push({ category: 'Command', text: 'Reset mock CRM database to seed data', action: () => { resetDatabase(); alert('Database reset!'); if (typeof window !== 'undefined') window.location.reload(); } });
    }
    if ('toggle light dark mode theme'.includes(query)) {
      results.push({ category: 'Command', text: 'Toggle dark mode or light mode', action: () => toggleTheme() });
    }
    return results;
  }, [isAdmin, resetDatabase, toggleTheme, setCurrentView]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setSearchResults(getCommandResults(val));
    // Debounce user API search
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(val), 300);
  };

  // Navigate to user credit details from navbar search result
  const handleUserResultClick = (u) => {
    const identifier = u.employeeId || u.id || u.email;
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/lookup/${encodeURIComponent(identifier)}`);
    }
    setSelectedUserIdentifier(identifier);
    setCurrentView('user_credit_details');
    setCommandPaletteOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
    setCurrentView('auth_login');
  };

  const renderSidebarNavs = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%' }}>
        {/* Team Lookup */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') window.history.pushState({}, '', '/team_lookup');
            setCurrentView('team_lookup');
            setMobileMenuOpen(false);
          }}
          className={`tab-btn ${
            currentView === 'team_lookup' || currentView === 'user_credit_details' ? 'active' : ''
          }`}
          style={{
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.8rem 1rem',
            width: '100%',
            borderBottom: 'none',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <Users size={16} /> Team Lookup
        </button>
      </div>
    );
  };

  return (
    <div className="app-container">
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div style={{ height: '70px', padding: '0 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ width: '26px', height: '26px', backgroundColor: 'var(--primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-primary)' }}>
            <Zap size={14} style={{ color: '#000' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
            Quickads<span style={{ color: 'var(--primary)' }}>.crm</span>
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {renderSidebarNavs()}
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div 
            onClick={() => { setCurrentView('settings'); setMobileMenuOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: '0.4rem 0.5rem', cursor: 'pointer', borderRadius: 'var(--radius-sm)', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Open Workspace Settings"
          >
            <MemberAvatar
              photoURL={undefined}
              initials={user?.googleUser?.initials || (user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U')}
              name={user?.name || 'User'}
              size={28}
            />
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div style={{ fontWeight: 650 }}>{user?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogoutClick} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.78rem', padding: '0.4rem', gap: '0.4rem', justifyContent: 'center' }}>
            <LogOut size={12} /> Log Out
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 90,
          }}
        />
      )}

      <div className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Left side intentionally empty */}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              onClick={() => setCommandPaletteOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: '50px',
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                width: '280px',
                cursor: 'pointer'
              }}
              title="Press ⌘K to search commands"
            >
              <Search size={14} />
              <span>Search accounts, keys...</span>
              <span style={{
                marginLeft: 'auto',
                backgroundColor: 'var(--border)',
                fontSize: '0.65rem',
                padding: '1px 5px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)'
              }}>
                ⌘K
              </span>
            </div>
            <button className="btn-icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </header>

        <main className="page-body">
          {currentView === 'team_lookup' && (
            <TeamLookupView
              onSelectUser={(u) => {
                const identifier = u.employeeId || u.id || u.email;
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', `/lookup/${encodeURIComponent(identifier)}`);
                }
                setSelectedUserIdentifier(identifier);
                setCurrentView('user_credit_details');
              }}
            />
          )}
          {currentView === 'user_credit_details' && (
            <UserCreditDetailsView
              identifier={selectedUserIdentifier}
              onBack={() => {
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', '/team_lookup');
                }
                setCurrentView('team_lookup');
              }}
            />
          )}
          {currentView === 'credit_control' && <AdminCreditControlView />}
          {currentView === 'super_admin_dashboard' && <SuperAdminDashboard />}
          {currentView === 'admin_dashboard' && <AdminDashboard />}
          {currentView === 'customer_portal' && <CustomerPortal />}
          {currentView === 'customers' && <CustomersList />}
          {currentView === 'leads' && <LeadKanban />}
          {currentView === 'comms' && <CommunicationHub />}
          {currentView === 'workflows' && <WorkflowBuilder />}
          {currentView === 'tasks' && <TaskList />}
          {currentView === 'settings' && <SettingsPanel />}
        </main>
      </div>

      {commandPaletteOpen && (
        <div className="modal-overlay" onClick={() => setCommandPaletteOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', marginTop: '8vh', padding: 0, overflow: 'hidden' }}
          >
            {/* Search Input */}
            <div style={{
              padding: '0.85rem 1.1rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                autoFocus
                type="text"
                placeholder="Search users by name, email or Employee ID..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.92rem',
                  color: 'var(--text-primary)'
                }}
              />
              {userSearchLoading && (
                <Loader2 size={15} style={{ color: 'var(--text-muted)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
              )}
              <kbd style={{
                backgroundColor: 'var(--border)',
                fontSize: '0.62rem',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                flexShrink: 0
              }}>ESC</kbd>
            </div>

            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>

              {/* — USER RESULTS SECTION — */}
              {searchQuery && (
                <div style={{ padding: '0.5rem 0.75rem 0' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.5rem 0.25rem 0.3rem' }}>
                    Users
                  </div>

                  {userSearchLoading && (
                    <div style={{ padding: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                      Searching users...
                    </div>
                  )}

                  {!userSearchLoading && userResults.length === 0 && searchQuery.trim() && (
                    <div style={{ padding: '0.75rem 0.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      No users found for &quot;{searchQuery}&quot;.
                    </div>
                  )}

                  {!userSearchLoading && userResults.map((u) => (
                    <div
                      key={u.id || u.email}
                      onClick={() => handleUserResultClick(u)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '0.65rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s',
                        marginBottom: '2px',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: isAdmin ? '#8b5cf6' : 'var(--primary)',
                        color: isAdmin ? '#fff' : '#000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                        overflow: 'hidden',
                      }}>
                        {u.photoURL
                          ? <img src={u.photoURL} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : (u.initials || u.name?.charAt(0) || '?')
                        }
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 650, fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {u.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {u.email} {u.employeeId ? `· ${u.employeeId}` : ''}
                        </div>
                      </div>

                      {/* Status + CTA */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0 }}>
                        <span className={`badge ${(u.accountStatus || u.status) === 'Active' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.6rem', fontWeight: 700 }}>
                          {(u.accountStatus || u.status || 'Active').toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600 }}>
                          View Credits →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* — COMMANDS SECTION — */}
              {(searchResults.length > 0 || !searchQuery) && (
                <div style={{ padding: '0.5rem 0.75rem', borderTop: searchQuery && userResults.length > 0 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.5rem 0.25rem 0.3rem' }}>
                    {searchQuery ? 'Commands' : 'Quick Suggestions'}
                  </div>

                  {searchResults.length > 0 ? searchResults.map((res, idx) => (
                    <div
                      key={idx}
                      onClick={() => { res.action(); setCommandPaletteOpen(false); }}
                      style={{
                        padding: '0.6rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'background-color 0.15s',
                        marginBottom: '2px',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{res.text}</span>
                      <span className="badge badge-primary" style={{ fontSize: '0.6rem' }}>{res.category}</span>
                    </div>
                  )) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: '0.25rem 0.25rem 0.75rem' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>• Type a <strong>name</strong> to search users and view credit details.</div>
                    </div>
                  )}
                </div>
              )}

              {/* Empty state when query has no results at all */}
              {searchQuery && !userSearchLoading && userResults.length === 0 && searchResults.length === 0 && (
                <div style={{ padding: '1.25rem 1rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  No users or commands matched &quot;{searchQuery}&quot;.
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function AppShell({ initialView = 'team_lookup', initialUserIdentifier = '' }) {
  const { isLoggedIn, authUser, user } = useAuth();
  const currentRole = (authUser?.role || user?.role || '').toUpperCase();
  const isAdmin = currentRole === 'ADMIN';

  const [currentView, setCurrentView] = useState(initialView);
  const [selectedUserIdentifier, setSelectedUserIdentifier] = useState(initialUserIdentifier);

  useEffect(() => {
    const syncRouteFromLocation = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname;
      if (path === '/credit_control') {
        if (isAdmin) {
          setCurrentView('credit_control');
        } else {
          window.history.pushState({}, '', '/team_lookup');
          setCurrentView('team_lookup');
        }
      } else if (path.startsWith('/lookup/')) {
        const id = decodeURIComponent(path.replace('/lookup/', ''));
        if (id) {
          setSelectedUserIdentifier(id);
          setCurrentView('user_credit_details');
        }
      } else if (path.startsWith('/profile') || path.startsWith('/settings') || path.startsWith('/team')) {
        setCurrentView('settings');
      } else if (path === '/team_lookup' || path === '/lookup') {
        setCurrentView('team_lookup');
      }
    };

    syncRouteFromLocation();

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', syncRouteFromLocation);
      return () => window.removeEventListener('popstate', syncRouteFromLocation);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isLoggedIn && currentView.startsWith('auth_')) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path === '/credit_control') {
          if (isAdmin) {
            setCurrentView('credit_control');
          } else {
            window.history.pushState({}, '', '/team_lookup');
            setCurrentView('team_lookup');
          }
          return;
        }
        if (path.startsWith('/lookup/')) {
          const id = decodeURIComponent(path.replace('/lookup/', ''));
          if (id) {
            setSelectedUserIdentifier(id);
            setCurrentView('user_credit_details');
            return;
          }
        }
      }
      setCurrentView('team_lookup');
    }
  }, [isLoggedIn, currentView, isAdmin]);

  return (
    <>
      {!isLoggedIn || currentView.startsWith('auth_') ? (
        <AuthPages
          onAuthSuccess={() => {
            if (typeof window !== 'undefined') {
              const path = window.location.pathname;
              if (path === '/credit_control') {
                setCurrentView('credit_control');
                return;
              }
              if (path.startsWith('/lookup/')) {
                const id = decodeURIComponent(path.replace('/lookup/', ''));
                if (id) {
                  setSelectedUserIdentifier(id);
                  setCurrentView('user_credit_details');
                  return;
                }
              }
            }
            setCurrentView('team_lookup');
          }}
        />
      ) : (
        <DashboardShell
          currentView={currentView}
          setCurrentView={setCurrentView}
          selectedUserIdentifier={selectedUserIdentifier}
          setSelectedUserIdentifier={setSelectedUserIdentifier}
        />
      )}


    </>
  );
}

export default AppShell;
