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
  Coins,
  Check,
} from 'lucide-react';
import MemberAvatar from './MemberAvatar.jsx';

/**
 * List of all credit types supported by the application.
 */
const CREDIT_TYPES = [
  {
    key: 'generationCredits',
    name: 'Generation Credits',
    icon: Sparkles,
    color: '#ccff00',
    isUnlimited: false,
    tooltip: 'Used for AI text, copy, and ad content generation',
  },
  {
    key: 'videoCredits',
    name: 'Video Generation Credits',
    icon: Video,
    color: '#6366f1',
    isUnlimited: false,
    tooltip: 'Used for full AI video generation & rendering',
  },
  {
    key: 'voiceCredits',
    name: 'Voice Credits',
    icon: Mic,
    color: '#06b6d4',
    isUnlimited: false,
    tooltip: 'Used for text-to-speech voiceover generation',
  },
  {
    key: 'voiceCloneCredits',
    name: 'Voice Clone Credits',
    icon: AudioWaveform,
    color: '#a855f7',
    isUnlimited: false,
    tooltip: 'Used for custom voice cloning models',
  },
  {
    key: 'ugcCredits',
    name: 'UGC Credits',
    icon: UserCheck,
    color: '#f59e0b',
    isUnlimited: false,
    tooltip: 'Used for User Generated Content AI creator avatars',
  },
  {
    key: 'imageCredits',
    name: 'Image Credits',
    icon: ImageIcon,
    color: '#10b981',
    isUnlimited: false,
    tooltip: 'Used for AI image generation and enhancement',
  },
  {
    key: 'imageToVideoCredits',
    name: 'Image-to-Video Credits',
    icon: Film,
    color: '#ec4899',
    isUnlimited: false,
    tooltip: 'Used for transforming static images into motion video',
  },
  {
    key: 'analysisCredits',
    name: 'Analysis Credits',
    icon: BarChart3,
    color: '#60a5fa',
    isUnlimited: true,
    tooltip: 'Unlimited AI workspace performance and risk analytics',
  },
];

/**
 * Medium-sized centered modal for allocating credits from owner account to a teammate.
 */
