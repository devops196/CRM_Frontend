'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { fetchTeamMembersFromApi, adminUpdateCreditsApi } from '../services/team.service.js';
import MemberAvatar from '../components/team/MemberAvatar.jsx';
import AdminAddCreditsModal from '../components/team/AdminAddCreditsModal.jsx';
import {
  CreditCard,
  Search,
  Filter,
  Users,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Video,
  Mic,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Lock,
  ArrowRight
} from 'lucide-react';

export function AdminCreditControlView() {
  const { authUser, user: legacyUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  // Selected user for credit editing modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateMode, setUpdateMode] = useState('set'); // 'set' or 'add'
  const [resetUsed, setResetUsed] = useState(false);
  
  // Modal credit form state
  const [creditForm, setCreditForm] = useState({
    generationCredits: 0,
    videoCredits: 0,
    voiceCredits: 0,
    voiceCloneCredits: 0,
    ugcCredits: 0,
    imageCredits: 0,
    imageToVideoCredits: 0,
  });

  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Determine if logged-in user is admin
  const currentRole = (authUser?.role || legacyUser?.role || '').toUpperCase();
  const isAdmin = currentRole === 'ADMIN';

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTeamMembersFromApi();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users for Credit Control:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin, loadUsers]);

  // Filtered users list based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search.trim() ||
        (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.employeeId || '').toLowerCase().includes(search.toLowerCase());

      const matchesHealth =
        healthFilter === 'ALL' ||
        (u.creditHealth || '').toLowerCase() === healthFilter.toLowerCase();

      const matchesRole =
        roleFilter === 'ALL' ||
        (u.role || '').toUpperCase() === roleFilter.toUpperCase();

      return matchesSearch && matchesHealth && matchesRole;
    });
  }, [users, search, healthFilter, roleFilter]);

  // Overall workspace stats
  const totalAllocatedCredits = useMemo(() => {
    return users.reduce((sum, u) => sum + (u.totalCredits || 0), 0);
  }, [users]);

  const totalAvailableCredits = useMemo(() => {
    return users.reduce((sum, u) => sum + (u.creditsAvailable || 0), 0);
  }, [users]);

  const criticalUsersCount = useMemo(() => {
    return users.filter((u) => u.creditHealth === 'Critical').length;
  }, [users]);

  const handleOpenEditModal = (u) => {
    setSelectedUser(u);
    setUpdateMode('set');
    setResetUsed(false);
    setCreditForm({
      generationCredits: u.generationCreditsTotal ?? u.totalCredits ?? 50,
      videoCredits: u.videoCreditsTotal ?? 10,
      voiceCredits: u.voiceCreditsTotal ?? 10,
      voiceCloneCredits: u.voiceCloneCreditsTotal ?? 5,
      ugcCredits: u.ugcCreditsTotal ?? 15,
      imageCredits: u.imageCreditsTotal ?? 20,
      imageToVideoCredits: u.imageToVideoCreditsTotal ?? 5,
    });
    setIsModalOpen(true);
  };

  const handleSaveCreditUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSaving(true);
    setNotification(null);

    const callerEmail = authUser?.email || 'dhanush@quickads.ai';
    const targetId = selectedUser.employeeId || selectedUser.id || selectedUser.email;

    const result = await adminUpdateCreditsApi(
      callerEmail,
      targetId,
      creditForm,
      updateMode,
      resetUsed
    );

    setSaving(false);

    if (result.success && result.data) {
      setNotification({
        type: 'success',
        message: `Successfully updated credit allocations for ${selectedUser.name}!`,
      });
      // Update local state persistently
      setUsers((prev) =>
        prev.map((u) => (u.id === result.data.id || u.employeeId === result.data.employeeId ? result.data : u))
      );
      setIsModalOpen(false);
      setSelectedUser(null);
    } else {
      setNotification({
        type: 'error',
        message: result.message || 'Failed to update credit allocation in database.',
      });
    }
  };

  // Access Denied guard if non-admin attempts to view
  if (!isAdmin) {
    return (
      <div style={{ padding: '3rem 1.5rem', maxWidth: '650px', margin: '0 auto', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
        <div className="card" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.04)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)' }}>Access Denied</h2>
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '440px' }}>
            Admin authorization required. Credit Control operations are restricted to workspace administrators.
          </p>
          <span className="badge badge-error" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }}>
            ROLE: CUSTOMER / NON-ADMIN
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', fontFamily: 'var(--font-sans)' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={12} /> Admin Console
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Workspace Credit Control
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Manage, reallocate, and persist user credit limits directly in the database.
          </p>
        </div>

        <button
          onClick={loadUsers}
          disabled={loading}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', gap: '0.4rem' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Database
        </button>
      </div>

      {/* Persistent Notification Alert */}
      {notification && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: notification.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            border: `1px solid ${notification.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            color: notification.type === 'error' ? '#ef4444' : '#10b981',
            fontSize: '0.9rem',
            fontWeight: 550,
          }}
        >
          {notification.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Workspace Metric Highlights */}
      <div className="grid-4" style={{ gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Accounts</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{users.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Synced from Database</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Allocated Total Credits</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalAllocatedCredits.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600 }}>Across all AI generation tools</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Available Balance</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>{totalAvailableCredits.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ready for immediate usage</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Critical Health Alert</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: criticalUsersCount > 0 ? '#ef4444' : 'var(--text-primary)' }}>{criticalUsersCount}</div>
          <div style={{ fontSize: '0.75rem', color: criticalUsersCount > 0 ? '#ef4444' : 'var(--text-muted)', fontWeight: 600 }}>Users under 30% remaining</div>
        </div>
      </div>

      {/* Control Bar: Search & Filtering */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search user by name, email, or Employee ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Health:</span>
            {['ALL', 'Healthy', 'Warning', 'Critical'].map((hp) => (
              <button
                key={hp}
                onClick={() => setHealthFilter(hp)}
                className={`btn ${healthFilter === hp ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              >
                {hp}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Role:</span>
            {['ALL', 'ADMIN', 'CUSTOMER'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`btn ${roleFilter === r ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main User Credit Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>User Account</th>
              <th>Role</th>
              <th>Generation Credits</th>
              <th>Specialized AI Credits</th>
              <th>Credit Health</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading workspace credit balances from database...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No matching user records found in database.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const total = u.totalCredits || 0;
                const avail = u.creditsAvailable || 0;
                const used = Math.max(0, total - avail);
                const pct = u.remainingPercentage ?? (total > 0 ? Math.round((avail / total) * 100) : 0);

                let healthBadgeClass = 'badge-success';
                if (u.creditHealth === 'Critical') healthBadgeClass = 'badge-error';
                else if (u.creditHealth === 'Warning') healthBadgeClass = 'badge-warning';

                return (
                  <tr key={u.id || u.employeeId}>
                    <td>
                      <div
                        onClick={() => {
                          const identifier = u.employeeId || u.id || u.email;
                          if (typeof window !== 'undefined') {
                            window.history.pushState({}, '', `/lookup/${encodeURIComponent(identifier)}`);
                            window.dispatchEvent(new Event('popstate'));
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                        title="View user credit details"
                      >
                        <MemberAvatar
                          photoURL={u.photoURL}
                          initials={u.initials || u.name?.charAt(0) || 'U'}
                          name={u.name || 'User'}
                          size={38}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 650, color: 'var(--primary)', fontSize: '0.92rem', textDecoration: 'underline' }}>
                            {u.name}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                            {u.employeeId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${u.role === 'Admin' ? 'badge-primary' : 'badge-info'}`} style={{ fontSize: '0.7rem' }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '160px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                          <span>{avail.toLocaleString()} Avail</span>
                          <span style={{ color: 'var(--text-muted)' }}>/ {total.toLocaleString()} Total</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min(100, Math.max(0, pct))}%`,
                              height: '100%',
                              backgroundColor: u.creditHealth === 'Critical' ? '#ef4444' : u.creditHealth === 'Warning' ? '#f59e0b' : 'var(--primary)',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                        <span className="badge badge-secondary" title="Video Credits" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border)' }}>
                          <Video size={10} /> {u.videoCreditsTotal ?? 0}
                        </span>
                        <span className="badge badge-secondary" title="Voice Credits" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border)' }}>
                          <Mic size={10} /> {u.voiceCreditsTotal ?? 0}
                        </span>
                        <span className="badge badge-secondary" title="UGC Credits" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border)' }}>
                          <Sparkles size={10} /> {u.ugcCreditsTotal ?? 0}
                        </span>
                        <span className="badge badge-secondary" title="Image Credits" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border)' }}>
                          <ImageIcon size={10} /> {u.imageCreditsTotal ?? 0}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${healthBadgeClass}`} style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                        {(u.creditHealth || 'Healthy').toUpperCase()} ({pct}%)
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEditModal(u)}
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.35rem' }}
                      >
                        <Sliders size={13} /> Manage Credits
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Manage Credits Modal */}
      {isModalOpen && selectedUser && (
        <AdminAddCreditsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          targetUser={selectedUser}
          onConfirmAddCredits={async (deltas, targetUser, updatedTotals) => {
            const callerEmail = authUser?.email || 'dhanush@quickads.ai';
            const targetId = targetUser.employeeId || targetUser.id || targetUser.email;
            setSaving(true);
            const result = await adminUpdateCreditsApi(
              callerEmail,
              targetId,
              updatedTotals || deltas,
              'set',
              resetUsed
            );
            setSaving(false);
            if (result.success && result.data) {
              setNotification({
                type: 'success',
                message: `Successfully updated credit allocations for ${selectedUser.name}!`,
              });
              setUsers((prev) =>
                prev.map((u) => {
                  if (u.id === selectedUser.id || u.employeeId === selectedUser.employeeId || u.email === selectedUser.email) {
                    const merged = { ...u, ...result.data };
                    const genTotal = merged.generationCreditsTotal ?? merged.generationCredits ?? u.generationCreditsTotal ?? u.totalCredits ?? 0;
                    const vidTotal = merged.videoCreditsTotal ?? merged.videoCredits ?? u.videoCreditsTotal ?? 0;
                    const voiceTotal = merged.voiceCreditsTotal ?? merged.voiceCredits ?? u.voiceCreditsTotal ?? 0;
                    const voiceCloneTotal = merged.voiceCloneCreditsTotal ?? merged.voiceCloneCredits ?? u.voiceCloneCreditsTotal ?? 0;
                    const ugcTotal = merged.ugcCreditsTotal ?? merged.ugcCredits ?? u.ugcCreditsTotal ?? 0;
                    const imgTotal = merged.imageCreditsTotal ?? merged.imageCredits ?? u.imageCreditsTotal ?? 0;
                    const imgVidTotal = merged.imageToVideoCreditsTotal ?? merged.imageToVideoCredits ?? u.imageToVideoCreditsTotal ?? 0;
                    const totalCredits = genTotal;
                    const avail = merged.creditsAvailable ?? Math.max(0, totalCredits - (u.generationCreditsUsed || 0));
                    const remPct = totalCredits > 0 ? Math.round((avail / totalCredits) * 100) : 100;
                    let health = 'Healthy';
                    if (remPct < 30) health = 'Critical';
                    else if (remPct <= 70) health = 'Warning';

                    return {
                      ...merged,
                      generationCreditsTotal: genTotal,
                      videoCreditsTotal: vidTotal,
                      voiceCreditsTotal: voiceTotal,
                      voiceCloneCreditsTotal: voiceCloneTotal,
                      ugcCreditsTotal: ugcTotal,
                      imageCreditsTotal: imgTotal,
                      imageToVideoCreditsTotal: imgVidTotal,
                      totalCredits,
                      creditsAvailable: avail,
                      remainingPercentage: remPct,
                      creditHealth: health,
                    };
                  }
                  return u;
                })
              );
              setIsModalOpen(false);
              setSelectedUser(null);
              return true;
            } else {
              setNotification({
                type: 'error',
                message: result.message || 'Failed to update credit allocation in database.',
              });
              return false;
            }
          }}
        />
      )}
    </div>
  );
}
