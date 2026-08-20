'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { AlertCircle, Zap, Users, TrendingUp, Shield, GitCommit, CheckCircle2 } from 'lucide-react';
import GoogleSignInButton from '../components/auth/GoogleSignInButton.jsx';

const featureHighlights = [
  {
    icon: <TrendingUp size={15} />,
    title: 'Unified Pipeline',
    desc: 'Manage your entire sales pipeline in one smart Kanban board.',
  },
  {
    icon: <Users size={15} />,
    title: 'Customer Intelligence',
    desc: 'Deep customer profiles with interaction history and health scores.',
  },
  {
    icon: <GitCommit size={15} />,
    title: 'Workflow Automation',
    desc: 'Build no-code automation workflows to eliminate repetitive tasks.',
  },
  {
    icon: <Shield size={15} />,
    title: 'Enterprise Security',
    desc: 'Role-based access control with full audit logging.',
  },
];

const stats = [
  { value: '12k+', label: 'Active Users' },
  { value: '98%', label: 'Uptime SLA' },
  { value: '4.9★', label: 'User Rating' },
];

/**
 * Authentication page — Google Sign-In only.
 */
export const AuthPages = ({ onAuthSuccess }) => {
  const { loginWithGoogle } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credential) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle(credential);
      onAuthSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error - Use valid login credentials.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    setErrorMessage(error);
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', fontFamily: 'var(--font-sans)' }}>

      {/* ─── LEFT BRAND PANEL ─── */}
      <div style={{
        flex: '0 0 52%',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #0a0f08 0%, #0d1a0c 40%, #081508 80%, #040904 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 3rem',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-80px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, hsla(77,65%,48%,0.18) 0%, transparent 70%)', animation: 'orbFloat 8s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-50px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, hsla(77,65%,48%,0.10) 0%, transparent 70%)', animation: 'orbFloat 11s ease-in-out infinite reverse', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '60%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, hsla(99,65%,60%,0.07) 0%, transparent 70%)', animation: 'orbFloat 14s ease-in-out infinite', pointerEvents: 'none' }} />

        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '38px', height: '38px',
            background: 'linear-gradient(135deg, hsl(77,65%,48%), hsl(90,60%,40%))',
            borderRadius: '11px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px hsla(77,65%,48%,0.45)',
            flexShrink: 0,
          }}>
            <Zap size={19} style={{ color: '#060a04' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: '#f0f5ef', letterSpacing: '-0.03em', lineHeight: 1 }}>
            Antigravity<span style={{ color: 'hsl(77,65%,55%)' }}>.crm</span>
          </div>
        </div>

        <div style={{ marginTop: '1.75rem', marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.4rem',
            fontWeight: 800,
            color: '#eef3ed',
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            margin: 0,
            marginBottom: '0.75rem',
          }}>
            The CRM that
            <br />
            <span style={{
              background: 'linear-gradient(90deg, hsl(77,65%,55%), hsl(110,55%,60%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              closes deals faster.
            </span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(160,185,150,0.85)', lineHeight: 1.6, margin: 0, maxWidth: '370px' }}>
            Streamline your entire revenue operation — from first contact to closed-won — with intelligent automation, real-time insights, and a team-first workspace.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', position: 'relative', zIndex: 1, marginBottom: '1.5rem' }}>
          {featureHighlights.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '32px', height: '32px',
                background: 'hsla(77,65%,48%,0.1)',
                border: '1px solid hsla(77,65%,48%,0.2)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'hsl(77,65%,55%)',
                flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontWeight: 650, fontSize: '0.83rem', color: '#dde8db', letterSpacing: '-0.01em' }}>{f.title}</div>
                <div style={{ fontSize: '0.74rem', color: 'rgba(140,165,130,0.8)', lineHeight: 1.4 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          background: 'hsla(77,65%,48%,0.06)',
          border: '1px solid hsla(77,65%,48%,0.15)',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              flex: 1,
              padding: '0.75rem 1rem',
              textAlign: 'center',
              borderRight: i < stats.length - 1 ? '1px solid hsla(77,65%,48%,0.15)' : 'none',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'hsl(77,65%,60%)', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(140,165,130,0.7)', marginTop: '1px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── RIGHT LOGIN PANEL ─── */}
      <div style={{
        flex: 1,
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, hsl(77,65%,48%), hsl(110,55%,55%), transparent)', opacity: 0.6 }} />

        <div style={{ width: '100%', maxWidth: '388px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, hsl(77,65%,48%), hsl(90,60%,40%))',
              borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-primary)',
            }}>
              <Zap size={16} style={{ color: '#060a04' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
              Antigravity<span style={{ color: 'var(--primary)' }}>.crm</span>
            </span>
          </div>

          <div className="glass-card" style={{
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xl)',
            padding: '1.75rem 1.75rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.45rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                Welcome back
              </h2>
              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Sign in to your Antigravity CRM workspace.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { icon: <Shield size={10} />, label: 'SSO Enabled' },
                { icon: <CheckCircle2 size={10} />, label: 'SOC 2 Type II' },
                { icon: <CheckCircle2 size={10} />, label: 'GDPR Ready' },
              ].map((b, i) => (
                <div key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  fontSize: '0.65rem', fontWeight: 600,
                  padding: '0.18rem 0.55rem',
                  borderRadius: '6px',
                  background: 'var(--primary-glow)',
                  border: '1px solid hsla(77,65%,48%,0.25)',
                  color: 'var(--primary)',
                  textTransform: 'uppercase', letterSpacing: '0.03em',
                }}>
                  {b.icon} {b.label}
                </div>
              ))}
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            {errorMessage && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                padding: '0.6rem 0.85rem',
                backgroundColor: 'var(--error-light)', border: '1px solid var(--error)',
                borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--error)', lineHeight: 1.4,
              }} role="alert">
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '14px', height: '14px', border: '2px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Verifying credentials…
                  </div>
                </div>
              ) : (
                <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
              )}

              <p style={{ margin: 0, textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                By signing in, you agree to our{' '}
                <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Terms of Service</span>
                {' '}and{' '}
                <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Privacy Policy</span>.
              </p>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.45rem',
                padding: '0.55rem 0.75rem',
                background: 'var(--bg-sidebar)', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)', fontSize: '0.72rem', color: 'var(--text-muted)',
              }}>
                <Shield size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>Access restricted to <strong style={{ color: 'var(--text-secondary)' }}>@quickads.ai</strong> accounts only.</span>
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.67rem', color: 'var(--text-muted)', marginTop: '1rem', marginBottom: 0 }}>
            © {new Date().getFullYear()} Antigravity Technologies · All rights reserved
          </p>
        </div>
      </div>

      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-28px) scale(1.04); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
