import React, { useState } from 'react';
import { useCRMState } from '../contexts/CRMStateContext';
import type { Invoice } from '../contexts/CRMStateContext';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Ticket as TicketIcon, MessageSquare, ShieldCheck, QrCode, Download, Printer, Mail, Send, Award, Zap, HelpCircle } from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const { invoices, tickets, addTicket, payInvoice } = useCRMState();
  const { user } = useAuth();
  
  // States
  const [activeSubTab, setActiveSubTab] = useState<'billing' | 'support' | 'chatbot'>('billing');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Checkout simulator states
  const [checkoutInvoice, setCheckoutInvoice] = useState<Invoice | null>(null);
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('242');
  const [isPaying, setIsPaying] = useState(false);

  // New Support Ticket states
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  // Customer Chatbot states
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: "Hello! I am your Stark Enterprises AI Account Assistant. I can help you search billing invoice statuses, generate PDF receipts, or log support tickets." }
  ]);

  // Handle support ticket creation
  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;

    addTicket({
      customerName: user?.name || 'Olivia Stark',
      customerEmail: user?.email || 'olivia.stark@starkenterprises.com',
      subject: ticketSubject,
      description: ticketDesc,
      priority: ticketPriority,
      status: 'open',
      assignedTo: 'Maya Patel'
    });

    setTicketSubject('');
    setTicketDesc('');
    alert('Support Ticket has been logged in workspace. An agent will respond shortly.');
  };

  // Simulate Payment via Stripe Checkout Modal
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutInvoice) return;
    setIsPaying(true);

    setTimeout(() => {
      payInvoice(checkoutInvoice.id);
      
      // Update selectedInvoice for the instant receipt visual preview!
      setSelectedInvoice({
        ...checkoutInvoice,
        status: 'paid',
        paidAt: new Date().toISOString(),
        transactionId: `txn_stripe_${Math.floor(1000000000 + Math.random() * 9000000000)}`
      });

      setCheckoutInvoice(null);
      setIsPaying(false);
      alert('Stripe Transaction Approved! Paid Receipt is ready.');
    }, 1500);
  };

  // Chatbot logic
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatLog((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let botResponse = "I couldn't process that query directly. Try typing: 'invoices', 'receipts', or 'escalate to human support'.";
      const lower = userText.toLowerCase();

      if (lower.includes('invoice') || lower.includes('bill') || lower.includes('pay')) {
        const pending = invoices.filter(inv => inv.status === 'pending');
        if (pending.length > 0) {
          botResponse = `You have ${pending.length} pending invoice: ${pending[0].invoiceNumber} for $${pending[0].amount.toLocaleString()}. You can settle this in the Billing tab using our integrated checkout.`;
        } else {
          botResponse = "Excellent news! All Stark Enterprises billing cycles are fully paid up. No invoices are pending.";
        }
      } else if (lower.includes('receipt') || lower.includes('transaction')) {
        const paid = invoices.filter(inv => inv.status === 'paid');
        botResponse = `Found ${paid.length} paid receipts. The latest payment was ${paid[0]?.invoiceNumber} ($${paid[0]?.amount}) on ${paid[0]?.paidAt?.split('T')[0] || 'July 5th'}. Select 'Receipt' on the list to print.`;
      } else if (lower.includes('support') || lower.includes('ticket') || lower.includes('escalate')) {
        botResponse = "Understood. I can forward you to Maya Patel from the Vertex support desk. Alternatively, you can log a high-priority ticket in the 'Support Center' tab.";
      } else if (lower.includes('roi') || lower.includes('profit') || lower.includes('hour')) {
        botResponse = "Your Stark Enterprises workspace telemetry shows: \n• Saved Hours: 42 Hours/month\n• Workflow Triggers: 1,420 runs/month\n• ROI efficiency: +14.5% overhead savings.";
      }

      setChatLog((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'var(--font-sans)' }}>
      {/* Hero Shell */}
      <div>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem' }}>Client Portal Console</h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Manage Stark Enterprises account subscriptions, invoice settlements, and support workflows.</p>
      </div>

      {/* Overview stats */}
      <div className="grid-3">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: 'var(--primary-glow)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={22} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ACTIVE LICENSE PLAN</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>Enterprise Plan ($4,500/mo)</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status: Active • Renewing Aug 15</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} style={{ color: '#6366f1' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AUTOMATION SAVED TIME</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>42.5 hours saved</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>ROI Valuation: $8,500/mo efficiency</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} style={{ color: '#10b981' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>WORKSPACE CONNECTIVITY</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>12 API Integrations</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>Slack, Webhooks, Stripe Connected</span>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="tabs-header">
        <button onClick={() => setActiveSubTab('billing')} className={`tab-btn ${activeSubTab === 'billing' ? 'active' : ''}`}>
          <CreditCard size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Invoice Billing & Receipts
        </button>
        <button onClick={() => setActiveSubTab('support')} className={`tab-btn ${activeSubTab === 'support' ? 'active' : ''}`}>
          <TicketIcon size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Support Center & Ticket Routing
        </button>
        <button onClick={() => setActiveSubTab('chatbot')} className={`tab-btn ${activeSubTab === 'chatbot' ? 'active' : ''}`}>
          <MessageSquare size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> AI Client Account Chatbot
        </button>
      </div>

      {/* Main Tab content boxes */}
      <div className="grid-12" style={{ gap: '1.5rem' }}>
        
        {/* Tab 1: Billing & Invoice List */}
        {activeSubTab === 'billing' && (
          <>
            <div className="card" style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>Invoices Registry</h3>
              
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Due Date</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td style={{ fontWeight: 600 }}>{inv.invoiceNumber}</td>
                        <td>{inv.dueDate}</td>
                        <td>${inv.amount.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${inv.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td>
                          {inv.status === 'pending' ? (
                            <button onClick={() => setCheckoutInvoice(inv)} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                              Pay Now
                            </button>
                          ) : (
                            <button onClick={() => setSelectedInvoice(inv)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                              View Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Instant Receipt Preview Frame */}
            <div className="card" style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px dashed var(--border)', backgroundColor: 'transparent' }}>
              {selectedInvoice ? (
                <div style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.5rem',
                  fontFamily: 'var(--font-sans)',
                  position: 'relative'
                }}>
                  {/* Stamp paid */}
                  {selectedInvoice.status === 'paid' && (
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      border: '3px solid var(--success)',
                      color: 'var(--success)',
                      fontSize: '0.8rem',
                      fontWeight: 900,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      transform: 'rotate(15deg)',
                      textTransform: 'uppercase'
                    }}>
                      PAID STAMP
                    </div>
                  )}

                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>Vertex Labs Inc.</div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Transaction Reference Invoice</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '1rem' }}>
                    <div><strong>Invoice No:</strong> {selectedInvoice.invoiceNumber}</div>
                    <div><strong>Bill To:</strong> {selectedInvoice.companyName}</div>
                    <div><strong>Transaction Ref:</strong> <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>{selectedInvoice.transactionId || 'N/A'}</span></div>
                    <div><strong>Settled Date:</strong> {selectedInvoice.paidAt?.split('T')[0] || selectedInvoice.dueDate}</div>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', marginBottom: '1rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <th style={{ textAlign: 'left', paddingBottom: '0.3rem' }}>Item Description</th>
                        <th style={{ textAlign: 'right', paddingBottom: '0.3rem' }}>Qty</th>
                        <th style={{ textAlign: 'right', paddingBottom: '0.3rem' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '0.3rem 0' }}>{item.description}</td>
                          <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                          <td style={{ textAlign: 'right' }}>${(item.quantity * item.unitPrice).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border)', paddingTop: '0.5rem', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                    <span>Total Settled</span>
                    <span>${selectedInvoice.amount.toLocaleString()}</span>
                  </div>

                  {/* QR code display */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--bg-sidebar)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ padding: '4px', backgroundColor: '#fff', borderRadius: '4px', display: 'flex' }}>
                      <QrCode size={40} style={{ color: '#000' }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      <strong>Audit Verify QR</strong>
                      <div>Scan to verify SOC2 compliance logs in our secure registry.</div>
                    </div>
                  </div>

                  {/* Receipt Options */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button onClick={() => alert('PDF downloaded')} className="btn btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}>
                      <Download size={12} /> PDF
                    </button>
                    <button onClick={() => window.print()} className="btn btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}>
                      <Printer size={12} /> Print
                    </button>
                    <button onClick={() => alert('Receipt emailed')} className="btn btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}>
                      <Mail size={12} /> Email
                    </button>
                  </div>

                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
                  <HelpCircle size={32} style={{ marginBottom: '0.5rem' }} />
                  Click "View Receipt" next to a paid invoice to display high-fidelity transaction records and QR validations.
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab 2: Support Center */}
        {activeSubTab === 'support' && (
          <>
            {/* Raise ticket form */}
            <div className="card" style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>Raise Support Ticket</h3>
              <form onSubmit={handleRaiseTicket} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Subject Title</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Production API Latencies"
                    className="form-input"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Ticket Priority</label>
                  <select
                    className="form-select"
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                  >
                    <option value="low">Low (General Inquiry)</option>
                    <option value="medium">Medium (Integration issue)</option>
                    <option value="high">High (Telemetry delays)</option>
                    <option value="critical">Critical (System Downtime SLA)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Detailed Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide logs, API paths, and steps to reproduce..."
                    className="form-input"
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Submit Support Ticket
                </button>
              </form>
            </div>

            {/* Active tickets lists */}
            <div className="card" style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>Helpdesk Tickets Queue</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '420px' }}>
                {tickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: 'var(--bg-sidebar)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 650, fontSize: '0.85rem' }}>{tkt.subject}</span>
                      <span className={`badge ${tkt.status === 'open' ? 'badge-info' : tkt.status === 'in_progress' ? 'badge-warning' : 'badge-success'}`}>
                        {tkt.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{tkt.description}</p>
                    
                    {/* Tiny conversations list */}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {tkt.timeline.map((msg, idx) => (
                        <div key={idx} style={{ fontSize: '0.72rem' }}>
                          <strong style={{ color: msg.isAI ? 'var(--primary)' : 'var(--text-primary)' }}>
                            {msg.sender} {msg.isAI && '(AI Assistant)'}:
                          </strong>{' '}
                          <span style={{ color: 'var(--text-secondary)' }}>{msg.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tab 3: Chatbot Panel */}
        {activeSubTab === 'chatbot' && (
          <div className="card" style={{ gridColumn: 'span 12', height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0 0 0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>AI Account Assistant Chat</h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Query invoice values, ROI stats, or raise support issues immediately.</p>
              </div>
              <span className="badge badge-primary">ChatGPT Support API</span>
            </div>

            {/* Chatbox messages logs */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {chatLog.map((chat, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: chat.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    backgroundColor: chat.sender === 'user' ? 'var(--primary)' : 'var(--bg-sidebar)',
                    color: chat.sender === 'user' ? '#070906' : 'var(--text-primary)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    border: '1px solid var(--border)',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {chat.text}
                </div>
              ))}
            </div>

            {/* Chat Form */}
            <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              <input
                type="text"
                placeholder="Ask: 'Show my invoices', 'What is our ROI saved hours?', or 'Escalate'..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="form-input"
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                <Send size={15} style={{ color: '#000' }} />
              </button>
            </form>
          </div>
        )}

      </div>

      {/* STRIPE CHECKOUT MODAL SIMULATOR */}
      {checkoutInvoice && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CreditCard size={18} style={{ color: 'var(--primary)' }} /> Secure Stripe Payment
              </h4>
              <button onClick={() => setCheckoutInvoice(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>×</button>
            </div>
            
            <form onSubmit={handlePaymentSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-sidebar)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Billing Invoice:</span>
                    <strong>{checkoutInvoice.invoiceNumber}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Amount Due:</span>
                    <strong style={{ color: 'var(--primary)' }}>${checkoutInvoice.amount.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Credit Card Number</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      className="form-input"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">CVC Code</label>
                    <input
                      type="password"
                      required
                      maxLength={3}
                      className="form-input"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--success)' }} /> SSL encrypted payments via Stripe API.
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setCheckoutInvoice(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={isPaying} className="btn btn-primary">
                  {isPaying ? 'Processing Settlement...' : `Pay $${checkoutInvoice.amount.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
