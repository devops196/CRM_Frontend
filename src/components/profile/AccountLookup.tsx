import React, { useState } from 'react';
import { Search, XCircle, Loader2, AlertTriangle, Zap } from 'lucide-react';

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
interface AccountData {
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  creditsAssigned: number;
  creditsUsed: number;
  plan: string;
  purchasedDate: string;
  validityDate: string;
}

const MOCK_DB: Record<string, AccountData> = {
  'rajesh': {
    name: 'Rajesh Kesevan',
    email: 'rajesh@quickads.ai',
    status: 'Active',
    creditsAssigned: 5000,
    creditsUsed: 3120,
    plan: 'Pro Growth',
    purchasedDate: '2026-01-15',
    validityDate: '2027-01-15',
  },
  'devops': {
    name: 'DevOps Team',
    email: 'devops@quickads.ai',
    status: 'Active',
    creditsAssigned: 10000,
    creditsUsed: 950,
    plan: 'Enterprise',
    purchasedDate: '2025-11-01',
    validityDate: '2026-11-01',
  },
  'sarah': {
    name: 'Sarah Mitchell',
    email: 'sarah@quickads.ai',
    status: 'Inactive',
    creditsAssigned: 2000,
    creditsUsed: 2000,
    plan: 'Starter',
    purchasedDate: '2025-06-10',
    validityDate: '2026-06-10',
  },
  'alex': {
    name: 'Alex Turner',
    email: 'alex@quickads.ai',
    status: 'Active',
    creditsAssigned: 3000,
    creditsUsed: 450,
    plan: 'Business',
    purchasedDate: '2026-03-20',
    validityDate: '2027-03-20',
  },
};

async function fetchAccount(prefix: string): Promise<AccountData | null> {
  await new Promise(r => setTimeout(r, Math.random() * 500 + 200));
  return MOCK_DB[prefix.toLowerCase()] ?? null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

// Credit Progress Bar following the CSS Theme Variables
const CreditBar: React.FC<{ used: number; total: number }> = ({ used, total }) => {
  const pct = Math.min((used / total) * 100, 100);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Credit Consumption</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {used.toLocaleString()}
          <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}> / {total.toLocaleString()}</span>
        </span>
      </div>

      {/* Progress Track */}
      <div style={{ height: '8px', width: '100%', borderRadius: '4px', backgroundColor: 'var(--border)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: '4px',
            backgroundColor: 'var(--primary)',
            width: `${pct}%`,
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'var(--shadow-primary)'
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        <span>{pct.toFixed(0)}% Used</span>
        <span>{(total - used).toLocaleString()} Remaining</span>
      </div>
    </div>
  );
};

type FetchState = 'idle' | 'loading' | 'found' | 'not_found' | 'error';

export const AccountLookup: React.FC = () => {
  const [prefix, setPrefix] = useState('');
  const [state, setState] = useState<FetchState>('idle');
  const [account, setAccount] = useState<AccountData | null>(null);
  const [validationError, setValidationError] = useState('');

  const handleCheck = async () => {
    const trimmed = prefix.trim();
    if (!trimmed) {
      setValidationError('Please enter email prefix');
      return;
    }
    if (!/^[a-zA-Z0-9._+-]+$/.test(trimmed)) {
      setValidationError('Invalid email prefix characters');
      return;
    }
    setValidationError('');
    setState('loading');
    setAccount(null);

    try {
      const data = await fetchAccount(trimmed);
      if (data) {
        setAccount(data);
        setState('found');
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
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', height: '100%' }}>
      
      {/* ── Title Element with Icon ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={16} style={{ color: 'var(--primary)' }} />
          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Account Lookup</h3>
        </div>
        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Billing Directory</span>
      </div>

      {/* ── Input Box Form ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>Search member profile by email prefix</label>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', position: 'relative' }}>
            <input
              type="text"
              value={prefix}
              onChange={e => { setPrefix(e.target.value); setValidationError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. rajesh"
              className="form-input"
              style={{
                paddingRight: '6.5rem',
                height: '38px',
                fontSize: '0.9rem',
                borderColor: validationError ? 'var(--error)' : undefined
              }}
              autoComplete="off"
              spellCheck={false}
            />
            <span style={{
              position: 'absolute',
              right: '1px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 0.75rem',
              backgroundColor: 'var(--bg-sidebar)',
              borderLeft: '1px solid var(--border)',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              userSelect: 'none'
            }}>
              @quickads.ai
            </span>
          </div>

          <button
            onClick={handleCheck}
            disabled={state === 'loading'}
            className="btn btn-primary"
            style={{ padding: '0 1rem', height: '38px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            {state === 'loading' ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Zap size={12} />
            )}
            Verify
          </button>
        </div>

        {/* Validation or Lookup State Alerts */}
        {validationError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--error)', fontSize: '0.75rem', fontWeight: 500 }}>
            <AlertTriangle size={12} /> {validationError}
          </div>
        )}
        
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Quick links:{' '}
          {['rajesh', 'devops', 'sarah', 'alex'].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => { setPrefix(name); setValidationError(''); }}
              style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: 'var(--primary)', cursor: 'pointer', marginRight: '0.4rem' }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading Skeleton ── */}
      {state === 'loading' && (
        <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.8rem', opacity: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--border)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
              <div style={{ height: '12px', width: '40%', backgroundColor: 'var(--border)', borderRadius: '2px' }} />
              <div style={{ height: '8px', width: '60%', backgroundColor: 'var(--border)', borderRadius: '2px' }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Not Found / Error States ── */}
      {state === 'not_found' && (
        <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-sidebar)', display: 'flex', gap: '0.6rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
          <XCircle size={16} style={{ color: 'var(--error)', flexShrink: 0 }} />
          <span>Profile prefix <strong>{prefix}</strong> not registered under organization directory.</span>
        </div>
      )}

      {state === 'error' && (
        <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-sidebar)', display: 'flex', gap: '0.6rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
          <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
          <span>System error. Please check server telemetry logs.</span>
        </div>
      )}

      {/* ── Lookup Results Card ── */}
      {state === 'found' && account && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Result Card Header */}
          <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: 'var(--primary)', color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem'
              }}>
                {account.name.charAt(0)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{account.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{account.email}</span>
              </div>
            </div>
            <span className={`badge ${account.status === 'Active' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.65rem' }}>
              {account.status}
            </span>
          </div>

          {/* Details body */}
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Credit usage */}
            <CreditBar used={account.creditsUsed} total={account.creditsAssigned} />

            {/* Plan Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Selected Plan</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.15rem' }}>
                  {account.plan}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Validity Duration</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  {formatDate(account.purchasedDate)} - {formatDate(account.validityDate)}
                </span>
              </div>

            </div>
          </div>

          {/* Action clear */}
          <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-sidebar)' }}>
            <button
              onClick={() => { setState('idle'); setPrefix(''); setAccount(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Clear Result
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
export default AccountLookup;
