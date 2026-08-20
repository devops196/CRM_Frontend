'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useCRMState } from '../contexts/CRMStateContext.jsx';
import { Settings, RefreshCw, Sun, Moon, Shield, Navigation, LogOut } from 'lucide-react';

export const DemoControlPanel = ({ currentView, setCurrentView }) => {
  const { user, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { resetDatabase } = useCRMState();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { role: 'super_admin', label: 'Super Admin', icon: '⚡' },
    { role: 'admin', label: 'Workspace Admin', icon: '👨‍💼' },
    { role: 'manager', label: 'Sales Manager', icon: '👩‍💻' },
    { role: 'sales_rep', label: 'Sales Rep', icon: '📈' },
    { role: 'support_agent', label: 'Support Agent', icon: '🎧' },
    { role: 'customer', label: 'Customer Client', icon: '🛡️' },
  ];

  const handleRoleSwitch = (targetRole) => {
    switchRole(targetRole);
    if (targetRole === 'super_admin') {
      setCurrentView('super_admin_dashboard');
    } else if (targetRole === 'customer') {
      setCurrentView('customer_portal');
    } else {
      setCurrentView('admin_dashboard');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all mock CRM database entries?')) {
      resetDatabase();
      alert('CRM database has been reset to initial seed values.');
      if (typeof window !== 'undefined') window.location.reload();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 99999,
      fontFamily: 'var(--font-sans)'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn"
        style={{
          backgroundColor: '#0e120d',
          color: '#f2f5f1',
          border: '1px solid var(--border)',
          borderRadius: '50px',
          padding: '0.75rem 1.25rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: 600,
          fontSize: '0.85rem'
        }}
      >
        <span style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          boxShadow: '0 0 8px var(--primary)'
        }}></span>
        Demo System Control
        <Settings size={14} className={isOpen ? 'spin' : ''} style={{ transition: 'transform 0.3s' }} />
      </button>

      {isOpen && (
        <div className="glass-card animate-slide-up" style={{
          position: 'absolute',
          bottom: '55px',
          left: '0',
          width: '320px',
          backgroundColor: 'rgba(14, 18, 13, 0.95)',
          color: '#f2f5f1',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Shield size={16} /> CRM Environment Config
            </h4>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button className="btn-icon" onClick={toggleTheme} title="Toggle Theme" style={{ width: '28px', height: '28px', backgroundColor: 'transparent', border: '1px solid var(--border)', color: '#fff' }}>
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button className="btn-icon" onClick={handleReset} title="Reset Seeds" style={{ width: '28px', height: '28px', backgroundColor: 'transparent', border: '1px solid var(--border)', color: '#fff' }}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.8rem'
          }}>
            <div style={{ fontWeight: 650, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>{user?.avatar}</span> {user?.name}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.2rem' }}>Role: <span style={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>{user?.role?.replace('_', ' ')}</span></div>
            <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.2rem' }}>Tenant: {user?.orgName}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simulate RBAC User Role</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => handleRoleSwitch(r.role)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: user?.role === r.role ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: user?.role === r.role ? 'var(--primary-glow)' : 'rgba(255, 255, 255, 0.02)',
                    color: user?.role === r.role ? 'var(--primary)' : '#fff',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: user?.role === r.role ? 600 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span>{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fast App Navigation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <button
                onClick={() => setCurrentView('landing')}
                className="btn"
                style={{
                  padding: '0.4rem',
                  fontSize: '0.75rem',
                  justifyContent: 'flex-start',
                  backgroundColor: currentView === 'landing' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Navigation size={12} style={{ color: 'var(--primary)' }} /> SaaS Landing Website
              </button>
              <button
                onClick={() => setCurrentView('auth_login')}
                className="btn"
                style={{
                  padding: '0.4rem',
                  fontSize: '0.75rem',
                  justifyContent: 'flex-start',
                  backgroundColor: currentView.startsWith('auth_') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <LogOut size={12} style={{ color: 'var(--primary)' }} /> Authentication Portal Mock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
