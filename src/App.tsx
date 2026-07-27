import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CRMStateProvider, useCRMState } from './contexts/CRMStateContext';

// Views
import { AuthPages } from './views/AuthPages';
import { SuperAdminDashboard } from './views/SuperAdminDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { CustomerPortal } from './views/CustomerPortal';
import { CustomersList, LeadKanban, CommunicationHub, TaskList, SettingsPanel } from './views/CRMMicroModules';

// Components
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import MemberAvatar from './components/team/MemberAvatar';

// Lucide Icons
import {
  Zap,
  Building2,
  Users,
  GitCommit,
  Mail,
  CheckSquare,
  Settings,
  Shield,
  Search,
  Sun,
  Moon,
  LogOut,
  Menu
} from 'lucide-react';

const DashboardShell: React.FC<{
  currentView: string;
  setCurrentView: (view: string) => void;
}> = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { resetDatabase } = useCRMState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Command Palette states
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ category: string; text: string; action: () => void }[]>([]);

  // Keyboard shortcut for command palette (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search logic
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val) {
      setSearchResults([]);
      return;
    }

    const query = val.toLowerCase();
    const results: typeof searchResults = [];

    // Commands matches
    if ('reset database'.includes(query)) {
      results.push({ category: 'Command', text: 'Reset mock CRM database to seed data', action: () => { resetDatabase(); alert('Database reset!'); window.location.reload(); } });
    }
    if ('toggle light dark mode theme'.includes(query)) {
      results.push({ category: 'Command', text: 'Toggle dark mode or light mode', action: () => toggleTheme() });
    }
    if ('go to settings'.includes(query)) {
      results.push({ category: 'Navigation', text: 'Go to workspace API Settings', action: () => { setCurrentView('settings'); setCommandPaletteOpen(false); } });
    }
    if ('go to workflows automation'.includes(query)) {
      results.push({ category: 'Navigation', text: 'Go to Visual Workflow Builder', action: () => { setCurrentView('workflows'); setCommandPaletteOpen(false); } });
    }

    // CRM Searches (simulated)
    if ('stark enterprises olivia'.includes(query)) {
      results.push({ category: 'Customer', text: 'Stark Enterprises (Olivia Stark) - MRR $4,500', action: () => { setCurrentView('customers'); setCommandPaletteOpen(false); } });
    }
    if ('wayne enterprises bruce'.includes(query)) {
      results.push({ category: 'Customer', text: 'Wayne Enterprises (Bruce Wayne) - MRR $3,800', action: () => { setCurrentView('customers'); setCommandPaletteOpen(false); } });
    }
    if ('peter parker daily bugle'.includes(query)) {
      results.push({ category: 'Lead', text: 'Peter Parker (Daily Bugle) - Value $12,000', action: () => { setCurrentView('leads'); setCommandPaletteOpen(false); } });
    }

    setSearchResults(results);
  };

  const handleLogoutClick = () => {
    logout();
    setCurrentView('auth_login');
  };

  // Navigations lists based on User Roles
  const renderSidebarNavs = () => {
    if (user?.role === 'super_admin') {
      return (
        <>
          <button onClick={() => { setCurrentView('super_admin_dashboard'); setMobileMenuOpen(false); }} className={`tab-btn ${currentView === 'super_admin_dashboard' ? 'active' : ''}`} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', width: '100%', borderBottom: 'none' }}>
            <Shield size={16} /> Super Admin Home
          </button>
          <button onClick={() => { setCurrentView('workflows'); setMobileMenuOpen(false); }} className={`tab-btn ${currentView === 'workflows' ? 'active' : ''}`} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', width: '100%', borderBottom: 'none' }}>
            <GitCommit size={16} /> System Workflows
          </button>
        </>
      );
    }

    if (user?.role === 'customer') {
      return (
        <>
          <button onClick={() => { setCurrentView('customer_portal'); setMobileMenuOpen(false); }} className={`tab-btn ${currentView === 'customer_portal' ? 'active' : ''}`} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', width: '100%', borderBottom: 'none' }}>
            <Building2 size={16} /> Client Hub Home
          </button>
        </>
      );
    }

    // Standard workspace CRM accounts
    return (
      <>
        <button onClick={() => { setCurrentView('admin_dashboard'); setMobileMenuOpen(false); }} className={`tab-btn ${currentView === 'admin_dashboard' ? 'active' : ''}`} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', width: '100%', borderBottom: 'none' }}>
          <Building2 size={16} /> Workspace Overview
        </button>
        <button onClick={() => { setCurrentView('customers'); setMobileMenuOpen(false); }} className={`tab-btn ${currentView === 'customers' ? 'active' : ''}`} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', width: '100%', borderBottom: 'none' }}>
          <Users size={16} /> Customer Directory
        </button>
        <button onClick={() => { setCurrentView('leads'); setMobileMenuOpen(false); }} className={`tab-btn ${currentView === 'leads' ? 'active' : ''}`} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', width: '100%', borderBottom: 'none' }}>
          <GitCommit size={16} /> Kanban Pipeline
        </button>
        <button onClick={() => { setCurrentView('comms'); setMobileMenuOpen(false); }} className={`tab-btn ${currentView === 'comms' ? 'active' : ''}`} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', width: '100%', borderBottom: 'none' }}>
          <Mail size={16} /> Comms Loggers
        </button>
        <button onClick={() => { setCurrentView('workflows'); setMobileMenuOpen(false); }} className={`tab-btn ${currentView === 'workflows' ? 'active' : ''}`} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', width: '100%', borderBottom: 'none' }}>
          <Zap size={16} /> Automation Builder
        </button>
        <button onClick={() => { setCurrentView('tasks'); setMobileMenuOpen(false); }} className={`tab-btn ${currentView === 'tasks' ? 'active' : ''}`} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', width: '100%', borderBottom: 'none' }}>
          <CheckSquare size={16} /> Task Checklist
        </button>
      </>
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{
        display: mobileMenuOpen ? 'flex' : undefined
      }}>
        {/* Sidebar Header Logo */}
        <div style={{ height: '70px', padding: '0 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ width: '26px', height: '26px', backgroundColor: 'var(--primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-primary)' }}>
            <Zap size={14} style={{ color: '#000' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
            Quickads<span style={{ color: 'var(--primary)' }}>.crm</span>
          </span>
        </div>

        {/* Sidebar Middle items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {renderSidebarNavs()}
        </div>

        {/* Sidebar Footer logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div 
            onClick={() => { setCurrentView('settings'); setMobileMenuOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: '0.4rem 0.5rem', cursor: 'pointer', borderRadius: 'var(--radius-sm)', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Open Workspace Settings"
          >
            <MemberAvatar
              photoURL={user?.googleUser?.photoURL || (user?.avatar?.startsWith('http') ? user.avatar : undefined)}
              initials={user?.googleUser?.initials || (user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U')}
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

      {/* Main Right Area */}
      <div className="main-content">
        
        {/* Global Dashboard Header */}
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

            {/* Global search command triggers */}
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
              Tenant: {user?.orgName.split(' ')[0]}
            </span>
            <button className="btn-icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </header>

        {/* Dashboard Body Page router */}
        <main className="page-body">
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

      {/* COMMAND PALETTE POPUP */}
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

const AppRouter: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [currentView, setCurrentView] = useState('auth_login');
  // If the user is already logged in (via localStorage session), jump straight to the dashboard
  useEffect(() => {
    if (isLoggedIn && currentView.startsWith('auth_')) {
      setCurrentView('admin_dashboard');
    }
  }, [isLoggedIn, currentView]);

  return (
    <>
      {/* Main Router Logic */}
      {currentView.startsWith('auth_') ? (
        <AuthPages
          onAuthSuccess={() => setCurrentView('admin_dashboard')}
        />
      ) : (
        <DashboardShell currentView={currentView} setCurrentView={setCurrentView} />
      )}

      {/* Global Floating AI assistant co-pilot */}
      {!currentView.startsWith('auth_') && (
        <FloatingAIAssistant />
      )}
    </>
  );
};

const RootApp: React.FC = () => {
  return (
    <ThemeProvider>
      <CRMStateProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </CRMStateProvider>
    </ThemeProvider>
  );
};

export default RootApp;
