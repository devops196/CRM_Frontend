import React, { useState, useEffect, useCallback } from 'react';
import { useCRMState } from '../contexts/CRMStateContext';
import type { Customer, Lead, Task } from '../contexts/CRMStateContext';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, Sparkles, Mail, Phone, MessageSquare, Play, ArrowRight, ArrowLeft, UserPlus, Users } from 'lucide-react';
import ProfileCard from '../components/profile/ProfileCard';
import TeamTable from '../components/team/TeamTable';
import AddUserModal from '../components/team/AddUserModal';
import { useTeam } from '../hooks/useTeam';
import type { TeamMember } from '../types/team';
import { fetchTeamMembersFromApi, addMemberToMyTeamApi } from '../services/team.service';

/* ==========================================================================
   COMPONENT: CUSTOMERS DIRECTORY
   ========================================================================== */
export const CustomersList: React.FC = () => {
  const { customers, deleteCustomer, updateCustomer } = useCRMState();
  const [editingCustId, setEditingCustId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  const startEdit = (cust: Customer) => {
    setEditingCustId(cust.id);
    setEditName(cust.name);
    setEditPriority(cust.priority);
  };

  const saveEdit = (id: string) => {
    updateCustomer(id, { name: editName, priority: editPriority });
    setEditingCustId(null);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Customers Directory</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overview of fully converted accounts, MRR contributions, and risk score indices.</p>
        </div>
        <span className="badge badge-primary">{customers.length} Accounts Active</span>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Company & Client</th>
              <th>Industry</th>
              <th>MRR Value</th>
              <th>Priority Level</th>
              <th>AI Risk Score</th>
              <th>Assigned Manager</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.id}>
                <td>
                  <div style={{ fontWeight: 650 }}>{cust.company}</div>
                  {editingCustId === cust.id ? (
                    <input
                      type="text"
                      className="form-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginTop: '0.2rem' }}
                    />
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cust.name} ({cust.email})</span>
                  )}
                </td>
                <td style={{ fontSize: '0.85rem' }}>{cust.industry}</td>
                <td style={{ fontWeight: 650 }}>${cust.mrr.toLocaleString()}/mo</td>
                <td>
                  {editingCustId === cust.id ? (
                    <select
                      className="form-select"
                      value={editPriority}
                      onChange={(e: any) => setEditPriority(e.target.value)}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  ) : (
                    <span className={`badge ${
                      cust.priority === 'critical' ? 'badge-error' :
                      cust.priority === 'high' ? 'badge-warning' :
                      cust.priority === 'medium' ? 'badge-info' : 'badge-primary'
                    }`}>
                      {cust.priority}
                    </span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${cust.riskScore}%`, height: '100%', backgroundColor: cust.riskScore > 25 ? 'var(--warning)' : 'var(--success)' }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{cust.riskScore}%</span>
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{cust.assignedTo}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {editingCustId === cust.id ? (
                      <button onClick={() => saveEdit(cust.id)} className="btn btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Save</button>
                    ) : (
                      <button onClick={() => startEdit(cust)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                    )}
                    <button onClick={() => deleteCustomer(cust.id)} className="btn-icon" style={{ width: '26px', height: '26px', color: 'var(--error)', backgroundColor: 'transparent' }} title="Delete Account">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ==========================================================================
   COMPONENT: LEAD PIPELINE KANBAN
   ========================================================================== */
export const LeadKanban: React.FC = () => {
  const { leads, updateLead, convertLead } = useCRMState();

  const stages: { status: Lead['status']; title: string; color: string }[] = [
    { status: 'new', title: 'New Capture', color: 'var(--primary)' },
    { status: 'contacted', title: 'Contacted', color: '#6366f1' },
    { status: 'qualified', title: 'Qualified', color: '#06b6d4' },
    { status: 'proposal', title: 'Proposal Sent', color: '#f59e0b' },
    { status: 'negotiation', title: 'Negotiation', color: '#10b981' }
  ];

  const moveLead = (leadId: string, currentStatus: Lead['status'], direction: 'left' | 'right') => {
    const list = stages.map(s => s.status);
    const index = list.indexOf(currentStatus);
    if (index === -1) return;

    let targetIdx = index;
    if (direction === 'left' && index > 0) targetIdx -= 1;
    if (direction === 'right' && index < list.length - 1) targetIdx += 1;

    updateLead(leadId, { status: list[targetIdx] });
  };

  const handleScoreLead = (leadId: string) => {
    const randomScore = Math.floor(70 + Math.random() * 28);
    updateLead(leadId, { score: randomScore });
    alert(`Lead scored via Antigravity-AI. New Probability Score: ${randomScore}%`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'var(--font-sans)' }}>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Leads Pipeline Kanban</h3>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress deals through validation channels. Score opportunities, edit values, and trigger customer conversions.</p>
      </div>

      <div className="kanban-board">
        {stages.map((stg) => {
          const stageLeads = leads.filter(l => l.status === stg.status);
          
          return (
            <div key={stg.status} className="kanban-column">
              <div className="kanban-column-header">
                <span className="kanban-column-title" style={{ color: stg.color }}>
                  {stg.title}
                </span>
                <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                  {stageLeads.length}
                </span>
              </div>

              <div className="kanban-cards-list">
                {stageLeads.map((ld) => (
                  <div key={ld.id} className="kanban-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{ld.company}</span>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>AI: {ld.score}%</span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Contact: {ld.name}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>
                        ${ld.value.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Source: {ld.source}</span>
                    </div>

                    {/* Action controllers */}
                    <div style={{ display: 'flex', gap: '0.3rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                      <button onClick={() => moveLead(ld.id, ld.status, 'left')} className="btn-icon" style={{ width: '22px', height: '22px' }} title="Move Left">
                        <ArrowLeft size={10} />
                      </button>
                      <button onClick={() => handleScoreLead(ld.id)} className="btn-icon" style={{ width: '22px', height: '22px', color: 'var(--primary)' }} title="AI Re-Score">
                        <Sparkles size={10} />
                      </button>
                      <button onClick={() => moveLead(ld.id, ld.status, 'right')} className="btn-icon" style={{ width: '22px', height: '22px' }} title="Move Right">
                        <ArrowRight size={10} />
                      </button>
                      
                      <button
                        onClick={() => convertLead(ld.id)}
                        className="btn btn-primary"
                        style={{ marginLeft: 'auto', padding: '0.15rem 0.4rem', fontSize: '0.65rem', borderRadius: '4px' }}
                      >
                        Convert
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==========================================================================
   COMPONENT: COMMUNICATIONS HUB
   ========================================================================== */
export const CommunicationHub: React.FC = () => {
  const { communications, addCommunication } = useCRMState();
  const [commType, setCommType] = useState<'call' | 'email' | 'whatsapp'>('email');
  const [commName, setCommName] = useState('Olivia Stark');
  const [commDetail, setCommDetail] = useState('');
  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(null);

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commDetail) return;

    addCommunication({
      type: commType,
      direction: 'outgoing',
      contactName: commName,
      details: commDetail,
      sentiment: 'positive',
      aiSummary: `AI Summary of outgoing ${commType}: Logged to CRM database. Drafted sentiment matches guidelines.`
    });

    setCommDetail('');
    alert(`Communication logs updated! Saved outgoing ${commType}.`);
  };

  const handlePlayRecording = (commId: string) => {
    setActiveRecordingId(activeRecordingId === commId ? null : commId);
    if (activeRecordingId !== commId) {
      setTimeout(() => {
        alert("Audio playback simulation finished. AI transcription successfully logged in CRM state.");
        setActiveRecordingId(null);
      }, 3000);
    }
  };

  return (
    <div className="grid-12" style={{ gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
      {/* Compose Form */}
      <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Log Communication</h3>
        <form onSubmit={handleComposeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Channel Method</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button type="button" onClick={() => setCommType('email')} className={`btn ${commType === 'email' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}>
                <Mail size={12} /> Email
              </button>
              <button type="button" onClick={() => setCommType('call')} className={`btn ${commType === 'call' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}>
                <Phone size={12} /> Call
              </button>
              <button type="button" onClick={() => setCommType('whatsapp')} className={`btn ${commType === 'whatsapp' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}>
                <MessageSquare size={12} /> Chat
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Client Recipient</label>
            <input
              type="text"
              required
              className="form-input"
              value={commName}
              onChange={(e) => setCommName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Message Details / Log Notes</label>
            <textarea
              required
              rows={5}
              placeholder={commType === 'email' ? 'Write email body draft...' : 'Notes from call or copy of chat...'}
              className="form-input"
              value={commDetail}
              onChange={(e) => setCommDetail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.4rem' }}>
            Broadcast & Sync Timeline
          </button>
        </form>
      </div>

      {/* Communications History Feed */}
      <div className="card" style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Communications Registry Feed</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '500px' }}>
          {communications.map((comm) => (
            <div key={comm.id} style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-sidebar)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`badge ${comm.type === 'call' ? 'badge-primary' : comm.type === 'email' ? 'badge-info' : 'badge-success'}`}>
                    {comm.type}
                  </span>
                  <span style={{ fontWeight: 650, fontSize: '0.85rem' }}>{comm.contactName}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{comm.timestamp.split('T')[0]}</span>
              </div>

              <p style={{ fontSize: '0.82rem', margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>
                {comm.details}
              </p>

              {/* Transcription summary */}
              {comm.aiSummary && (
                <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', borderLeft: '3px solid var(--primary)', fontSize: '0.72rem', color: 'var(--text-primary)', marginBottom: comm.type === 'call' ? '0.5rem' : 0 }}>
                  <strong>Co-Pilot Insight Summary:</strong> {comm.aiSummary}
                </div>
              )}

              {/* Call Recording Playback widget */}
              {comm.type === 'call' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                  <button
                    onClick={() => handlePlayRecording(comm.id)}
                    className="btn btn-primary"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <Play size={10} /> {activeRecordingId === comm.id ? 'Playing (44.1kHz)...' : 'Play Audio Recording'}
                  </button>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Duration: {comm.duration || '5m 12s'}
                  </span>
                  
                  {activeRecordingId === comm.id && (
                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                      <span className="wave-bar" style={{ width: '3px', height: '14px', backgroundColor: 'var(--primary)', animation: 'pulse 0.5s infinite' }}></span>
                      <span className="wave-bar" style={{ width: '3px', height: '8px', backgroundColor: 'var(--primary)', animation: 'pulse 0.7s infinite' }}></span>
                      <span className="wave-bar" style={{ width: '3px', height: '18px', backgroundColor: 'var(--primary)', animation: 'pulse 0.4s infinite' }}></span>
                      <span className="wave-bar" style={{ width: '3px', height: '10px', backgroundColor: 'var(--primary)', animation: 'pulse 0.6s infinite' }}></span>
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   COMPONENT: TASK DIRECTORY
   ========================================================================== */
export const TaskList: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useCRMState();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    addTask({
      title: taskTitle,
      description: 'Logged task checklist item.',
      priority: taskPriority,
      status: 'todo',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: 'Dhanush',
      dependencies: [],
      tags: ['Manual-Checklist']
    });

    setTaskTitle('');
    alert('Task successfully logged to to-do list!');
  };

  const handleToggleTaskStatus = (id: string, currentStatus: Task['status']) => {
    const nextStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    updateTask(id, { status: nextStatus });
  };

  return (
    <div className="grid-12" style={{ gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
      {/* Create Task Panel */}
      <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Create Task</h3>
        <form onSubmit={handleAddTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Task Subject</label>
            <input
              type="text"
              required
              placeholder="E.g., Review contract details"
              className="form-input"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Task Priority</label>
            <select
              className="form-select"
              value={taskPriority}
              onChange={(e: any) => setTaskPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Add to Checklist
          </button>
        </form>
      </div>

      {/* Task Checklist Items */}
      <div className="card" style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Checklist Registry</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {tasks.map((tsk) => (
            <div
              key={tsk.id}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-sidebar)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'opacity 0.25s',
                opacity: tsk.status === 'completed' ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={tsk.status === 'completed'}
                  onChange={() => handleToggleTaskStatus(tsk.id, tsk.status)}
                />
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontWeight: 650,
                    fontSize: '0.85rem',
                    textDecoration: tsk.status === 'completed' ? 'line-through' : 'none'
                  }}>
                    {tsk.title}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Due: {tsk.dueDate} • Assigned to: {tsk.assignedTo}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${
                  tsk.priority === 'high' ? 'badge-error' :
                  tsk.priority === 'medium' ? 'badge-warning' : 'badge-primary'
                }`} style={{ fontSize: '0.65rem' }}>
                  {tsk.priority}
                </span>
                <button
                  onClick={() => deleteTask(tsk.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TeamLookupView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const data = await fetchTeamMembersFromApi({ search: trimmed });
      setResults(data);
    } catch (err) {
      console.error('Error querying team member:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search debounced when query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* ── Header ── */}
      <div>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Team Lookup</h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Search for team members directly from the database to view their profile, role, status, and CRM credits.
        </p>
      </div>

      {/* ── Lookup Box ── */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
            Search Team Member (Name, Email, or Employee ID)
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Enter name, email, or employee ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-input"
              style={{ height: '42px', fontSize: '0.95rem', flex: 1 }}
              autoFocus
            />
            <button
              onClick={() => handleSearch(query)}
              disabled={loading}
              className="btn btn-primary"
              style={{ height: '42px', padding: '0 1.25rem', fontSize: '0.9rem', fontWeight: 650 }}
            >
              {loading ? 'Searching...' : 'Lookup'}
            </button>
          </div>
        </div>

        {/* ── Initial Prompt ── */}
        {!hasSearched && !loading && (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)' }}>
            Enter a name, email address, or employee ID above to search database user details and credit balance.
          </div>
        )}

        {/* ── State: Loading ── */}
        {loading && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Searching database for matching user...
          </div>
        )}

        {/* ── State: No Results Found in DB ── */}
        {hasSearched && !loading && results.length === 0 && (
          <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No user found matching <strong>"{query}"</strong> in the database.
          </div>
        )}

        {/* ── State: Match Details Card(s) ── */}
        {hasSearched && !loading && results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map((user) => {
              const available = user.creditsAvailable ?? 0;
              const total = user.totalCredits ?? 0;
              const used = Math.max(0, total - available);
              const remainingPct = user.remainingPercentage ?? (total > 0 ? Math.round((available / total) * 100) : 0);

              let healthColor = '#10b981';
              let healthBg = 'rgba(16, 185, 129, 0.12)';
              if (user.creditHealth === 'Critical') {
                healthColor = '#ef4444';
                healthBg = 'rgba(239, 68, 68, 0.12)';
              } else if (user.creditHealth === 'Warning') {
                healthColor = '#f59e0b';
                healthBg = 'rgba(245, 158, 11, 0.12)';
              }

              return (
                <div
                  key={user.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-sidebar)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.2rem',
                  }}
                >
                  {/* User Profile Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary)',
                          color: '#000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          user.initials || user.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{user.email}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                          ID: {user.employeeId}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                      <span className={`badge ${user.accountStatus === 'Active' || user.status === 'Active' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.7rem' }}>
                        {user.accountStatus || user.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Plan: <strong style={{ color: 'var(--text-primary)' }}>{user.role === 'Admin' ? 'Admin Plan' : 'Customer Plan'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

                  {/* Credits & Plan Details Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>CRM Credits Balance</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: healthColor, backgroundColor: healthBg, padding: '2px 8px', borderRadius: '10px' }}>
                        {remainingPct}% Remaining ({user.creditHealth || 'Healthy'})
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', backgroundColor: 'var(--bg-card)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Available Credits</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981', marginTop: '0.1rem' }}>{available.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Credits</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.1rem' }}>{total.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Credits Used</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{used.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(remainingPct, 100)}%`, backgroundColor: healthColor, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   COMPONENT: SETTINGS PANEL
   ========================================================================== */
export const SettingsPanel: React.FC = () => {
  const { authUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Team management hook
  const { members, memberCount, initTeam, setMembers } = useTeam();

  // Initialize team list once we have an authenticated user
  useEffect(() => {
    if (authUser) {
      initTeam(authUser);
    }
  }, [authUser, initTeam]);

  // Async handler that calls the DB API to add a member
  const handleAddMember = async (email: string): Promise<string | null> => {
    if (!authUser?.email) return 'Not authenticated.';
    const result = await addMemberToMyTeamApi(authUser.email, email);
    if (result.success) {
      setMembers(result.team);
      return null;
    }
    return result.message || 'Failed to add member.';
  };

  // The owner's team member ID for the "You" badge
  const ownerTeamId = authUser ? `tm_owner_${authUser.uid}` : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'var(--font-sans)' }}>

      {/* ── SECTION 1: Your Profile ───────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Your Profile</h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Authenticated via Google — profile data is sourced directly from your account.
          </p>
        </div>

        {authUser ? (
          <ProfileCard authUser={authUser} />
        ) : (
          <div
            className="card"
            style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}
          >
            Profile not available. Please sign in with Google to view your profile.
          </div>
        )}
      </div>
    </div>
  );
};
