'use client';

import React, { useState } from 'react';
import { useCRMState } from '../contexts/CRMStateContext.jsx';
import { Sparkles, MessageSquare, Mail, BarChart3, AlertCircle, Send, Mic, MicOff, FileText, CheckCircle, Brain } from 'lucide-react';

export const FloatingAIAssistant = () => {
  const { customers, communications, leads, addTask, addAuditLog } = useCRMState();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [chatQuery, setChatQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'ai', text: "Hello! I am your Quickads AI Co-Pilot. Ask me to search CRM data, predict churn, summarize customer calls, or draft emails." }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  
  // Email Writer States
  const [writerCustomer, setWriterCustomer] = useState(customers[0]?.id || '');
  const [writerTopic, setWriterTopic] = useState('expansion');
  const [draftedEmail, setDraftedEmail] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  // Predictions States
  const [predictCustomer, setPredictCustomer] = useState(customers[0]?.id || '');

  // Handle Query Submit
  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const userText = chatQuery;
    setChatLog((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatQuery('');

    // Simulate AI response logic
    setTimeout(() => {
      let aiResponseText = "I parsed your query but couldn't find a direct command match. Try asking: 'Summarize Bruce Wayne call', 'Who are the high risk accounts?', or 'Create a task for Stark renewal'.";
      let matchedAction = undefined;

      const lower = userText.toLowerCase();
      if (lower.includes('bruce wayne') || lower.includes('wayne')) {
        const wayneComms = communications.filter(c => c.contactName.toLowerCase().includes('wayne'));
        aiResponseText = `I found ${wayneComms.length} communications for Wayne Enterprises. Here is the latest summary: "${wayneComms[0]?.aiSummary || 'No recent call log found.'}". Sentiment is neutral-to-positive.`;
      } else if (lower.includes('stark') || lower.includes('olivia')) {
        const starkComms = communications.filter(c => c.contactName.toLowerCase().includes('stark'));
        aiResponseText = `Olivia Stark Call Summary: "${starkComms[0]?.aiSummary || 'Sentiment: Extremely Enthusiastic.'}". Key Action Item: Prepare Q3 Contract upgrade papers. Churn risk: 8% (Highly Stable).`;
      } else if (lower.includes('risk') || lower.includes('churn')) {
        const highRisk = customers.filter(c => c.riskScore > 15);
        aiResponseText = `Analyzing CRM Risk Models... Found ${highRisk.length} customers with elevated risk scores:\n` +
          highRisk.map(c => `• ${c.company} (Risk: ${c.riskScore}%, assigned to ${c.assignedTo})`).join('\n') +
          `\nAI Recommendation: Initiate high-touch customer support outreach for Tyrell Corporation.`;
      } else if (lower.includes('task') || lower.includes('create')) {
        addTask({
          title: 'AI Scheduled: Follow up on CRM Inquiry',
          description: `Automatically created task via AI Natural Language query: "${userText}"`,
          priority: 'medium',
          status: 'todo',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          assignedTo: 'Alex Rivera',
          dependencies: [],
          tags: ['AI-Generated']
        });
        aiResponseText = "Understood. I have successfully scheduled a follow-up task assigned to Alex Rivera due in 48 hours.";
        matchedAction = (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.75rem', marginTop: '0.3rem', fontWeight: 600 }}>
            <CheckCircle size={12} /> Task created successfully
          </div>
        );
        addAuditLog('Created task via AI co-pilot', 'AI Assistant', 'System');
      } else if (lower.includes('report') || lower.includes('sales')) {
        const totalValue = leads.reduce((acc, l) => acc + l.value, 0);
        aiResponseText = `Generated Instant Sales Funnel Report:
• Active Leads Count: ${leads.length}
• Total Pipeline Valuation: $${totalValue.toLocaleString()}
• Average AI Lead Score: ${Math.round(leads.reduce((acc, l) => acc + l.score, 0) / leads.length)}%
• Critical Churn Risks: 0 major accounts
Export ready in PDF/CSV format.`;
      }

      setChatLog((prev) => [...prev, { sender: 'ai', text: aiResponseText, action: matchedAction }]);
    }, 850);
  };

  // Simulate Voice Command
  const toggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setChatQuery("Summarize Olivia Stark call and check churn risk");
        setIsRecording(false);
      }, 2500);
    }
  };

  // Generate Draft Email
  const handleGenerateEmail = () => {
    setIsWriting(true);
    const targetCust = customers.find(c => c.id === writerCustomer);
    if (!targetCust) return;

    setTimeout(() => {
      let draftText = '';
      if (writerTopic === 'expansion') {
        draftText = `Subject: Scaling your operations with Vertex Labs - Antigravity CRM\n\nDear ${targetCust.name},\n\nI hope this email finds you well. I was reviewing Stark Enterprises' recent usage metrics on our platform and noticed that your team has saved over 42 hours this month using our automated ticket workflows. \n\nGiven this excellent productivity growth, I would love to schedule a brief 10-minute call this Thursday to discuss scaling your workspace limits and enabling our advanced predictive analytics pipelines.\n\nLet me know if 2:00 PM EST works for you.\n\nBest regards,\nRajesh Kesevan\nVertex Labs CEO`;
      } else if (writerTopic === 'billing') {
        draftText = `Subject: Invoice Overdue Notice - Vertex Labs CRM Account\n\nDear ${targetCust.name},\n\nThis is a friendly reminder that invoice INV-2026-003 for Stark Enterprises ($1,500.00) is scheduled for renewal next week.\n\nTo ensure uninterrupted access to your CRM workspace APIs, please review the payment link at your earliest convenience. If you have any questions or require support, please don't hesitate to reach out.\n\nBest regards,\nFinance Ops Team`;
      } else {
        draftText = `Subject: Feedback on your CRM Onboarding - Antigravity Systems\n\nDear ${targetCust.name},\n\nI saw that your team is currently 60% through the onboarding setup for your Stark Enterprises workspace. \n\nOur AI system detected some challenges with configuring custom webhook triggers. I've copy-assigned one of our lead solution architects to help verify your API payloads. Let us know what times work for a screenshare.\n\nBest,\nVertex Solutions Support`;
      }
      setDraftedEmail(draftText);
      setIsWriting(false);
      addAuditLog(`Generated draft email for ${targetCust.company}`, 'AI Writer', 'System');
    }, 700);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-primary"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99998,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(159, 204, 43, 0.45)',
          border: '1px solid rgba(255,255,255,0.2)',
          cursor: 'pointer'
        }}
        title="Open AI CRM Assistant"
      >
        <Sparkles size={24} style={{ color: '#070906' }} />
      </button>

      {isOpen && (
        <div
          className="glass-card animate-slide-up"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: '380px',
            height: '600px',
            zIndex: 99997,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xl)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '1.25rem',
              borderBottom: '1px solid var(--border)',
              background: 'linear-gradient(135deg, var(--bg-surface), rgba(159, 204, 43, 0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-primary)'
                }}
              >
                <Brain size={18} style={{ color: '#000' }} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>AI CRM Co-Pilot</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Llama-3-70B & Pinecone Powered</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--bg-sidebar)',
              padding: '0.2rem'
            }}
          >
            {[
              { id: 'chat', label: 'Chat', icon: <MessageSquare size={13} /> },
              { id: 'writer', label: 'Email', icon: <Mail size={13} /> },
              { id: 'summaries', label: 'Calls', icon: <FileText size={13} /> },
              { id: 'predictions', label: 'Insights', icon: <BarChart3 size={13} /> }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem 0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: activeTab === t.id ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: activeTab === t.id ? 'var(--bg-surface)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            {activeTab === 'chat' && (
              <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingBottom: '1rem' }}>
                  {chatLog.map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        alignSelf: log.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        backgroundColor: log.sender === 'user' ? 'var(--primary)' : 'var(--bg-sidebar)',
                        color: log.sender === 'user' ? '#070906' : 'var(--text-primary)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '12px',
                        borderTopRightRadius: log.sender === 'user' ? '2px' : '12px',
                        borderTopLeftRadius: log.sender === 'ai' ? '2px' : '12px',
                        fontSize: '0.82rem',
                        whiteSpace: 'pre-line',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {log.text}
                      {log.action}
                    </div>
                  ))}
                </div>

                {isRecording && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem',
                    backgroundColor: 'var(--primary-glow)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--primary)'
                  }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', animation: 'ping 1s infinite' }}></span>
                    AI Listening... Speak: "Summarize Stark Call"
                  </div>
                )}

                <form onSubmit={handleQuerySubmit} style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border)', paddingTop: '0.8rem' }}>
                  <button
                    type="button"
                    onClick={toggleVoice}
                    className="btn-icon"
                    style={{ flexShrink: 0, backgroundColor: isRecording ? 'var(--error-light)' : 'transparent', color: isRecording ? 'var(--error)' : 'var(--text-secondary)' }}
                    title="Simulate Voice Commands"
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                  <input
                    type="text"
                    placeholder="Search pipeline, audit logs, summaries..."
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={14} style={{ color: '#000' }} />
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'writer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Client Account</label>
                  <select
                    className="form-select"
                    value={writerCustomer}
                    onChange={(e) => setWriterCustomer(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Email Objective</label>
                  <select
                    className="form-select"
                    value={writerTopic}
                    onChange={(e) => setWriterTopic(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                  >
                    <option value="expansion">Q3 Contract Expansion</option>
                    <option value="billing">Overdue Billing Notice</option>
                    <option value="onboarding">Webhook Setup Support</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateEmail}
                  disabled={isWriting}
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem', marginTop: '0.2rem' }}
                >
                  {isWriting ? 'AI Drafting...' : 'Draft Response with AI'}
                </button>

                {draftedEmail && (
                  <div style={{ marginTop: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Generated Draft</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(draftedEmail);
                          alert('Draft copied to clipboard!');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Copy Draft
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={draftedEmail}
                      rows={12}
                      className="form-input"
                      style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', lineHeight: '1.4', backgroundColor: 'var(--bg-sidebar)' }}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'summaries' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Recent Call Recordings & Logs</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {communications.map((comm) => (
                    <div
                      key={comm.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'var(--bg-sidebar)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 650, marginBottom: '0.2rem' }}>
                        <span>{comm.contactName} ({comm.type.toUpperCase()})</span>
                        <span style={{
                          color: comm.sentiment === 'positive' ? 'var(--success)' : comm.sentiment === 'negative' ? 'var(--error)' : 'var(--warning)',
                          textTransform: 'capitalize'
                        }}>
                          {comm.sentiment} Sentiment
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '0.4rem' }}>
                        "{comm.details}"
                      </div>
                      <div style={{
                        padding: '0.5rem',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: '4px',
                        borderLeft: '2px solid var(--primary)',
                        fontSize: '0.7rem',
                        color: 'var(--text-primary)'
                      }}>
                        <strong>AI Audio Summary:</strong> {comm.aiSummary}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'predictions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: '0.2rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Organization</label>
                  <select
                    className="form-select"
                    value={predictCustomer}
                    onChange={(e) => setPredictCustomer(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.company}</option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const target = customers.find(c => c.id === predictCustomer) || customers[0];
                  if (!target) return null;
                  
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <div style={{
                        padding: '1rem',
                        backgroundColor: 'var(--bg-sidebar)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PREDICTIVE CHURN RISK</div>
                        <div style={{ fontSize: '2.25rem', fontWeight: 800, color: target.riskScore > 20 ? 'var(--warning)' : 'var(--success)', margin: '0.25rem 0' }}>
                          {target.riskScore}%
                        </div>
                        <div style={{ display: 'flex', height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden', margin: '0.5rem 0' }}>
                          <div style={{ width: `${target.riskScore}%`, backgroundColor: target.riskScore > 20 ? 'var(--warning)' : 'var(--success)' }}></div>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                          Status: {target.riskScore > 20 ? 'Action Recommended' : 'Low Churn Likelihood'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Strategic AI Suggestions</div>
                        {target.aiInsights.map((insight, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '0.65rem',
                              backgroundColor: 'var(--primary-glow)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.72rem',
                              border: '1px solid hsla(var(--primary-hue), var(--primary-sat), var(--primary-light), 0.1)',
                              color: 'var(--text-primary)',
                              marginBottom: '0.4rem',
                              display: 'flex',
                              gap: '0.4rem'
                            }}
                          >
                            <AlertCircle size={14} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                            <span>{insight}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          alert(`AI generated expansion audit report for ${target.company}. Shared with David Kim.`);
                        }}
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.5rem', width: '100%' }}
                      >
                        Generate Growth & Expansion Report
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
