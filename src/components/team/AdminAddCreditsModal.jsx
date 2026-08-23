'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Minus,
  Sparkles,
  Video,
  Mic,
  AudioWaveform,
  UserCheck,
  Image as ImageIcon,
  Film,
  BarChart3,
  ShieldCheck,
  Check,
} from 'lucide-react';
import MemberAvatar from './MemberAvatar.jsx';

const CREDIT_TYPES = [
  {
    key: 'generationCredits',
    dbKey: 'generationCreditsTotal',
    usedKey: 'generationCreditsUsed',
    name: 'Generation Credits',
    icon: Sparkles,
    color: '#ccff00',
    isUnlimited: false,
    tooltip: 'AI text, copy, and ad content generation',
  },
  {
    key: 'videoCredits',
    dbKey: 'videoCreditsTotal',
    usedKey: 'videoCreditsUsed',
    name: 'Video Generation Credits',
    icon: Video,
    color: '#6366f1',
    isUnlimited: false,
    tooltip: 'Full AI video generation & rendering',
  },
  {
    key: 'voiceCredits',
    dbKey: 'voiceCreditsTotal',
    usedKey: 'voiceCreditsUsed',
    name: 'Voice Credits',
    icon: Mic,
    color: '#06b6d4',
    isUnlimited: false,
    tooltip: 'Text-to-speech voiceover generation',
  },
  {
    key: 'voiceCloneCredits',
    dbKey: 'voiceCloneCreditsTotal',
    usedKey: 'voiceCloneCreditsUsed',
    name: 'Voice Clone Credits',
    icon: AudioWaveform,
    color: '#a855f7',
    isUnlimited: false,
    tooltip: 'Custom voice cloning models',
  },
  {
    key: 'ugcCredits',
    dbKey: 'ugcCreditsTotal',
    usedKey: 'ugcCreditsUsed',
    name: 'UGC Credits',
    icon: UserCheck,
    color: '#f59e0b',
    isUnlimited: false,
    tooltip: 'User Generated Content AI creator avatars',
  },
  {
    key: 'imageCredits',
    dbKey: 'imageCreditsTotal',
    usedKey: 'imageCreditsUsed',
    name: 'Image Credits',
    icon: ImageIcon,
    color: '#10b981',
    isUnlimited: false,
    tooltip: 'AI image generation and enhancement',
  },
  {
    key: 'imageToVideoCredits',
    dbKey: 'imageToVideoCreditsTotal',
    usedKey: 'imageToVideoCreditsUsed',
    name: 'Image-to-Video Credits',
    icon: Film,
    color: '#ec4899',
    isUnlimited: false,
    tooltip: 'Transform static images into motion video',
  },
  {
    key: 'analysisCredits',
    dbKey: null,
    usedKey: null,
    name: 'Analysis Credits',
    icon: BarChart3,
    color: '#60a5fa',
    isUnlimited: true,
    tooltip: 'Unlimited AI analytics',
  },
];

/**
 * Admin-only credit management modal.
 * Adds credits directly to the selected user's balance without deducting from admin.
 */
