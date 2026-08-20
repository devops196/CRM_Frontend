'use client';

import React from 'react';
import MemberAvatar from './MemberAvatar.jsx';

/**
 * Renders a single row in the Team Members Credits table.
 */
const TeamMemberRow = ({ member, isOwner = false }) => {
  const available = member.creditsAvailable ?? 0;
  const total = member.totalCredits ?? 0;
  const remainingPct = member.remainingPercentage ?? (total > 0 ? Math.round((available / total) * 100) : 0);

  let healthLabel = member.creditHealth || 'Healthy';
  let healthColor = '#10b981';
  let healthBg = 'rgba(16, 185, 129, 0.12)';
  let healthBorder = 'rgba(16, 185, 129, 0.3)';

  if (remainingPct < 30) {
    healthLabel = 'Critical';
    healthColor = '#ef4444';
    healthBg = 'rgba(239, 68, 68, 0.12)';
    healthBorder = 'rgba(239, 68, 68, 0.3)';
  } else if (remainingPct <= 70) {
    healthLabel = 'Warning';
    healthColor = '#f59e0b';
    healthBg = 'rgba(245, 158, 11, 0.12)';
    healthBorder = 'rgba(245, 158, 11, 0.3)';
  }

  return (
    <tr style={{ transition: 'background-color var(--transition-fast)' }}>
      <td style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MemberAvatar
            photoURL={member.photoURL || undefined}
            initials={member.initials}
            name={member.name}
            size={38}
            role={member.role}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 650, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                {member.name}
              </span>
              {isOwner && (
                <span
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    backgroundColor: 'var(--primary-glow)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  You
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {member.email}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--bg-sidebar)',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                  padding: '0 4px',
                }}
              >
                {member.employeeId || 'EMP-1001'}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td style={{ padding: '0.85rem 1.25rem' }}>
        <span
          className={member.role === 'Admin' ? 'badge badge-primary' : 'badge badge-info'}
          style={{ fontSize: '0.7rem' }}
        >
          {member.role}
        </span>
      </td>

      <td style={{ padding: '0.85rem 1.25rem' }}>
        <span
          className={member.accountStatus === 'Active' || member.status === 'Active' ? 'badge badge-success' : 'badge badge-error'}
          style={{ fontSize: '0.7rem' }}
        >
          {member.accountStatus || member.status || 'Active'}
        </span>
      </td>

      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
        {available.toLocaleString()}
      </td>

      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        {total.toLocaleString()}
      </td>

      <td style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: '150px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: healthColor }}>
              {remainingPct}% Remaining
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: healthColor,
                backgroundColor: healthBg,
                border: `1px solid ${healthBorder}`,
                borderRadius: '12px',
                padding: '1px 7px',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              {healthLabel}
            </span>
          </div>

          <div
            style={{
              height: '6px',
              width: '100%',
              backgroundColor: 'var(--border)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(remainingPct, 100)}%`,
                backgroundColor: healthColor,
                borderRadius: '3px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TeamMemberRow;
