'use client';

import React from 'react';
import TeamMemberRow from './TeamMemberRow.jsx';

/**
 * Renders the Team Members Credits table.
 */
const TeamTable = ({ members, ownerId }) => {
  if (!members || members.length === 0) {
    return (
      <div
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-sidebar)',
        }}
      >
        No team members match your search or filter criteria.
      </div>
    );
  }

  return (
    <div className="table-container" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
      <table className="custom-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Available Credits</th>
            <th style={{ textAlign: 'right' }}>Total Credits</th>
            <th>Usage</th>
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