const AdminAddCreditsModal = ({
  isOpen,
  onClose,
  targetUser,
  onConfirmAddCredits,
}) => {
  const [additions, setAdditions] = useState({
    generationCredits: 0,
    videoCredits: 0,
    voiceCredits: 0,
    voiceCloneCredits: 0,
    ugcCredits: 0,
    imageCredits: 0,
    imageToVideoCredits: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAdditions({
        generationCredits: 0,
        videoCredits: 0,
        voiceCredits: 0,
        voiceCloneCredits: 0,
        ugcCredits: 0,
        imageCredits: 0,
        imageToVideoCredits: 0,
      });
      setSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !targetUser) return null;

  const handleIncrement = (key) => {
    setAdditions((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  const handleDecrement = (key) => {
    setAdditions((prev) => {
      const cur = prev[key] || 0;
      if (cur <= 0) return prev;
      return { ...prev, [key]: cur - 1 };
    });
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    if (onConfirmAddCredits) {
      await onConfirmAddCredits(additions, targetUser);
    }
    setSubmitting(false);
    onClose();
  };

  const totalAdding = Object.values(additions).reduce((a, b) => a + (Number(b) || 0), 0);

  const getCurrentBalance = (type) => {
    if (!targetUser || !type.dbKey) return 0;
    return targetUser[type.dbKey] ?? 0;
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-credits-modal-title"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface, #0e120d)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: 'var(--radius-md, 16px)',
          width: '100%',
          maxWidth: '660px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -12px rgba(0,0,0,0.7), 0 0 30px rgba(139,92,246,0.12)',
          overflow: 'hidden',
          animation: 'slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border, #1a2217)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card, #131a12)',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, var(--bg-card, #131a12) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a78bfa',
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3
                id="admin-credits-modal-title"
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary, #ffffff)',
                }}
              >
                Manage User Credits
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#a78bfa' }}>
                Admin mode — credits added directly, your balance unchanged
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Close modal"
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--border, #1a2217)',
              backgroundColor: 'var(--bg-sidebar, #0a0d0a)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Target User Block ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border, #1a2217)',
            backgroundColor: 'rgba(139,92,246,0.04)',
          }}
        >
          <MemberAvatar
            photoURL={targetUser.photoURL || targetUser.picture}
            initials={targetUser.initials}
            name={targetUser.name}
            size={44}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              {targetUser.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {targetUser.email}
            </div>
          </div>
          {totalAdding > 0 && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#a78bfa',
                backgroundColor: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.35)',
                padding: '3px 10px',
                borderRadius: '12px',
                whiteSpace: 'nowrap',
              }}
            >
              +{totalAdding} Credits
            </span>
          )}
        </div>

        {/* ── Body (Scrollable) ── */}
        <div
          style={{
            padding: '1rem 1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          {CREDIT_TYPES.map((type) => {
            const IconComp = type.icon;

            if (type.isUnlimited) {
              return (
                <div
                  key={type.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 1rem',
                    backgroundColor: 'var(--bg-card, #131a12)',
                    border: '1px solid var(--border, #1a2217)',
                    borderRadius: 'var(--radius-sm, 10px)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '30px', height: '30px', borderRadius: '8px',
                        backgroundColor: `${type.color}15`,
                        border: `1px solid ${type.color}35`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: type.color,
                      }}
                    >
                      <IconComp size={15} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                      {type.name}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem', fontWeight: 700, color: '#60a5fa',
                      backgroundColor: 'rgba(96,165,250,0.12)',
                      border: '1px solid rgba(96,165,250,0.3)',
                      padding: '3px 10px', borderRadius: '12px',
                    }}
                  >
                    Unlimited
                  </span>
                </div>
              );
            }

            const currentBalance = getCurrentBalance(type);
            const adding = additions[type.key] || 0;
            const newBalance = currentBalance + adding;

            return (
              <div
                key={type.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-card, #131a12)',
                  border: `1px solid ${adding > 0 ? type.color + '55' : 'var(--border, #1a2217)'}`,
                  borderRadius: 'var(--radius-sm, 10px)',
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* Left: name + current/new balance */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  <div
                    style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      backgroundColor: `${type.color}15`,
                      border: `1px solid ${type.color}35`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: type.color, flexShrink: 0,
                    }}
                  >
                    <IconComp size={15} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                      {type.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Current: <strong style={{ color: 'var(--text-secondary)' }}>{currentBalance}</strong>
                      </span>
                      {adding > 0 && (
                        <>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>→</span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981' }}>
                            New: {newBalance}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: − count + controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleDecrement(type.key)}
                    disabled={adding <= 0}
                    style={{
                      width: '28px', height: '28px', borderRadius: '6px',
                      border: '1px solid var(--border, #1a2217)',
                      backgroundColor: adding <= 0 ? 'rgba(255,255,255,0.03)' : 'var(--bg-sidebar)',
                      color: adding <= 0 ? 'rgba(255,255,255,0.2)' : 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: adding <= 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Minus size={12} />
                  </button>

                  <div
                    style={{
                      minWidth: '34px', height: '28px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: 'var(--bg-sidebar)',
                      border: `1px solid ${adding > 0 ? type.color : 'var(--border, #1a2217)'}`,
                      borderRadius: '6px',
                      fontSize: '0.88rem', fontWeight: 800,
                      color: adding > 0 ? type.color : 'var(--text-primary)',
                      padding: '0 5px',
                    }}
                  >
                    {adding}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleIncrement(type.key)}
                    style={{
                      width: '28px', height: '28px', borderRadius: '6px',
                      border: '1px solid var(--border, #1a2217)',
                      backgroundColor: 'var(--bg-sidebar)',
                      color: 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border, #1a2217)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card, #131a12)',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {totalAdding > 0
              ? `Adding +${totalAdding} credits to ${targetUser.name.split(' ')[0]}`
              : 'Select credits to add'}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', fontWeight: 600, borderRadius: '8px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting || totalAdding === 0}
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: totalAdding === 0 ? 'rgba(139,92,246,0.3)' : '#8b5cf6',
                color: '#fff',
                border: 'none',
                cursor: submitting || totalAdding === 0 ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              <Check size={16} />
              {submitting ? 'Adding...' : 'Add Credits'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddCreditsModal;
