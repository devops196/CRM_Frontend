import React, { useState } from 'react';
import { Search, Loader2, AlertTriangle, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { TeamMember } from '../../types/team';
import { fetchTeamMembersFromApi } from '../../services/team.service';

function formatDate(iso?: string) {
  if (!iso) return 'Active Subscription';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

const CreditBar: React.FC<{ available: number; total: number; health: string }> = ({ available, total, health }) => {
  const used = Math.max(0, total - available);
  const remainingPct = total > 0 ? Math.round((available / total) * 100) : 0;
  
  let healthColor = '#10b981';
  if (health === 'Critical') healthColor = '#ef4444';
  else if (health === 'Warning') healthColor = '#f59e0b';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Credits Allocation</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {available.toLocaleString()}
          <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}> / {total.toLocaleString()} Available</span>
        </span>
      </div>

      <div style={{ height: '8px', width: '100%', borderRadius: '4px', backgroundColor: 'var(--border)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: '4px',
            backgroundColor: healthColor,
            width: `${Math.min(remainingPct, 100)}%`,
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 10px ${healthColor}40`
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        <span style={{ color: healthColor, fontWeight: 650 }}>{remainingPct}% Remaining ({health})</span>
        <span>{used.toLocaleString()} Used</span>
      </div>
    </div>
  );
};

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

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      
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

      {/* ── Lookup Results Card ── */}
      {state === 'found' && account && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--bg-card)' }}>
          
          <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: 'var(--primary)', color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden'
              }}>
                {account.photoURL ? (
                  <img src={account.photoURL} alt={account.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  account.name.charAt(0)
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{account.name}</span>
                  <span className="badge badge-primary" style={{ fontSize: '0.6rem' }}>{account.role}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{account.email} • ID: {account.employeeId}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge ${account.accountStatus === 'Active' || account.status === 'Active' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.65rem' }}>
                {account.accountStatus || account.status}
              </span>
            </div>
          </div>

          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CreditBar available={account.creditsAvailable} total={account.totalCredits} health={account.creditHealth} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Credits</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.15rem' }}>
                  {account.creditsAvailable.toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Allocation</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                  {account.totalCredits.toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subscription Date</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  {formatDate(account.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-sidebar)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <CheckCircle2 size={12} /> Verified from User database
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
