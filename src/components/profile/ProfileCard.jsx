'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchTeamMembersFromApi,
  fetchMyTeamFromApi,
  addMemberToMyTeamApi,
  removeMemberFromMyTeamApi,
  allocateCreditsApi,
} from '../../services/team.service.js';
import MemberAvatar from '../team/MemberAvatar.jsx';
import AllocateCreditsModal from '../team/AllocateCreditsModal.jsx';
import UsageCreditsDashboard from './UsageCreditsDashboard.jsx';
import { Calendar, Mail, Shield, Zap, Coins, Loader, UserPlus, UserMinus, Users, Search, CheckCircle2 } from 'lucide-react';

const DEFAULT_OWNER_CREDITS = {
  generationCredits: 20,
  videoCredits: 10,
  voiceCredits: 8,
  voiceCloneCredits: 5,
  ugcCredits: 15,
  imageCredits: 12,
  imageToVideoCredits: 6,
  analysisCredits: 'Unlimited',
};

const ProfileCard = ({ authUser }) => {
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Owner available credits state
  const [ownerCredits, setOwnerCredits] = useState(DEFAULT_OWNER_CREDITS);

  // My Team management state
  const [myTeam, setMyTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Modal State for Credit Allocation
  const [selectedUserForAllocation, setSelectedUserForAllocation] = useState(null);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);

  // Load user profile from DB
  useEffect(() => {
    if (!authUser?.email) return;
    setLoading(true);
    fetchTeamMembersFromApi({ search: authUser.email })
      .then((members) => {
        const list = Array.isArray(members) ? members : [];
        const match = list.find(
          (m) => m.email && m.email.toLowerCase() === authUser.email.toLowerCase()
        );
        setDbUser(match ?? list[0] ?? null);
      })
      .catch((err) => {
        console.error('Failed to load DB user:', err);
      })
      .finally(() => setLoading(false));
  }, [authUser?.email]);

  // Load explicit Team members from DB
  const loadMyTeam = useCallback(async () => {
    if (!authUser?.email) return;
    setTeamLoading(true);
    try {
      const team = await fetchMyTeamFromApi(authUser.email);
      setMyTeam(team);
    } catch (err) {
      console.error('Failed to load user team:', err);
    } finally {
      setTeamLoading(false);
    }
  }, [authUser?.email]);

  useEffect(() => {
    loadMyTeam();
  }, [loadMyTeam]);

  // Search DB users to add to team
  const handleSearchDbUsers = useCallback(async (q) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await fetchTeamMembersFromApi({ search: trimmed });
      const filtered = results.filter(
        (m) => m.email.toLowerCase() !== authUser.email.toLowerCase()
      );
      setSearchResults(filtered);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [authUser?.email]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearchDbUsers(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearchDbUsers]);

  // Open Credit Allocation Modal
  const handleOpenAllocationModal = (user) => {
    setSelectedUserForAllocation(user);
    setIsAllocationModalOpen(true);
  };

  // Confirm Credit Allocation & Add Member
  const handleConfirmAllocation = async (allocations, targetUser) => {
    setActionMessage(null);

    // 1. Deduct allocated credits from owner's credits state
    setOwnerCredits((prev) => ({
      ...prev,
      generationCredits: Math.max(0, prev.generationCredits - (allocations.generationCredits || 0)),
      videoCredits: Math.max(0, prev.videoCredits - (allocations.videoCredits || 0)),
      voiceCredits: Math.max(0, prev.voiceCredits - (allocations.voiceCredits || 0)),
      voiceCloneCredits: Math.max(0, prev.voiceCloneCredits - (allocations.voiceCloneCredits || 0)),
      ugcCredits: Math.max(0, prev.ugcCredits - (allocations.ugcCredits || 0)),
      imageCredits: Math.max(0, prev.imageCredits - (allocations.imageCredits || 0)),
      imageToVideoCredits: Math.max(0, prev.imageToVideoCredits - (allocations.imageToVideoCredits || 0)),
    }));

    // 2. Call API to register member & allocate credits in DB
    const res = await addMemberToMyTeamApi(authUser.email, targetUser.email);
    await allocateCreditsApi(authUser.email, targetUser.employeeId || targetUser.id || targetUser.email, allocations);
    
    // 3. Attach allocation data to teammate state
    const newMemberWithAllocations = {
      ...targetUser,
      allocatedCredits: { ...allocations },
      creditsAvailable: Object.values(allocations).reduce((a, b) => a + (Number(b) || 0), 0),
      totalCredits: Object.values(allocations).reduce((a, b) => a + (Number(b) || 0), 0),
      status: 'Active',
      accountStatus: 'Active',
    };

    setMyTeam((prev) => {
      const exists = prev.some((m) => m.email.toLowerCase() === targetUser.email.toLowerCase());
      if (exists) {
        return prev.map((m) =>
          m.email.toLowerCase() === targetUser.email.toLowerCase()
            ? { ...m, allocatedCredits: { ...allocations } }
            : m
        );
      }
      return [...prev, newMemberWithAllocations];
    });

    setSearchQuery('');
    setSearchResults([]);
    setActionMessage(`Successfully allocated credits and added ${targetUser.name} to your team.`);
    setIsAllocationModalOpen(false);
    setSelectedUserForAllocation(null);
  };

  // Remove member from team
  const handleRemoveMember = async (targetEmail) => {
    setActionMessage(null);
    const res = await removeMemberFromMyTeamApi(authUser.email, targetEmail);
    if (res.success) {
      setMyTeam((prev) => prev.filter((m) => m.email.toLowerCase() !== targetEmail.toLowerCase()));
      setActionMessage('Team member removed.');
    } else {
      setActionMessage(res.message || 'Failed to remove member.');
    }
  };

  const memberSinceDate = authUser?.memberSince ? new Date(authUser.memberSince) : new Date();
  const memberSinceFormatted = !isNaN(memberSinceDate.getTime())
    ? memberSinceDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'July 24, 2026';

  // Compute total numeric available credits for logged in owner
  const available = Object.values(ownerCredits).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);
  const total = dbUser?.totalCredits || 76;
  const name = dbUser?.name || authUser?.name;
  const role = dbUser?.role || authUser?.role;
  const status = dbUser?.accountStatus || dbUser?.status || '—';
  const photoURL =
    dbUser?.photoURL && dbUser.photoURL.trim() !== '' ? dbUser.photoURL : undefined;

  const used = Math.max(0, total - available);
  const remainingPct = total > 0 ? Math.round((available / total) * 100) : 0;
  const usedPct = total > 0 ? Math.round((used / total) * 100) : 0;

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

  // Enriched user object for UsageCreditsDashboard
  const userForDashboard = {
    ...dbUser,
    generationCreditsTotal: ownerCredits.generationCredits,
    generationCreditsUsed: 0,
    videoCreditsTotal: ownerCredits.videoCredits,
    videoCreditsUsed: 0,
    voiceCreditsTotal: ownerCredits.voiceCredits,
    voiceCreditsUsed: 0,
    voiceCloneCreditsTotal: ownerCredits.voiceCloneCredits,
    voiceCloneCreditsUsed: 0,
    ugcCreditsTotal: ownerCredits.ugcCredits,
    ugcCreditsUsed: 0,
    imageCreditsTotal: ownerCredits.imageCredits,
    imageCreditsUsed: 0,
    imageToVideoCreditsTotal: ownerCredits.imageToVideoCredits,
    imageToVideoCreditsUsed: 0,
    analysisCreditsUnlimited: true,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '850px', margin: '0 auto' }}>
      
      {/* ── Main Profile Card ── */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <MemberAvatar
            photoURL={photoURL}
            initials={authUser?.initials}
            name={name}
            size={64}
            role={role}
          />
          <div>
            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              {name}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
              <Mail size={12} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{authUser?.email}</span>
            </div>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                <Shield size={10} /> {role}
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                {status}
              </span>
              {!loading && (
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: healthColor, backgroundColor: healthBg, padding: '2px 8px', borderRadius: '10px' }}>
                  {remainingPct}% Credits ({healthLabel})
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-sidebar)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Coins size={16} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Your CRM Credits Balance</span>
            </div>
            {!loading && (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: healthColor }}>
                {remainingPct}% Remaining
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
              Loading credits from database…
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>{available.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Balance</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{total.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Allocated / Used</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{used.toLocaleString()} ({usedPct}%)</div>
                </div>
              </div>

              <div style={{ height: '8px', width: '100%', borderRadius: '4px', backgroundColor: 'var(--border)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: '4px',
                    backgroundColor: healthColor,
                    width: `${Math.min(remainingPct, 100)}%`,
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
            </>
          )}
        </div>

        <UsageCreditsDashboard user={userForDashboard} dbUserCredits={{ available, total }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <ProfileField
            icon={<Shield size={13} style={{ color: 'var(--primary)' }} />}
            label="Role"
            value={role}
          />
          <ProfileField
            icon={<Zap size={13} style={{ color: 'var(--success)' }} />}
            label="Status"
            value={status}
          />
          <ProfileField
            icon={<Calendar size={13} style={{ color: 'var(--info)' }} />}
            label="Member Since"
            value={memberSinceFormatted}
          />
          <ProfileField
            icon={<Zap size={13} style={{ color: 'var(--warning)' }} />}
            label="Account"
            value={dbUser?.accountStatus ?? '—'}
          />
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>My Team ({myTeam.length})</h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Explicitly added team members
          </span>
        </div>

        {actionMessage && (
          <div style={{ padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(204, 255, 0, 0.08)', border: '1px solid rgba(204, 255, 0, 0.25)', fontSize: '0.82rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--primary)' }} />
            <span>{actionMessage}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Add User to My Team (Search DB by Name, Email, or Employee ID)
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Type name or email to search database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.2rem', height: '38px', fontSize: '0.85rem', flex: 1 }}
              />
            </div>
          </div>

          {searching && (
            <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Searching database...
            </div>
          )}

          {searchQuery.trim() !== '' && !searching && searchResults.length > 0 && (
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-card)', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
              {searchResults.map((user) => {
                const isAlreadyInTeam = myTeam.some((m) => m.email.toLowerCase() === user.email.toLowerCase());
                return (
                  <div
                    key={user.id}
                    style={{ padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', fontSize: '0.82rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <MemberAvatar photoURL={user.photoURL ?? undefined} initials={user.initials} name={user.name} size={28} />
                      <div>
                        <div style={{ fontWeight: 650 }}>{user.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      </div>
                    </div>

                    {isAlreadyInTeam ? (
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Added</span>
                    ) : (
                      <button
                        onClick={() => handleOpenAllocationModal(user)}
                        className="btn btn-primary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', gap: '0.3rem' }}
                      >
                        <UserPlus size={12} /> Add to Team
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {searchQuery.trim() !== '' && !searching && searchResults.length === 0 && (
            <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              No matching user found in database.
            </div>
          )}
        </div>

        {teamLoading ? (
          <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
            Loading team members...
          </div>
        ) : myTeam.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)' }}>
            No team members added yet. Search database users above to explicitly add them to your team.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {myTeam.map((member) => (
              <div
                key={member.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bg-sidebar)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MemberAvatar photoURL={member.photoURL ?? undefined} initials={member.initials} name={member.name} size={36} />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge ${member.status === 'Active' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.65rem' }}>
                      {member.status || 'Active'}
                    </span>
                    <button
                      onClick={() => handleRemoveMember(member.email)}
                      className="btn btn-secondary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', color: 'var(--error)', borderColor: 'var(--border)' }}
                      title="Remove from team"
                    >
                      <UserMinus size={12} /> Remove
                    </button>
                  </div>
                </div>

                {/* Display Allocated Credit Breakdown for Teammate */}
                {member.allocatedCredits && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.3rem', borderTop: '1px dashed var(--border)' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Allocated:</span>
                    {member.allocatedCredits.generationCredits > 0 && (
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(204,255,0,0.1)', color: '#ccff00', border: '1px solid rgba(204,255,0,0.25)' }}>
                        Gen: {member.allocatedCredits.generationCredits}
                      </span>
                    )}
                    {member.allocatedCredits.videoCredits > 0 && (
                      <span className="badge badge-info" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}>
                        Video: {member.allocatedCredits.videoCredits}
                      </span>
                    )}
                    {member.allocatedCredits.voiceCredits > 0 && (
                      <span className="badge badge-info" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.25)' }}>
                        Voice: {member.allocatedCredits.voiceCredits}
                      </span>
                    )}
                    {member.allocatedCredits.voiceCloneCredits > 0 && (
                      <span className="badge badge-warning" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}>
                        Clone: {member.allocatedCredits.voiceCloneCredits}
                      </span>
                    )}
                    {member.allocatedCredits.ugcCredits > 0 && (
                      <span className="badge badge-warning" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>
                        UGC: {member.allocatedCredits.ugcCredits}
                      </span>
                    )}
                    {member.allocatedCredits.imageCredits > 0 && (
                      <span className="badge badge-success" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                        Image: {member.allocatedCredits.imageCredits}
                      </span>
                    )}
                    {member.allocatedCredits.imageToVideoCredits > 0 && (
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(236,72,153,0.1)', color: '#f472b6', border: '1px solid rgba(236,72,153,0.25)' }}>
                        Img-to-Vid: {member.allocatedCredits.imageToVideoCredits}
                      </span>
                    )}
                    <span className="badge badge-info" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
                      Analysis: Unlimited
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Credit Allocation Modal */}
      {selectedUserForAllocation && (
        <AllocateCreditsModal
          isOpen={isAllocationModalOpen}
          onClose={() => {
            setIsAllocationModalOpen(false);
            setSelectedUserForAllocation(null);
          }}
          targetUser={selectedUserForAllocation}
          ownerAvailableCredits={ownerCredits}
          onConfirmAllocation={handleConfirmAllocation}
        />
      )}
    </div>
  );
};

const ProfileField = ({ icon, label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
      {icon}
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  </div>
);

export default ProfileCard;

