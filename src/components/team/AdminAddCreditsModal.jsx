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
import { updateUserSubscriptionPlanApi } from '../../services/team.service.js';

export const SUBSCRIPTION_PLANS = [
  { label: 'Discover', value: 'discover' },
  { label: 'All Access 99', value: 'all access 99' },
  { label: 'All Access 99 Yearly', value: 'all access 99 yearly' },
  { label: 'QuickAds Tier 4', value: 'quickads_tier4' },
  { label: 'QuickAds Tier 6', value: 'quickads_tier6' },
  { label: 'Enterprise', value: 'enterprise' },
];

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

const getCurrentBalance = (user, type) => {
  if (!user || !type.dbKey) return 0;
  return user[type.dbKey] ?? user[type.key] ?? 0;
};

const getInitialCredits = (user) => {
  const init = {};
  CREDIT_TYPES.forEach((type) => {
    if (type.isUnlimited || !type.key) return;
    init[type.key] = getCurrentBalance(user, type);
  });
  return init;
};

/**
 * Admin-only credit management modal.
 * Modifies credit totals directly for the selected user.
 */
const AdminAddCreditsModal = ({
  isOpen,
  onClose,
  targetUser,
  onConfirmAddCredits,
}) => {
  const [credits, setCredits] = useState(() => getInitialCredits(targetUser));
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(
    targetUser?.subscriptionPlan || targetUser?.subscription_plan || 'discover'
  );
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [planMessage, setPlanMessage] = useState(null);

  useEffect(() => {
    if (isOpen && targetUser) {
      setCredits(getInitialCredits(targetUser));
      setSelectedPlan(targetUser.subscriptionPlan || targetUser.subscription_plan || 'discover');
      setSubmitting(false);
      setSaveError(null);
      setUpdatingPlan(false);
      setPlanMessage(null);
    }
  }, [isOpen, targetUser]);

  const handleUpdatePlan = async () => {
    if (!targetUser?.email || !selectedPlan) return;
    setUpdatingPlan(true);
    setPlanMessage(null);
    const res = await updateUserSubscriptionPlanApi(targetUser.email, selectedPlan);
    setUpdatingPlan(false);
    if (res.success) {
      setPlanMessage(`Plan successfully updated to ${selectedPlan.toUpperCase()}! Hardcoded limits applied.`);
      const limits = res.updated_credits || res.data;
      const newPlan = res.data?.subscriptionPlan || selectedPlan;
      
      targetUser.subscriptionPlan = newPlan;
      targetUser.subscription_plan = newPlan;

      if (limits) {
        targetUser.generationCreditsTotal = limits.generationCreditsTotal ?? limits.generationcreditstotal ?? targetUser.generationCreditsTotal;
        targetUser.videoCreditsTotal = limits.videoCreditsTotal ?? limits.videocreditstotal ?? targetUser.videoCreditsTotal;
        targetUser.voiceCreditsTotal = limits.voiceCreditsTotal ?? limits.voicecreditstotal ?? targetUser.voiceCreditsTotal;
        targetUser.voiceCloneCreditsTotal = limits.voiceCloneCreditsTotal ?? limits.voiceclonecreditstotal ?? targetUser.voiceCloneCreditsTotal;
        targetUser.ugcCreditsTotal = limits.ugcCreditsTotal ?? limits.ugccreditstotal ?? targetUser.ugcCreditsTotal;
        targetUser.imageCreditsTotal = limits.imageCreditsTotal ?? limits.imagecreditstotal ?? targetUser.imageCreditsTotal;
        targetUser.imageToVideoCreditsTotal = limits.imageToVideoCreditsTotal ?? limits.imagetovideocreditstotal ?? targetUser.imageToVideoCreditsTotal;

        setCredits(getInitialCredits(targetUser));
      }
    } else {
      setPlanMessage(`Error: ${res.message || 'Failed to update subscription plan.'}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !targetUser) return null;

  const handleIncrement = (key) => {
    setCredits((prev) => {
      const cur = Number(prev[key]) || 0;
      return { ...prev, [key]: cur + 1 };
    });
  };

  const handleDecrement = (key) => {
    setCredits((prev) => {
      const cur = Number(prev[key]) || 0;
      if (cur <= 0) return prev;
      return { ...prev, [key]: cur - 1 };
    });
  };

  const handleInputChange = (key, rawVal) => {
    if (rawVal === '') {
      setCredits((prev) => ({ ...prev, [key]: '' }));
      return;
    }
    const parsed = parseInt(rawVal, 10);
    setCredits((prev) => ({
      ...prev,
      [key]: isNaN(parsed) ? 0 : Math.max(0, parsed),
    }));
  };

  const handleInputBlur = (key) => {
    setCredits((prev) => {
      const val = prev[key];
      if (val === '' || val === undefined || isNaN(val)) {
        const typeObj = CREDIT_TYPES.find((t) => t.key === key);
        return { ...prev, [key]: getCurrentBalance(targetUser, typeObj) };
      }
      return prev;
    });
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setSaveError(null);
    const deltas = {};
    const updatedTotals = {};

    CREDIT_TYPES.forEach((type) => {
      if (type.isUnlimited || !type.key) return;
      const initialVal = getCurrentBalance(targetUser, type);
      const currentVal = Number(credits[type.key]) || 0;
      updatedTotals[type.key] = currentVal;
      deltas[type.key] = currentVal - initialVal;
    });

    let success = true;
    if (onConfirmAddCredits) {
      try {
        const result = await onConfirmAddCredits(deltas, targetUser, updatedTotals);
        // onConfirmAddCredits should return true on success, false or a string on failure
        if (result === false || (typeof result === 'string' && result.startsWith('Error'))) {
          success = false;
          setSaveError(typeof result === 'string' ? result : 'Failed to save credit changes. Please try again.');
        }
      } catch (err) {
        success = false;
        setSaveError(err?.message || 'Unexpected error saving credits.');
      }
    }

    setSubmitting(false);
    // Only auto-close on success; on error, keep modal open so user sees the message
    if (success) {
      onClose();
    }
  };

  const hasChanges = CREDIT_TYPES.some((type) => {
    if (type.isUnlimited || !type.key) return false;
    const initialVal = getCurrentBalance(targetUser, type);
    const currentVal = Number(credits[type.key]) || 0;
    return currentVal !== initialVal;
  });

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
        {/* Header */}
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

        {/* Target User Block */}
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
          {hasChanges && (
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
              Modified Credits
            </span>
          )}
        </div>

        {/* Subscription Plan Switcher */}
        <div
          style={{
            margin: '0.85rem 1.5rem 0.25rem 1.5rem',
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--bg-card, #131a12)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 'var(--radius-sm, 10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Active Subscription Plan:
              <span style={{ marginLeft: '0.4rem', color: '#8b5cf6', fontWeight: 800 }}>
                {SUBSCRIPTION_PLANS.find(p => p.value === (targetUser.subscriptionPlan || targetUser.subscription_plan || 'discover').toLowerCase())?.label || targetUser.subscriptionPlan || 'Discover'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="form-select"
              style={{
                flex: 1,
                height: '36px',
                fontSize: '0.84rem',
                backgroundColor: 'var(--bg-sidebar, #0a0d0a)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border, #1a2217)',
                borderRadius: '8px',
                padding: '0 0.75rem',
              }}
            >
              {SUBSCRIPTION_PLANS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleUpdatePlan}
              disabled={updatingPlan || selectedPlan === (targetUser.subscriptionPlan || targetUser.subscription_plan || 'discover')}
              style={{
                height: '36px',
                padding: '0 1rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                borderRadius: '8px',
                backgroundColor: '#8b5cf6',
                color: '#fff',
                border: 'none',
                cursor: updatingPlan ? 'wait' : 'pointer',
                opacity: selectedPlan === (targetUser.subscriptionPlan || targetUser.subscription_plan || 'discover') ? 0.6 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {updatingPlan ? 'Updating Plan...' : 'Update Plan'}
            </button>
          </div>

          {planMessage && (
            <div style={{ fontSize: '0.78rem', color: planMessage.startsWith('Error') ? '#ef4444' : '#10b981', fontWeight: 600 }}>
              {planMessage}
            </div>
          )}
        </div>

        {/* Body (Scrollable) */}
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

            const currentBalance = getCurrentBalance(targetUser, type);
            const val = credits[type.key] !== undefined ? credits[type.key] : currentBalance;
            const numericVal = Number(val) || 0;
            const delta = numericVal - currentBalance;
            const isModified = delta !== 0;

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
                  border: `1px solid ${isModified ? type.color + '77' : 'var(--border, #1a2217)'}`,
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
                      {isModified && (
                        <>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>→</span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: delta > 0 ? '#10b981' : '#f59e0b' }}>
                            New: {numericVal} ({delta > 0 ? `+${delta}` : delta})
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: − button + numeric input + + button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleDecrement(type.key)}
                    disabled={numericVal <= 0}
                    style={{
                      width: '28px', height: '28px', borderRadius: '6px',
                      border: '1px solid var(--border, #1a2217)',
                      backgroundColor: numericVal <= 0 ? 'rgba(255,255,255,0.03)' : 'var(--bg-sidebar)',
                      color: numericVal <= 0 ? 'rgba(255,255,255,0.2)' : 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: numericVal <= 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    title="Decrement credit amount"
                  >
                    <Minus size={12} />
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={val}
                    onChange={(e) => handleInputChange(type.key, e.target.value)}
                    onBlur={() => handleInputBlur(type.key)}
                    style={{
                      width: '72px',
                      height: '28px',
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-sidebar, #0a0d0a)',
                      border: `1px solid ${isModified ? type.color : 'var(--border, #1a2217)'}`,
                      borderRadius: '6px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      color: isModified ? type.color : 'var(--text-primary, #ffffff)',
                      outline: 'none',
                      padding: '0 4px',
                    }}
                  />

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
                    title="Increment credit amount"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border, #1a2217)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card, #131a12)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: saveError ? '#ef4444' : 'var(--text-muted)', flex: 1, minWidth: 0 }}>
            {saveError
              ? saveError
              : hasChanges
              ? `Updating credit limits for ${targetUser.name.split(' ')[0]}`
              : 'Adjust credits using - / + or direct entry'}
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
              disabled={submitting}
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#8b5cf6',
                color: '#fff',
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              <Check size={16} />
              {submitting ? 'Saving...' : 'Save Credits'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddCreditsModal;
