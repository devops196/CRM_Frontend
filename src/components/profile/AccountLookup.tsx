import React, { useState } from 'react';
import { Search, Loader2, AlertTriangle, Zap, CheckCircle2, ShieldCheck, Coins, Mail } from 'lucide-react';
import type { TeamMember } from '../../types/team';
import { fetchTeamMembersFromApi } from '../../services/team.service';
import UsageCreditsDashboard from './UsageCreditsDashboard';

export const AccountLookup: React.FC<{ onSearchTrigger?: (query: string) => void }> = ({ onSearchTrigger }) => {
  const [prefix, setPrefix] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'found' | 'not_found' | 'error'>('idle');
  const [account, setAccount] = useState<TeamMember | null>(null);
  const [validationError, setValidationError] = useState('');

  // Search handler
  const handleCheck = async () => {
    const trimmed = prefix.trim();
    if (!trimmed) {
      setValidationError('Please enter email, name, or employee ID');
      return;
    }
    setValidationError('');
    setState('loading');
    setAccount(null);

    try {
      const results = await fetchTeamMembersFromApi({ search: trimmed });
      if (results.length > 0) {
        setAccount(results[0]);
        setState('found');
        if (onSearchTrigger) onSearchTrigger(trimmed);
      } else {
        setState('not_found');
      }
    } catch {
      setState('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCheck();
  };

  // Credit health calculations for searched user
  const available = account?.creditsAvailable ?? 0;
  const total = account?.totalCredits ?? 0;
  const used = Math.max(0, total - available);
  const remainingPct = total > 0 ? Math.round((available / total) * 100) : 0;

  let healthLabel = 'Healthy';
  let healthColor = '#10b981';
  let healthBg = 'rgba(16, 185, 129, 0.12)';

  if (remainingPct < 30) {
    healthLabel = 'Critical';
    healthColor = '#ef4444';
    healthBg = 'rgba(239, 68, 68, 0.12)';
  } else if (remainingPct <= 70) {
    healthLabel = 'Warning';
    healthColor = '#f59e0b';
    healthBg = 'rgba(245, 158, 11, 0.12)';
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* ── Header Title ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={18} style={{ color: 'var(--primary)' }} />
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Direct Member Credit Lookup</h3>
        </div>
        <span className="badge badge-primary" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <ShieldCheck size={11} /> Live User Table
        </span>
      </div>

      {/* ── Input Box Form ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          Search member profile by Name, Email, or Employee ID
        </label>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', position: 'relative' }}>
            <input
              type="text"
              value={prefix}
              onChange={e => { setPrefix(e.target.value); setValidationError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter name, email, or employee ID..."
              className="form-input"
              style={{
                height: '40px',
                fontSize: '0.9rem',
                borderColor: validationError ? 'var(--error)' : undefined
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <button
            onClick={handleCheck}
            disabled={state === 'loading'}
            className="btn btn-primary"
            style={{ padding: '0 1.25rem', height: '40px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 650 }}
          >
            {state === 'loading' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Zap size={14} />
            )}
            Verify Credits
          </button>
        </div>

        {/* Validation or Lookup State Alerts */}
        {validationError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--error)', fontSize: '0.75rem', fontWeight: 500 }}>
            <AlertTriangle size={12} /> {validationError}
          </div>
        )}
      </div>

      {/* ── Lookup Results Container (Matching Profile Page Layout) ── */}
      {state === 'found' && account && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1rem', backgroundColor: 'var(--bg-card)' }}>
          
          {/* 1. User Profile Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: 'var(--primary)', color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.1rem', overflow: 'hidden', flexShrink: 0
              }}>
                {account.photoURL ? (
                  <img src={account.photoURL} alt={account.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  account.name.charAt(0)
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                    {account.name}
                  </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                  <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{account.email}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                  ID: {account.employeeId}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
              <span className={`badge ${account.accountStatus === 'Active' || account.status === 'Active' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {account.accountStatus || account.status}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Plan: <strong style={{ color: 'var(--text-primary)' }}>{account.role} Plan</strong>
              </span>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

          {/* 2. CRM Credits Balance Panel */}
          <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-sidebar)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Coins size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>CRM Credits Balance</span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: healthColor, backgroundColor: healthBg, padding: '2px 8px', borderRadius: '10px' }}>
                {remainingPct}% Remaining ({healthLabel})
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', padding: '0.4rem 0' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Available Credits</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981', marginTop: '0.1rem' }}>{available.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Credits</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.1rem' }}>{total.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Credits Used</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{used.toLocaleString()}</div>
              </div>
            </div>

            {/* Credit Progress Track */}
            <div style={{ height: '6px', width: '100%', borderRadius: '3px', backgroundColor: 'var(--border)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: '3px',
                  backgroundColor: healthColor,
                  width: `${Math.min(remainingPct, 100)}%`,
                  transition: 'width 0.6s ease',
                  boxShadow: `0 0 8px ${healthColor}40`
                }}
              />
            </div>
          </div>

          {/* 3. Usage & Credits Dashboard (All 11 Credit Cards for searched user) */}
          <UsageCreditsDashboard
            user={account}
            dbUserCredits={{
              available: account.creditsAvailable,
              total: account.totalCredits,
            }}
            userName={account.name}
          />

          {/* 4. Verified Footer */}
          <div style={{ padding: '0.4rem 0.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckCircle2 size={13} /> Verified from User database
            </span>
            <button
              onClick={() => { setState('idle'); setPrefix(''); setAccount(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Clear Result
            </button>
          </div>

        </div>
      )}

      {state === 'not_found' && (
        <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-sidebar)', display: 'flex', gap: '0.6rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
          <span>No user found matching query <strong>{prefix}</strong> in organization database.</span>
        </div>
      )}

    </div>
  );
};

export default AccountLookup;
