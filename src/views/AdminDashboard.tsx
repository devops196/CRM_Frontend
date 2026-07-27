import React, { useState } from 'react';
import { useCRMState } from '../contexts/CRMStateContext';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { DollarSign, Award, CheckSquare, Sparkles, Plus, Calendar, Zap, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { customers, leads, tickets, communications, addLead, triggerWorkflowSimulation } = useCRMState();
  const { user } = useAuth();
  
  // Custom Widgets Toggle States
  const [widgets, setWidgets] = useState({
    financialLine: true,
    leadScoreRadar: true,
    activityTimeline: true,
    aiSuggestions: true,
    upcomingMeetings: true
  });

  // Action states
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadValue, setNewLeadValue] = useState(5000);
  const [newLeadSource, setNewLeadSource] = useState<'website' | 'linkedin' | 'cold_call'>('website');


  const salesTrendData = [
    { week: 'W1', value: 8500, projection: 9000 },
    { week: 'W2', value: 12400, projection: 11000 },
    { week: 'W3', value: 19100, projection: 16000 },
    { week: 'W4', value: 24500, projection: 20000 }
  ];

  const radarData = [
    { subject: 'Lead Quality', A: 85, B: 70, fullMark: 100 },
    { subject: 'Engagement', A: 98, B: 60, fullMark: 100 },
    { subject: 'API Integrity', A: 70, B: 85, fullMark: 100 },
    { subject: 'Closing Velocity', A: 88, B: 50, fullMark: 100 },
    { subject: 'ROI Efficiency', A: 92, B: 90, fullMark: 100 }
  ];

  // Calculated figures
  const totalPipelineVal = leads.reduce((acc, l) => acc + l.value, 0);
  const totalMrr = customers.reduce((acc, c) => acc + c.mrr, 0);
  const conversionRate = 64.2;

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadCompany) return;

    addLead({
      name: newLeadName,
      company: newLeadCompany,
      email: `${newLeadName.toLowerCase().replace(/\s+/g, '')}@${newLeadCompany.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: '+1 (555) 019-2831',
      source: newLeadSource,
      status: 'new',
      value: Number(newLeadValue),
      score: Math.floor(60 + Math.random() * 35), // Simulated AI score
      assignedTo: user?.name || 'David Kim',
      riskScore: 10,
      notes: 'Generated via Workspace Quick Action form'
    });

    setShowAddLeadModal(false);
    setNewLeadName('');
    setNewLeadCompany('');
    alert('Lead generated and queued in pipeline. Automation trigger fired!');
  };

  const handleTriggerWebhook = () => {
    triggerWorkflowSimulation('Payment Received');
    alert('Mock Webhook Event (Payment Received) triggered successfully. Check logs.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'var(--font-sans)' }}>
      {/* Header with quick widgets controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.75rem' }}>Workspace Portal</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Welcome back, {user?.name}. Your workspace metrics are active.</p>
        </div>
        
        {/* Customized Widgets Dropdown */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Customize Widgets:</span>
          {Object.keys(widgets).map((wKey) => (
            <button
              key={wKey}
              onClick={() => setWidgets(prev => ({ ...prev, [wKey]: !prev[wKey as keyof typeof prev] }))}
              style={{
                fontSize: '0.7rem',
                padding: '0.3rem 0.6rem',
                border: '1px solid var(--border)',
                borderRadius: '50px',
                backgroundColor: widgets[wKey as keyof typeof widgets] ? 'var(--primary-glow)' : 'var(--bg-surface)',
                color: widgets[wKey as keyof typeof widgets] ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {wKey.replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of operational summary logs */}
      <div className="grid-4">
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>WORKSPACE RUNRATE</span>
            <DollarSign size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>${totalMrr.toLocaleString()}/mo</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>+12% MRR since last quarter</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ACTIVE DEALS pipeline</span>
            <Award size={16} style={{ color: '#6366f1' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>${totalPipelineVal.toLocaleString()}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>{leads.length} high scoring leads open</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CONVERSION EFFICIENCY</span>
            <Sparkles size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{conversionRate}%</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>+4.1% via AI auto-scoring</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>RESOLVED TICKETS SLA</span>
            <CheckSquare size={16} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{tickets.filter(t => t.status === 'resolved').length} / {tickets.length}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg support resolution: 8m</span>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid-12" style={{ gap: '1.5rem' }}>
        
        {/* Line Chart Widget */}
        {widgets.financialLine && (
          <div className="card" style={{ gridColumn: 'span 8', height: '380px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, fontWeight: 700 }}>Weekly Pipeline Conversions vs Projections</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated 5m ago</span>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--text-secondary)" fontSize={11} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }} />
                  <Legend fontSize={10} />
                  <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} activeDot={{ r: 8 }} name="Actual Opportunities" />
                  <Line type="monotone" dataKey="projection" stroke="var(--text-muted)" strokeDasharray="5 5" strokeWidth={2} name="Forecast Goal" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Radar Lead Quality Index */}
        {widgets.leadScoreRadar && (
          <div className="card" style={{ gridColumn: 'span 4', height: '380px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>AI Lead Index Telemetry</h4>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" fontSize={10} />
                  <PolarRadiusAxis stroke="var(--border)" fontSize={9} />
                  <Radar name="Acme Leads" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                  <Radar name="Industry Median" dataKey="B" stroke="var(--text-muted)" fill="var(--text-muted)" fillOpacity={0.1} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>

      {/* Row: AI suggestions, Quick Actions & Activity timeline */}
      <div className="grid-12" style={{ gap: '1.5rem' }}>
        
        {/* Quick Actions Panel */}
        <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, fontWeight: 700 }}>Dashboard Command Desk</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            
            <button onClick={() => setShowAddLeadModal(true)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Plus size={16} /> Create Opportunity Lead
            </button>

            <button onClick={handleTriggerWebhook} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Zap size={16} style={{ color: 'var(--primary)' }} /> Trigger Workspace Webhook
            </button>

            <button onClick={() => {
              alert("System status check initialized. Network ping: 8ms. Docker nodes: 12/12 online. Postgres pool: active.");
            }} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Activity size={16} style={{ color: '#06b6d4' }} /> Telemetry Status Check
            </button>

            <button onClick={() => {
              alert("Exported Sales Report to Desktop/CRM_antigravity/walkthrough.md - simulation package prepared.");
            }} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Calendar size={16} style={{ color: '#6366f1' }} /> Export Financial Report
            </button>

          </div>
        </div>

        {/* AI suggestions */}
        {widgets.aiSuggestions && (
          <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} style={{ color: 'var(--primary)' }} /> AI Sales Assistant
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-glow)', borderRadius: 'var(--radius-sm)', border: '1px solid hsla(var(--primary-hue), var(--primary-sat), var(--primary-light), 0.1)', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 650, color: 'var(--primary)', marginBottom: '0.2rem' }}>High Lead Conversion Alert</div>
                Lead <strong>Peter Parker</strong> is scored 87% based on email frequency and document signatures. Recommend immediate proposal submission.
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: 'var(--warning-light)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.1)', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 650, color: 'var(--warning)', marginBottom: '0.2rem' }}>Renewal Churn Threat flag</div>
                Client <strong>Tyrell Corporation</strong> risk score rose to 28% due to sandbox API token expirations. Plan Solution Architecture session.
              </div>
            </div>
          </div>
        )}

        {/* Activity Timeline logs */}
        {widgets.activityTimeline && (
          <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ margin: 0, fontWeight: 700 }}>Workspace Timeline Feed</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '230px', paddingRight: '0.25rem' }}>
              {communications.map((comm) => (
                <div key={comm.id} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.78rem' }}>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: comm.type === 'call' ? 'var(--primary)' : comm.type === 'email' ? '#6366f1' : '#10b981',
                      marginTop: '4px'
                    }}></span>
                    <span style={{ width: '1px', flex: 1, backgroundColor: 'var(--border)', minHeight: '20px' }}></span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{comm.contactName} ({comm.type.toUpperCase()})</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>{comm.details}</div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{comm.timestamp.split('T')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CREATE LEAD MODAL SIMULATION */}
      {showAddLeadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4 style={{ margin: 0 }}>Create Opportunity Lead</h4>
              <button onClick={() => setShowAddLeadModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>×</button>
            </div>
            <form onSubmit={handleCreateLead}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Contact Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Wade Wilson"
                    className="form-input"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Weapon X Labs"
                    className="form-input"
                    value={newLeadCompany}
                    onChange={(e) => setNewLeadCompany(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Deal Pipeline Valuation ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="15000"
                    className="form-input"
                    value={newLeadValue}
                    onChange={(e) => setNewLeadValue(Number(e.target.value))}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Acquisition Channel Source</label>
                  <select
                    className="form-select"
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value as any)}
                  >
                    <option value="website">Website Forms</option>
                    <option value="linkedin">LinkedIn Ads</option>
                    <option value="cold_call">Cold Sales Representatives</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddLeadModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Inject Lead & Run Workflows</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
