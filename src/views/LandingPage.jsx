'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe, MessageCircle, BarChart4, ChevronDown, Brain } from 'lucide-react';

export const LandingPage = ({ onLoginClick }) => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const pricingPlans = [
    {
      name: 'Starter',
      monthlyPrice: 99,
      yearlyPrice: 79,
      description: 'Ideal for scaling startups and small teams.',
      features: ['Up to 5 Users', 'Basic Lead Pipelines', 'Email & SMS Log integrations', 'Standard Reports', '1 Active Workflow automation']
    },
    {
      name: 'Professional',
      monthlyPrice: 299,
      yearlyPrice: 239,
      description: 'Perfect for established sales organizations.',
      features: ['Up to 25 Users', 'Unlimited Leads & Contact Pipelines', 'Visual Kanban boards', 'AI Lead Scoring (100 runs/mo)', '5 Active Workflows', 'Standard Integrations (Slack, Zoom)']
    },
    {
      name: 'Business',
      monthlyPrice: 999,
      yearlyPrice: 799,
      description: 'Tailored for high-growth enterprises.',
      features: ['Unlimited Users', 'Advanced Custom Dashboards', 'Omni-channel Chat & Call center logs', 'AI Churn Predictors & sentiment reviews', 'Unlimited Workflows', 'Clerk & Stripe advanced integrations', 'Custom API access']
    },
    {
      name: 'Enterprise',
      monthlyPrice: 'Custom',
      yearlyPrice: 'Custom',
      description: 'For global multi-tenant conglomerates.',
      features: ['Dedicated database isolation', 'Unlimited API throughput', '24/7 dedicated solution engineer SLA', 'SOC2 / HIPAA Compliance audits', 'White-labeled customer portal dashboard']
    }
  ];

  const faqItems = [
    { q: "How does the AI Churn Predictor work?", a: "Antigravity CRM logs support ticket frequencies, payment schedules, and communication sentiments to flag clients showing drop-offs in usage. It outputs a real-time Risk Score dashboard metric and offers strategic solution outreach plans." },
    { q: "Can we migrate our data from Salesforce or HubSpot?", a: "Yes, our onboarding center features direct API-key integrations for HubSpot and Salesforce. You can migrate leads, accounts, and call timeline logs within 10 minutes with full data normalization mapping." },
    { q: "Is our client data secure and GDPR-compliant?", a: "Absolutely. All tenant workspaces are separated at the database schema level with end-to-end TLS 1.3 encryption. We support JWT/SAML authentication and enforce SOC2-compliant system audit trails." },
    { q: "Does the platform support custom branding?", a: "Yes, the Business and Enterprise tiers support custom workspaces. You can adjust colors (including primary accents), upload logos, configure custom domains, and white-label client-facing billing portals." }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', minHeight: '100vh' }}>
      
      <header className="header" style={{ position: 'sticky', top: 0, width: '100%', backgroundColor: '#9FCC2B', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-primary)' }}>
            <Zap size={26} style={{ color: '#000' }} />
          </div>
          <span style={{  color: '#000000',fontFamily: 'var(--font-display)', fontWeight: 10000, fontSize: '2.2rem', letterSpacing: '-0.03em' }}>
            CRM<span style={{ color: '#000000' }}></span>
          </span>
        </div>
        
        <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '1 rem', fontWeight: 700 }} className="desktop-only">
         <a href="#features" style={{ color: '#000000' }}>Features</a>
