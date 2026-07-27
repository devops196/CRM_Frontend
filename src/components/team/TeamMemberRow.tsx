import React from 'react';
import type { TeamMember } from '../../types/team';
import MemberAvatar from './MemberAvatar';

interface TeamMemberRowProps {
  member: TeamMember;
  isOwner?: boolean;
}

/**
 * Renders a single row in the Team Management table.
 * Displays: avatar + name + email, role badge, status badge.
 */
const TeamMemberRow: React.FC<TeamMemberRowProps> = ({ member, isOwner = false }) => {
  return (
    <tr style={{ transition: 'background-color var(--transition-fast)' }}>
      {/* Member column — avatar + name + email */}
      <td style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MemberAvatar
            photoURL={member.photoURL}
            initials={member.initials}
            name={member.name}
            size={36}
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
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px' }}>
              {member.email}
            </div>
          </div>
        </div>
      </td>

      {/* Role column */}
      <td style={{ padding: '0.85rem 1.25rem' }}>
        <span
          className={member.role === 'Admin' ? 'badge badge-primary' : 'badge badge-info'}
          style={{ fontSize: '0.7rem' }}
        >
          {member.role}
        </span>
      </td>

      {/* Status column */}
      <td style={{ padding: '0.85rem 1.25rem' }}>
        <span
          className={member.status === 'Active' ? 'badge badge-success' : 'badge badge-warning'}
          style={{ fontSize: '0.7rem' }}
        >
          {member.status}
        </span>
      </td>
    </tr>
  );
};

export default TeamMemberRow;
