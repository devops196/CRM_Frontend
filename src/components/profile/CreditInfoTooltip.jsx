'use client';

import React, { useState, useId, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * CreditInfoTooltip
 */
export const CreditInfoTooltip = ({ description, creditName }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);
  const tooltipId = useId();
  const hideTimer = useRef(null);

  const calcPos = useCallback(() => {
    if (!iconRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    setPos({
      top: rect.top - 7,
      left: rect.left + rect.width / 2,
    });
  }, []);

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    calcPos();
    setVisible(true);
  }, [calcPos]);

  const hide = useCallback(() => {
    hideTimer.current = setTimeout(() => setVisible(false), 80);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const update = () => calcPos();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [visible, calcPos]);

  const TIP_W = 190;

  const clampedLeft = typeof window !== 'undefined' ? Math.min(
    Math.max(pos.left - TIP_W / 2, 8),
    window.innerWidth - TIP_W - 8
  ) : pos.left - TIP_W / 2;

  const tooltipEl = (
    <span
      id={tooltipId}
      role="tooltip"
      style={{
        position: 'fixed',
        top: pos.top,
        left: clampedLeft,
        transform: 'translateY(-100%)',
        zIndex: 99999,
        pointerEvents: 'none',
        width: `${TIP_W}px`,
        padding: '7px 10px',
        borderRadius: '7px',
        backgroundColor: '#0e1a0d',
        border: '1px solid rgba(204, 255, 0, 0.18)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,0,0,0.4)',
        fontSize: '10.5px',
        fontWeight: 500,
        lineHeight: '1.5',
        color: 'rgba(255, 255, 255, 0.85)',
        letterSpacing: '0.01em',
        opacity: visible ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
        transition: 'opacity 0.14s ease, visibility 0.14s ease',
      }}
    >
      {description}

      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-5px',
          left: `${pos.left - clampedLeft}px`,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid rgba(204, 255, 0, 0.18)',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-4px',
          left: `${pos.left - clampedLeft}px`,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: '4px solid #0e1a0d',
        }}
      />
    </span>
  );

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <span
        ref={iconRef}
        role="button"
        aria-label={`What are ${creditName}?`}
        aria-describedby={tooltipId}
        tabIndex={0}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (visible) hide(); else show();
          }
          if (e.key === 'Escape') setVisible(false);
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '13px',
          height: '13px',
          borderRadius: '50%',
          border: `1px solid ${visible ? 'rgba(204,255,0,0.55)' : 'rgba(136,152,130,0.45)'}`,
          color: visible ? 'rgba(204,255,0,0.85)' : 'rgba(136,152,130,0.75)',
          fontSize: '8px',
          fontWeight: 700,
          lineHeight: 1,
          cursor: 'default',
          outline: 'none',
          flexShrink: 0,
          userSelect: 'none',
          transition: 'border-color 0.15s, color 0.15s',
          fontFamily: 'Georgia, serif',
        }}
      >
        i
      </span>

      {typeof document !== 'undefined' && createPortal(tooltipEl, document.body)}
    </span>
  );
};

export default CreditInfoTooltip;
