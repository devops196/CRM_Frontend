'use client';

import React, { useState } from 'react';
import { useCRMState } from '../contexts/CRMStateContext.jsx';
import { Play, Plus, Trash2, Clock, GitCommit, Settings2, ShieldCheck, Zap } from 'lucide-react';

export const WorkflowBuilder = () => {
  const { workflows, addWorkflow, updateWorkflow, triggerWorkflowSimulation } = useCRMState();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(workflows[0]?.id || '');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState([]);
  
  // New Node Form States
  const [newNodeType, setNewNodeType] = useState('action');
  const [newNodeValue, setNewNodeValue] = useState('');

  const currentWorkflow = workflows.find((w) => w.id === selectedWorkflowId);

  const availableActions = [
    'Assign Employee: David Kim',
    'Assign Employee: Maya Patel',
    'Send Email: Welcome Onboarding Package',
    'Send Email: Payment Reminder Notice',
    'Send SMS Alert to Representative',
    'Send WhatsApp Message to Customer',
    'Create Task: Schedule Kick-off Sync',
    'Generate Invoice via Stripe',
    'Execute Webhook: https://api.vertexlabs.io/hooks',
    'Notify Team via Slack channel'
  ];

  const availableConditions = [
    'Condition: Churn Risk Score > 40%',
    'Condition: Estimated Deal Value > $10,000',
    'Condition: Account Tier is Enterprise',
    'Condition: Ticket Urgency is Critical'
  ];

  const availableDelays = [
    'Delay: 1 Hour',
    'Delay: 24 Hours',
    'Delay: 3 Business Days'
  ];

  const handleAddNode = (e) => {
    e.preventDefault();
    if (!currentWorkflow || !newNodeValue) return;

    let nodeText = newNodeValue;
    const updatedActions = [...currentWorkflow.actions, nodeText];
    updateWorkflow(currentWorkflow.id, { actions: updatedActions });
    setNewNodeValue('');
  };

  const handleRemoveNode = (index) => {
    if (!currentWorkflow) return;
    const updatedActions = currentWorkflow.actions.filter((_, idx) => idx !== index);
    updateWorkflow(currentWorkflow.id, { actions: updatedActions });
  };

  const handleToggleActive = () => {
    if (!currentWorkflow) return;
    updateWorkflow(currentWorkflow.id, { active: !currentWorkflow.active });
  };

  const handleSimulateWorkflow = () => {
    if (!currentWorkflow) return;
    setIsSimulating(true);
    setSimulationLog([]);

    const log = (msg) => {
      setSimulationLog((prev) => [...prev, msg]);
    };

    log(`⚡ Trigger Fired: "${currentWorkflow.trigger}" detected...`);
    
    currentWorkflow.actions.forEach((action, idx) => {
      setTimeout(() => {
        log(`✓ Executed step ${idx + 1}: ${action}`);
        if (idx === currentWorkflow.actions.length - 1) {
          setTimeout(() => {
            log(`🎉 Workflow "${currentWorkflow.name}" executed successfully!`);
            setIsSimulating(false);
            triggerWorkflowSimulation(currentWorkflow.trigger);
          }, 400);
        }
      }, (idx + 1) * 800);
    });
  };

  return (
    <div className="grid-12" style={{ gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
      <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>Workflows</h3>
          <button
            onClick={() => {
              const name = prompt('Enter workflow name:');
              const trigger = prompt('Enter trigger (e.g. Lead Created, Payment Received, Ticket Raised):');
              if (name && trigger) {
                addWorkflow({
                  name,
                  trigger,
                  actions: ['Send Email: Welcome Info Package'],
                  active: true
                });
              }
            }}
            className="btn btn-primary"
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}
          >
            <Plus size={14} /> New
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {workflows.map((wf) => (
            <div
              key={wf.id}
              onClick={() => setSelectedWorkflowId(wf.id)}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: selectedWorkflowId === wf.id ? 'var(--primary)' : 'var(--border)',
                backgroundColor: selectedWorkflowId === wf.id ? 'var(--primary-glow)' : 'var(--bg-input)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 650, fontSize: '0.85rem', color: selectedWorkflowId === wf.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {wf.name}
                </span>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: wf.active ? 'var(--success)' : 'var(--text-muted)'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Trigger: <span style={{ fontWeight: 600 }}>{wf.trigger}</span>
              </div>
            </div>
          ))}
        </div>

        {simulationLog.length > 0 && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#070906',
            color: '#9FCC2B',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            border: '1px solid var(--border)',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.75rem', borderBottom: '1px solid #1a2217', paddingBottom: '0.2rem', marginBottom: '0.2rem' }}>
              Execution Log
            </div>
            {simulationLog.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ gridColumn: 'span 8', minHeight: '600px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {currentWorkflow ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>{currentWorkflow.name}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configure automated actions triggered in real-time.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleToggleActive}
                  className="btn"
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.5rem 0.85rem',
                    backgroundColor: currentWorkflow.active ? 'var(--warning-light)' : 'var(--success-light)',
                    color: currentWorkflow.active ? 'var(--warning)' : 'var(--success)',
                    borderColor: 'transparent'
                  }}
                >
                  {currentWorkflow.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={handleSimulateWorkflow}
                  disabled={isSimulating}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
                >
                  <Play size={14} style={{ fill: 'currentColor' }} />
                  {isSimulating ? 'Running...' : 'Simulate Run'}
                </button>
              </div>
            </div>

            <div className="workflow-canvas" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                backgroundColor: 'var(--primary-glow)',
                border: '2px solid var(--primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                minWidth: '220px',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                position: 'relative'
              }}>
                <Zap size={16} style={{ color: 'var(--primary)' }} />
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>TRIGGER</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 650 }}>{currentWorkflow.trigger}</div>
                </div>
              </div>

              {currentWorkflow.actions.length > 0 ? (
                currentWorkflow.actions.map((act, idx) => {
                  let isCondition = act.startsWith('Condition:');
                  let isDelay = act.startsWith('Delay:');
                  
                  return (
                    <React.Fragment key={idx}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 700 }}>↓</div>

                      <div style={{
                        backgroundColor: isCondition ? 'var(--accent-light)' : isDelay ? 'var(--warning-light)' : 'var(--bg-surface)',
                        border: '1px solid',
                        borderColor: isCondition ? 'var(--accent)' : isDelay ? 'var(--warning)' : 'var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minWidth: '260px',
                        maxWidth: '340px',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isCondition ? (
                            <GitCommit size={15} style={{ color: 'var(--accent)' }} />
                          ) : isDelay ? (
                            <Clock size={15} style={{ color: 'var(--warning)' }} />
                          ) : (
                            <Settings2 size={15} style={{ color: 'var(--primary)' }} />
                          )}
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                              {isCondition ? 'BRANCH CONDITION' : isDelay ? 'TIME DELAY' : 'ACTION EXECUTION'}
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{act}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveNode(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--error)',
                            cursor: 'pointer',
                            padding: '0.2rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete Node"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
                  No actions defined. Add a node below.
                </div>
              )}

              {currentWorkflow.actions.length > 0 && (
                <>
                  <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 700 }}>↓</div>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px dashed var(--border)',
                    borderRadius: '50px',
                    padding: '0.4rem 1rem',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: 'var(--text-muted)'
                  }}>
                    <ShieldCheck size={12} /> Workflow End
                  </div>
                </>
              )}
            </div>

            <form onSubmit={handleAddNode} style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ fontWeight: 650, fontSize: '0.85rem' }}>Add Automation Node</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '0.5rem' }}>
                <select
                  className="form-select"
                  value={newNodeType}
                  onChange={(e) => {
                    setNewNodeType(e.target.value);
                    setNewNodeValue('');
                  }}
                  style={{ fontSize: '0.8rem' }}
                >
                  <option value="action">Action Node</option>
                  <option value="condition">Condition Node</option>
                  <option value="delay">Delay Node</option>
                </select>

                <select
                  className="form-select"
                  value={newNodeValue}
                  onChange={(e) => setNewNodeValue(e.target.value)}
                  style={{ fontSize: '0.8rem' }}
                  required
                >
                  <option value="">-- Choose node value --</option>
                  {newNodeType === 'action' &&
                    availableActions.map((act) => (
                      <option key={act} value={act}>{act}</option>
                    ))}
                  {newNodeType === 'condition' &&
                    availableConditions.map((cond) => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  {newNodeType === 'delay' &&
                    availableDelays.map((del) => (
                      <option key={del} value={del}>{del}</option>
                    ))}
                </select>

                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                  <Plus size={14} /> Add Step
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            Select or create a workflow to edit.
          </div>
        )}
      </div>
    </div>
  );
};