const AllocateCreditsModal = ({
  isOpen,
  onClose,
  targetUser,
  ownerAvailableCredits = {},
  onConfirmAllocation,
}) => {
  const [allocations, setAllocations] = useState({
    generationCredits: 0,
    videoCredits: 0,
    voiceCredits: 0,
    voiceCloneCredits: 0,
    ugcCredits: 0,
    imageCredits: 0,
    imageToVideoCredits: 0,
  });

  // Reset allocations on modal open
  useEffect(() => {
    if (isOpen) {
      setAllocations({
        generationCredits: 0,
        videoCredits: 0,
        voiceCredits: 0,
        voiceCloneCredits: 0,
        ugcCredits: 0,
        imageCredits: 0,
        imageToVideoCredits: 0,
      });
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !targetUser) return null;

  /**
   * Safe getter for owner's available credits for a specific type
   */
  const getAvailable = (key) => {
    return Math.max(0, ownerAvailableCredits[key] ?? 0);
  };

  /**
   * Handle allocation increment
   */
  const handleIncrement = (key) => {
    const available = getAvailable(key);
    setAllocations((prev) => {
      const current = prev[key] || 0;
      if (current >= available) return prev;
      return { ...prev, [key]: current + 1 };
    });
  };

  /**
   * Handle allocation decrement
   */
  const handleDecrement = (key) => {
    setAllocations((prev) => {
      const current = prev[key] || 0;
      if (current <= 0) return prev;
      return { ...prev, [key]: current - 1 };
    });
  };

  const handleConfirm = () => {
    if (onConfirmAllocation) {
      onConfirmAllocation(allocations, targetUser);
    }
    onClose();
  };

  // Calculate total credits being allocated right now
  const totalAllocatedCount = Object.values(allocations).reduce((a, b) => a + (Number(b) || 0), 0);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="allocate-credits-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
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
          border: '1px solid var(--border, #1a2217)',
          borderRadius: 'var(--radius-md, 16px)',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(204, 255, 0, 0.08)',
          overflow: 'hidden',
          animation: 'slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ── Modal Header ── */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border, #1a2217)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card, #131a12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(204, 255, 0, 0.12)',
                border: '1px solid rgba(204, 255, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary, #ccff00)',
              }}
            >
              <Coins size={18} />
            </div>
            <div>
              <h3
                id="allocate-credits-modal-title"
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary, #ffffff)',
                }}
              >
                Allocate Credits
              </h3>
              <p
                style={{
                  margin: '2px 0 0 0',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted, #889882)',
                }}
              >
                Allocate credits from your account to this teammate.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Close modal"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border, #1a2217)',
              backgroundColor: 'var(--bg-sidebar, #0a0d0a)',
              color: 'var(--text-muted, #889882)',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Modal Body (Scrollable) ── */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.1rem',
          }}
        >
          {/* Target User Info Block */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--bg-sidebar, #0a0d0a)',
              border: '1px solid var(--border, #1a2217)',
              borderRadius: 'var(--radius-sm, 8px)',
            }}
          >
            <MemberAvatar
              photoURL={targetUser.photoURL || targetUser.picture}
              initials={targetUser.initials}
              name={targetUser.name}
              size={42}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary, #ffffff)' }}>
                {targetUser.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #889882)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {targetUser.email}
              </div>
            </div>
            {totalAllocatedCount > 0 && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--primary, #ccff00)',
                  backgroundColor: 'rgba(204, 255, 0, 0.12)',
                  border: '1px solid rgba(204, 255, 0, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                }}
              >
                +{totalAllocatedCount} Credits Selected
              </span>
            )}
          </div>

          {/* Credit Controls List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--bg-card, #131a12)',
                      border: '1px solid var(--border, #1a2217)',
                      borderRadius: 'var(--radius-sm, 10px)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: `${type.color}15`,
                          border: `1px solid ${type.color}35`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: type.color,
                        }}
                      >
                        <IconComp size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary, #ffffff)' }}>
                          {type.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #889882)' }}>
                          {type.tooltip}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#60a5fa',
                        backgroundColor: 'rgba(96, 165, 250, 0.15)',
                        border: '1px solid rgba(96, 165, 250, 0.3)',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        letterSpacing: '0.02em',
                      }}
                    >
                      Unlimited
                    </span>
                  </div>
                );
              }

              const available = getAvailable(type.key);
              const allocated = allocations[type.key] || 0;
              const remaining = available - allocated;
              const isMinusDisabled = allocated <= 0;
              const isPlusDisabled = allocated >= available;

              return (
                <div
                  key={type.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-card, #131a12)',
                    border: `1px solid ${allocated > 0 ? type.color + '55' : 'var(--border, #1a2217)'}`,
                    borderRadius: 'var(--radius-sm, 10px)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: `${type.color}15`,
                        border: `1px solid ${type.color}35`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: type.color,
                        flexShrink: 0,
                      }}
                    >
                      <IconComp size={16} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary, #ffffff)' }}>
                        {type.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '2px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #889882)' }}>
                          Available: <strong style={{ color: 'var(--text-secondary, #a3b19e)' }}>{available}</strong>
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #889882)' }}>•</span>
                        <span style={{ fontSize: '0.72rem', color: remaining < 3 && available > 0 ? '#f59e0b' : '#10b981', fontWeight: 600 }}>
                          Remaining: {remaining}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Control Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.75rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => handleDecrement(type.key)}
                      disabled={isMinusDisabled}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '6px',
                        border: '1px solid var(--border, #1a2217)',
                        backgroundColor: isMinusDisabled ? 'rgba(255, 255, 255, 0.03)' : 'var(--bg-sidebar, #0a0d0a)',
                        color: isMinusDisabled ? 'rgba(255, 255, 255, 0.2)' : 'var(--text-primary, #ffffff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isMinusDisabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      title="Decrease allocation"
                    >
                      <Minus size={14} />
                    </button>

                    <div
                      style={{
                        minWidth: '36px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--bg-sidebar, #0a0d0a)',
                        border: `1px solid ${allocated > 0 ? type.color : 'var(--border, #1a2217)'}`,
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        color: allocated > 0 ? type.color : 'var(--text-primary, #ffffff)',
                        padding: '0 6px',
                      }}
                    >
                      {allocated}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleIncrement(type.key)}
                      disabled={isPlusDisabled}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '6px',
                        border: '1px solid var(--border, #1a2217)',
                        backgroundColor: isPlusDisabled ? 'rgba(255, 255, 255, 0.03)' : 'var(--bg-sidebar, #0a0d0a)',
                        color: isPlusDisabled ? 'rgba(255, 255, 255, 0.2)' : 'var(--text-primary, #ffffff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isPlusDisabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      title={isPlusDisabled ? 'Maximum available balance reached' : 'Increase allocation'}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Modal Footer ── */}
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
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #889882)' }}>
            Allocating {totalAllocatedCount} total credits to {targetUser.name.split(' ')[0]}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{
                padding: '0.55rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: '8px',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--primary, #ccff00)',
                color: '#070906',
              }}
            >
              <Check size={16} />
              Allocate Credits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocateCreditsModal;
