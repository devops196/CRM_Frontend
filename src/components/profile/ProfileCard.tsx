import React from 'react';
import type { AuthUser } from '../../types/user';
import MemberAvatar from '../team/MemberAvatar';
import { Calendar, Mail, Shield, Zap } from 'lucide-react';

interface ProfileCardProps {
  authUser: AuthUser;
}

/**
 * Displays the authenticated user's profile information.
 * Visually identical to the existing settings card — only data is replaced
 * with real Google account info.
 */
const ProfileCard: React.FC<ProfileCardProps> = ({ authUser }) => {
  // Format the "Member Since" date to a readable string
  const memberSinceFormatted = new Date(authUser.memberSince).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Profile header — avatar + name + email */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <MemberAvatar
          photoURL={authUser.photoURL}
          initials={authUser.initials}
          name={authUser.name}
          size={64}
          role={authUser.role}
        />
        <div>
          <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            {authUser.name}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
            <Mail size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{authUser.email}</span>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
              <Shield size={10} /> {authUser.role}
            </span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
              {authUser.status}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

      {/* Profile details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
        <ProfileField
          icon={<Shield size={13} style={{ color: 'var(--primary)' }} />}
          label="Role"
          value={authUser.role}
        />
        <ProfileField
          icon={<Zap size={13} style={{ color: 'var(--success)' }} />}
          label="Status"
          value={authUser.status}
        />
        <ProfileField
          icon={<Calendar size={13} style={{ color: 'var(--info)' }} />}
          label="Member Since"
          value={memberSinceFormatted}
        />
        <ProfileField
          icon={<Zap size={13} style={{ color: 'var(--warning)' }} />}
          label="Current Plan"
          value="Business"
        />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

      {/* Action buttons — existing buttons preserved */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary"
          style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
          onClick={() => alert('Plan management coming soon.')}
        >
          Change Plan
        </button>
        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
          onClick={() => alert('Subscription cancellation flow coming soon.')}
        >
          Cancel Subscription
        </button>
      </div>
    </div>
  );
};

/** Small labeled field row used inside the profile details grid */
const ProfileField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
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
