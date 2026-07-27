import React from 'react';
import type { TeamMember } from '../../types/team';
import TeamMemberRow from './TeamMemberRow';

interface TeamTableProps {
  members: TeamMember[];
  /** ID of the owner/logged-in user to highlight with "You" badge */
  ownerId?: string;
}

/**
 * Renders the complete team members table.
 * Columns: Member, Role, Status.
 * The owner (logged-in user) is always first and labeled "You".
 */
const TeamTable: React.FC<TeamTableProps> = ({ members, ownerId }) => {
  if (members.length === 0) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        No team members yet. Add your first member using the button above.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <TeamMemberRow
              key={member.id}
              member={member}
              isOwner={ownerId ? member.id === ownerId : false}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;
