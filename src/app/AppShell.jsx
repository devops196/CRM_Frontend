'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCRMState } from '../contexts/CRMStateContext.jsx';

// Views
import { AuthPages } from '../views/AuthPages.jsx';
import { SuperAdminDashboard } from '../views/SuperAdminDashboard.jsx';
import { AdminDashboard } from '../views/AdminDashboard.jsx';
import { CustomerPortal } from '../views/CustomerPortal.jsx';
import { CustomersList, LeadKanban, CommunicationHub, TaskList, SettingsPanel, TeamLookupView, UserCreditDetailsView } from '../views/CRMMicroModules.jsx';

// Components
import { FloatingAIAssistant } from '../components/FloatingAIAssistant.jsx';
import { WorkflowBuilder } from '../components/WorkflowBuilder.jsx';
import MemberAvatar from '../components/team/MemberAvatar.jsx';

// Lucide Icons
import {
  Zap,
  Users,
  Search,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';

const DashboardShell = ({ currentView, setCurrentView, selectedUserIdentifier, setSelectedUserIdentifier }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { resetDatabase } = useCRMState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Command Palette states
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Keyboard shortcut for command palette (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search logic
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (!val) {
      setSearchResults([]);
      return;
    }

    const query = val.toLowerCase();
    const results = [];

    if ('team lookup account search'.includes(query)) {
      results.push({ category: 'Navigation', text: 'Open Team Lookup', action: () => { if (typeof window !== 'undefined') window.history.pushState({}, '', '/team_lookup'); setCurrentView('team_lookup'); setCommandPaletteOpen(false); } });
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

    setSearchResults(results);
  };

  const handleLogoutClick = () => {
    logout();
    setCurrentView('auth_login');
  };

  const renderSidebarNavs = () => {
    return (
      <button
        onClick={() => {
          if (typeof window !== 'undefined') window.history.pushState({}, '', '/team_lookup');
          setCurrentView('team_lookup');
          setMobileMenuOpen(false);
        }}
        className={`tab-btn ${currentView === 'team_lookup' || currentView === 'user_credit_details' ? 'active' : ''}`}
        style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', width: '100%', borderBottom: 'none' }}
      >
        <Users size={16} /> Team Lookup
      </button>
    );
  };

  return (
    <div className="app-container">
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{
        display: mobileMenuOpen ? 'flex' : undefined
      }}>
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

      <div className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-primary" style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Tenant: {user?.orgName ? user.orgName.split(' ')[0] : 'Default'}
            </span>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', marginTop: '10vh' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or query (e.g. 'Stark', 'Settings', 'Reset')..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            
            <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '0.5rem' }}>
              {searchResults.length > 0 ? (
                searchResults.map((res, idx) => (
                  <div
                    key={idx}
                    onClick={() => { res.action(); setCommandPaletteOpen(false); }}
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'background-color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{res.text}</span>
                    <span className="badge badge-primary" style={{ fontSize: '0.6rem' }}>{res.category}</span>
                  </div>
                ))
              ) : searchQuery ? (
                <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  No matching workspace records or API commands found.
                </div>
              ) : (
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quick suggestions</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>• Type <strong>Stark</strong> to search customer file accounts.</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>• Type <strong>Settings</strong> to open developer configurations.</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>• Type <strong>Reset</strong> to trigger a mock database clean.</div>
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
  const { isLoggedIn } = useAuth();
  const [currentView, setCurrentView] = useState(initialView);
  const [selectedUserIdentifier, setSelectedUserIdentifier] = useState(initialUserIdentifier);

  useEffect(() => {
    const syncRouteFromLocation = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname;
      if (path.startsWith('/lookup/')) {
        const id = decodeURIComponent(path.replace('/lookup/', ''));
        if (id) {
          setSelectedUserIdentifier(id);
          setCurrentView('user_credit_details');
        }
      } else if (path === '/team_lookup' || path === '/lookup') {
        setCurrentView('team_lookup');
      }
    };

    syncRouteFromLocation();

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', syncRouteFromLocation);
      return () => window.removeEventListener('popstate', syncRouteFromLocation);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentView.startsWith('auth_')) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
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
  }, [isLoggedIn, currentView]);

  return (
    <>
      {currentView.startsWith('auth_') ? (
        <AuthPages
          onAuthSuccess={() => {
            if (typeof window !== 'undefined') {
              const path = window.location.pathname;
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

      {!currentView.startsWith('auth_') && (
        <FloatingAIAssistant />
      )}
    </>
  );
}

export default AppShell;