<a href="#pricing" style={{ color: '#000000' }}>Pricing</a>
<a href="#faq" style={{ color: '#000000' }}>FAQ</a>
        
        </nav>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onLoginClick} className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
            Sign In
          </button>
          <button onClick={onLoginClick} className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
            Get Started
          </button>
        </div>
      </header>

      <section style={{
        padding: '5rem 2rem 3rem 2rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at top, rgba(159, 204, 43, 0.08) 0%, transparent 60%)'
      }}>
        <div className="badge badge-primary" style={{ marginBottom: '1.5rem', textTransform: 'none', padding: '0.4rem 0.8rem' }}>
          <Sparkles size={12} style={{ color: 'var(--primary)', marginRight: '0.3rem' }} />
          Next-Generation AI CRM SaaS Core
        </div>
        <h1 style={{
          fontSize: '3.5rem',
          maxWidth: '850px',
          margin: '0 auto 1.5rem auto',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          lineHeight: '1.1'
        }}>
          Supercharge your business with <span style={{ color: 'var(--primary)' }}>AI-Driven Operations</span>
        </h1>
        <p style={{
          fontSize: '1.15rem',
          maxWidth: '650px',
          margin: '0 auto 2rem auto',
          lineHeight: '1.6',
          color: 'var(--text-secondary)'
        }}>
          Close opportunities 40% faster, automate support escalations, predict customer churn risks, and provide white-labeled customer portals. All styled with elegant glassmorphism.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={onLoginClick} className="btn btn-primary" style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}>
            Launch App Console <ArrowRight size={16} />
          </button>
          <a href="#features" className="btn btn-secondary" style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}>
            Explore Features
          </a>
        </div>

        <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1.25rem', fontWeight: 700 }}>
            TRUSTED BY HIGH-VELOCITY ENTERPRISES
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', opacity: 0.6, fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            <span>⚡ Stark Enterprises</span>
            <span>🦇 Wayne Enterprises</span>
            <span>👁️ Tyrell BioCorp</span>
            <span>🛠️ Acme Products</span>
            <span>🌀 Cyberdyne Systems</span>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 2rem 4rem 2rem', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-card" style={{
          width: '100%',
          maxWidth: '1000px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xl)',
          padding: '0.5rem',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border)'
          }}>
            <div style={{ height: '40px', backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 1rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
              </div>
              <div style={{ margin: '0 auto', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>https://app.antigravity.crm/dashboard</div>
            </div>
            
            <div style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, var(--bg-surface), rgba(159, 204, 43, 0.04))',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>CRM Workspace Sales Pipeline</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time telemetry and conversion data.</span>
                </div>
                <div className="badge badge-success">Live Pipeline Active</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>TOTAL REVENUE YTD</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>$142,500.00</div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>+18.4% month-over-month</span>
                </div>
                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>CONVERSION RATE</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>64.2%</div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>AI-Scored Leads: High Probability</span>
                </div>
                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ACTIVE CLIENTS</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>245 Active</div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>0 system bottlenecks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" style={{ padding: '5rem 2rem', backgroundColor: 'var(--bg-sidebar)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>A Unified SaaS Architecture</h2>
          <p style={{ maxWidth: '600px', margin: '0.5rem auto 0 auto', color: 'var(--text-secondary)' }}>Everything you need to orchestrate client engagements, track deals, and generate dynamic receipts.</p>
        </div>

        <div className="grid-3" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-glow)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <h4 style={{ margin: 0, fontWeight: 700 }}>AI Lead & Churn Engine</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Automatically scores lead conversions and calculates real-time customer risk quotients, alerting support before accounts lapse.</p>
          </div>

          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'var(--primary)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Zap size={20} style={{ color: '#000000' }} />
            </div>
            <h4 style={{ margin: 0, fontWeight: 700 }}>Workflow Node Automation</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Visual drag-and-drop workflow canvas to trigger employee routing, auto-invoicing, custom delays, and webhook triggers.</p>
          </div>

          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={20} style={{ color: '#06b6d4' }} />
            </div>
            <h4 style={{ margin: 0, fontWeight: 700 }}>Omni-channel Comms</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Integrate SMS, email, WhatsApp, and record call timelines with AI call logs generating text-based insights instantly.</p>
          </div>

          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} style={{ color: '#10b981' }} />
            </div>
            <h4 style={{ margin: 0, fontWeight: 700 }}>RBAC & Data Isolation</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Configure workspace permissions for Managers, Finance, Support Agents, and customers with strict audit logging.</p>
          </div>

          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart4 size={20} style={{ color: '#f59e0b' }} />
            </div>
            <h4 style={{ margin: 0, fontWeight: 700 }}>Executive Analytics Reports</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Export detailed financial statements, lead-conversion rates, employee performance tables to PDF, CSV, and Excel.</p>
          </div>

          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-glow)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <h4 style={{ margin: 0, fontWeight: 700 }}>Customer Client Portal</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Dedicated secure portal for clients to check subscriptions, book sync calls, generate PDF receipts, and raise tickets.</p>
          </div>
        </div>
      </section>

      <section id="pricing" style={{ padding: '5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Flexible, Value-Based Pricing</h2>
          <p style={{ margin: '0.5rem auto 1.5rem auto', color: 'var(--text-secondary)' }}>Unlock enterprise-grade CRM capability. Save 20% with annual commitments.</p>

          <div style={{ display: 'inline-flex', backgroundColor: 'var(--bg-sidebar)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.4rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '6px',
                color: billingPeriod === 'monthly' ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: billingPeriod === 'monthly' ? 'var(--bg-surface)' : 'transparent',
                boxShadow: billingPeriod === 'monthly' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.4rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '6px',
                color: billingPeriod === 'yearly' ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: billingPeriod === 'yearly' ? 'var(--bg-surface)' : 'transparent',
                boxShadow: billingPeriod === 'yearly' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Yearly (20% Off)
            </button>
          </div>
        </div>

        <div className="grid-4" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {pricingPlans.map((plan) => {
            const isCustom = typeof plan.monthlyPrice === 'string';
            const price = isCustom
              ? 'Custom'
              : billingPeriod === 'monthly'
              ? `$${plan.monthlyPrice}`
              : `$${plan.yearlyPrice}`;

            return (
              <div
                key={plan.name}
                className="gradient-border-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  backgroundColor: plan.name === 'Business' ? 'var(--bg-surface)' : 'var(--bg-surface)',
                  boxShadow: plan.name === 'Business' ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
                }}
              >
                {plan.name === 'Business' && (
                  <div style={{ position: 'absolute', top: '-12px', right: '16px', backgroundColor: 'var(--primary)', color: '#000', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '50px', textTransform: 'uppercase' }}>
                    Popular
                  </div>
                )}
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{plan.name}</h4>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{plan.description}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.1rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800 }}>{price}</span>
                  {!isCustom && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/mo</span>}
                </div>

                <button
                  onClick={onLoginClick}
                  className={plan.name === 'Business' ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Includes:</div>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {plan.features.map((feat, idx) => (
                      <li key={idx} style={{ listStyleType: 'none', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '-18px', color: 'var(--primary)' }}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="faq" style={{ padding: '5rem 2rem', backgroundColor: 'var(--bg-sidebar)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Everything you need to know about setting up your workspace environment.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqItems.map((faq, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: openFaq === idx ? 'var(--primary)' : 'var(--border)'
                }}
                onClick={() => toggleFaq(idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 650, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{faq.q}</span>
                  <ChevronDown size={16} style={{
                    transform: openFaq === idx ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.25s',
                    color: 'var(--text-secondary)'
                  }} />
                </div>
                {openFaq === idx && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }} className="grid-4">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={14} style={{ color: '#000' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>
                CRM
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Premium enterprise AI CRM solutions. Designed with glassmorphic dashboards.</p>
          </div>
          <div>
            <div style={{ fontWeight: 650, fontSize: '0.85rem', marginBottom: '0.75rem' }}>Product</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
              <li><a href="#features" style={{ color: 'var(--text-secondary)' }}>Features</a></li>
              <li><a href="#pricing" style={{ color: 'var(--text-secondary)' }}>Pricing Plans</a></li>
              <li><a href="#faq" style={{ color: 'var(--text-secondary)' }}>FAQs</a></li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 650, fontSize: '0.85rem', marginBottom: '0.75rem' }}>Security & Compliance</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
              <li><span style={{ color: 'var(--text-secondary)' }}>GDPR Isolation</span></li>
              <li><span style={{ color: 'var(--text-secondary)' }}>SOC2 Auditing</span></li>
              <li><span style={{ color: 'var(--text-secondary)' }}>Data Encryption</span></li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 650, fontSize: '0.85rem', marginBottom: '0.75rem' }}>Newsletter</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Sign up to get Q3 marketing studies and product release reports.</p>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <input type="email" placeholder="you@company.com" className="form-input" style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }} />
              <button className="btn btn-primary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>Join</button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1000px', margin: '2rem auto 0 auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>© 2026 Antigravity Systems LLC. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
