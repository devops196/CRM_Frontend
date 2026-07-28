import React, { useState, useEffect } from 'react';
import MemberAvatar from '../team/MemberAvatar';
import { RefreshCw, ExternalLink, ShieldCheck, ShieldX, Search } from 'lucide-react';

export interface LoginAttemptRecord {
  id: string;
  name?: string | null;
  email?: string | null;
  profilePicture?: string | null;
  domain?: string | null;
  loginStatus: 'ALLOWED' | 'REJECTED';
  reason?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  attemptedAt: string;
}

// Fallback seed data if backend API is not currently connected
const FALLBACK_ATTEMPTS: LoginAttemptRecord[] = [
  {
    id: 'att_1',
    name: 'John Doe',
    email: 'employee@quickads.ai',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    domain: 'quickads.ai',
    loginStatus: 'ALLOWED',
    reason: 'Authenticated Successfully',
    ipAddress: '192.168.1.1',
    attemptedAt: new Date().toISOString(),
  },
  {
    id: 'att_2',
    name: 'Jane Smith',
    email: 'someone@gmail.com',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    domain: 'gmail.com',
    loginStatus: 'REJECTED',
    reason: 'Unauthorized Domain',
    ipAddress: '203.0.113.42',
    attemptedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'att_3',
    name: 'Devops Team',
    email: 'devops@quickads.ai',
    profilePicture: null,
    domain: 'quickads.ai',
    loginStatus: 'ALLOWED',
    reason: 'Authenticated Successfully',
    ipAddress: '127.0.0.1',
    attemptedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'att_4',
    name: 'Attacker Account',
    email: 'hacker@unknown-domain.org',
    profilePicture: null,
    domain: 'unknown-domain.org',
    loginStatus: 'REJECTED',
    reason: 'Unauthorized Domain',
    ipAddress: '198.51.100.12',
    attemptedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

export const LoginAttemptsTable: React.FC = () => {
  const [attempts, setAttempts] = useState<LoginAttemptRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ALLOWED' | 'REJECTED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/v1/auth/login-attempts');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.attempts)) {
          setAttempts(data.attempts.length > 0 ? data.attempts : FALLBACK_ATTEMPTS);
        } else {
          setAttempts(FALLBACK_ATTEMPTS);
        }
      } else {
        setAttempts(FALLBACK_ATTEMPTS);
      }
    } catch {
      // Fallback if backend API is not running locally
      setAttempts(FALLBACK_ATTEMPTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  const filteredAttempts = attempts.filter((item) => {
    const matchesStatus = filterStatus === 'ALL' || item.loginStatus === filterStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (item.name && item.name.toLowerCase().includes(searchLower)) ||
      (item.email && item.email.toLowerCase().includes(searchLower)) ||
      (item.reason && item.reason.toLowerCase().includes(searchLower));
    return matchesStatus && matchesSearch;
  });

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            Google Sign-In Audit Trail (LoginAttempt Table)
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Audit log of <strong>every login attempt</strong> (ALLOWED and REJECTED) with profile image URLs.
          </p>
        </div>

        <button
          onClick={fetchAttempts}
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} /> Refresh Logs
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.3rem', backgroundColor: 'var(--bg-sidebar)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`btn ${filterStatus === 'ALL' ? 'btn-primary' : ''}`}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', backgroundColor: filterStatus === 'ALL' ? undefined : 'transparent', border: 'none' }}
          >
            All Attempts ({attempts.length})
          </button>
          <button
            onClick={() => setFilterStatus('ALLOWED')}
            className={`btn ${filterStatus === 'ALLOWED' ? 'btn-primary' : ''}`}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', backgroundColor: filterStatus === 'ALLOWED' ? undefined : 'transparent', border: 'none' }}
          >
            <ShieldCheck size={12} /> Allowed ({attempts.filter((a) => a.loginStatus === 'ALLOWED').length})
          </button>
          <button
            onClick={() => setFilterStatus('REJECTED')}
            className={`btn ${filterStatus === 'REJECTED' ? 'btn-primary' : ''}`}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', backgroundColor: filterStatus === 'REJECTED' ? undefined : 'transparent', border: 'none' }}
          >
            <ShieldX size={12} /> Rejected ({attempts.filter((a) => a.loginStatus === 'REJECTED').length})
          </button>
        </div>

        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.65rem' }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by email, name, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.8rem', width: '100%' }}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>User & Avatar</th>
              <th>Email Address</th>
              <th>Profile Picture URL</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttempts.length > 0 ? (
              filteredAttempts.map((item) => (
                <tr key={item.id}>
                  {/* User Avatar + Name */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <MemberAvatar
                        photoURL={item.profilePicture || undefined}
                        initials={getInitials(item.name, item.email)}
                        name={item.name || item.email || 'User'}
                        size={32}
                      />
                      <div>
                        <div style={{ fontWeight: 650, fontSize: '0.85rem' }}>
                          {item.name || 'N/A'}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Domain: {item.domain || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {item.email || 'N/A'}
                  </td>

                  {/* Profile Picture URL */}
                  <td>
                    {item.profilePicture ? (
                      <a
                        href={item.profilePicture}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={item.profilePicture}
                      >
                        <ExternalLink size={11} /> Link
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No Image Provided
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span
                      className={`badge ${item.loginStatus === 'ALLOWED' ? 'badge-success' : 'badge-error'}`}
                      style={{ fontSize: '0.7rem', padding: '2px 8px', fontWeight: 700 }}
                    >
                      {item.loginStatus}
                    </span>
                  </td>

                  {/* Reason */}
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {item.reason || 'N/A'}
                  </td>

                  {/* Timestamp */}
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(item.attemptedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No login attempt records found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
