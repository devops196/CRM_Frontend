'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, UserPlus, AlertCircle, Mail } from 'lucide-react';

/**
 * Modal for adding a new team member by email address.
 */
const AddUserModal = ({ isOpen, onClose, onAdd }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setError(null);
      setIsAdding(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter an email address.');
      return;
    }

    setIsAdding(true);
    const result = await Promise.resolve(onAdd(trimmed));
    setIsAdding(false);

    if (result) {
      setError(result);
    } else {
      setEmail('');
      setError(null);
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-user-modal-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: 'var(--primary-glow)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus size={15} style={{ color: 'var(--primary)' }} />
            </div>
            <h4
              id="add-user-modal-title"
              style={{ margin: 0, fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-display)' }}
            >
              Add Team Member
            </h4>
          </div>
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
            style={{ width: '28px', height: '28px' }}
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Enter the <strong style={{ color: 'var(--text-secondary)' }}>@quickads.ai</strong> email address
              of the person you want to add to your workspace.
            </p>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--error-light)',
                  border: '1px solid var(--error)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  color: 'var(--error)',
                }}
                role="alert"
              >
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="add-user-email">
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  ref={inputRef}
                  id="add-user-email"
                  type="email"
                  required
                  placeholder="name@quickads.ai"
                  className="form-input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  style={{ paddingLeft: '2.5rem' }}
                  autoComplete="email"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              disabled={isAdding}
            >
              <UserPlus size={14} />
              {isAdding ? 'Adding…' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
