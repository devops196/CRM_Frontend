'use client';

import React, { useState } from 'react';
import { useCRMState } from '../contexts/CRMStateContext.jsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Building2, Users, DollarSign, Activity } from 'lucide-react';
import { LoginAttemptsTable } from '../components/auth/LoginAttemptsTable.jsx';

export const SuperAdminDashboard = () => {
  const { organizations, auditLogs, updateOrganization, addOrganization } = useCRMState();
  const [selectedPlan, setSelectedPlan] = useState('enterprise');
  
  // Organization adding states
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDomain, setNewOrgDomain] = useState('');

  // Recharts Seed Data
  const revenueTrend = [
    { month: 'Jan', revenue: 42000, users: 110 },
    { month: 'Feb', revenue: 54000, users: 145 },
    { month: 'Mar', revenue: 68000, users: 180 },
    { month: 'Apr', revenue: 79000, users: 210 },
    { month: 'May', revenue: 95000, users: 265 },
    { month: 'Jun', revenue: 103390, users: 293 }
  ];

  const planBreakdown = [
    { name: 'Starter', count: 1 },
    { name: 'Pro', count: 1 },
    { name: 'Business', count: 1 },
    { name: 'Enterprise', count: 2 }
  ];

  // Calculations
  const totalRevenue = organizations.reduce((acc, o) => o.status === 'active' ? acc + o.revenue : acc, 0);
  const totalUsers = organizations.reduce((acc, o) => acc + o.usersCount, 0);
  const activeOrgs = organizations.filter(o => o.status === 'active').length;

  const handlePlanChange = (orgId, newPlan) => {
    let rev = 990;
    if (newPlan === 'pro') rev = 4500;
    if (newPlan === 'business') rev = 15000;
    if (newPlan === 'enterprise') rev = 45000;

    updateOrganization(orgId, { plan: newPlan, revenue: rev });
  };

  const handleStatusChange = (orgId, newStatus) => {
    updateOrganization(orgId, { status: newStatus });
  };

  const handleAddOrg = (e) => {
    e.preventDefault();
    if (!newOrgName || !newOrgDomain) return;

    let initialRev = 990;
    if (selectedPlan === 'pro') initialRev = 4500;
    if (selectedPlan === 'business') initialRev = 15000;
    if (selectedPlan === 'enterprise') initialRev = 45000;

    addOrganization({
      name: newOrgName,
      domain: newOrgDomain,
      plan: selectedPlan,
      status: 'active',
      revenue: initialRev,
      usersCount: 5
    });

    setNewOrgName('');
    setNewOrgDomain('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'var(--font-sans)' }}>
      <div>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.75rem' }}>Super Admin Console</h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>System telemetry, audit trails, and multi-tenant operations.</p>
      </div>

      <div className="grid-4">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: 'var(--primary-glow)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={22} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ACTIVE TENANTS</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{activeOrgs} / {organizations.length}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>99.99% Node Uptime</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} style={{ color: '#6366f1' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>TOTAL LICENSED SEATS</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{totalUsers.toLocaleString()}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>+14 seats this week</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} style={{ color: '#10b981' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>WORKSPACE MRR RUNRATE</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>${totalRevenue.toLocaleString()}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>ARR: ${(totalRevenue * 12).toLocaleString()}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={22} style={{ color: '#06b6d4' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SYSTEM ENGINE STATUS</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Healthy <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--success)', borderRadius: '50%', display: 'inline-block' }}></span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Latencies: 4ms API / 18ms DB</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card" style={{ height: '360px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>SaaS Monthly Revenue Growth ($ YTD)</h4>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ height: '360px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>Workspace Plans Count</h4>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Workspace Tenant Sandboxes</h3>
          <span className="badge badge-primary">Organizations Registry</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Domain Link</th>
                <th>Pricing Tier</th>
                <th>Telemetry Seats</th>
                <th>Monthly Charge</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id}>
                  <td style={{ fontWeight: 650 }}>{org.name}</td>
                  <td>{org.domain}</td>
                  <td>
                    <select
                      className="form-select"
                      value={org.plan}
                      onChange={(e) => handlePlanChange(org.id, e.target.value)}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', width: '130px' }}
                    >
                      <option value="starter">Starter</option>
                      <option value="pro">Professional</option>
                      <option value="business">Business</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </td>
                  <td>{org.usersCount} Employees</td>
                  <td style={{ fontWeight: 650 }}>${org.revenue.toLocaleString()} YTD</td>
                  <td>
                    <span className={`badge ${org.status === 'active' ? 'badge-success' : org.status === 'suspended' ? 'badge-error' : 'badge-warning'}`}>
                      {org.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={org.status}
                      onChange={(e) => handleStatusChange(org.id, e.target.value)}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', width: '120px' }}
                    >
                      <option value="active">Activate</option>
                      <option value="suspended">Suspend</option>
                      <option value="trial">Set Trial</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-12" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, fontWeight: 700 }}>Initialize Tenant</h4>
          <form onSubmit={handleAddOrg} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Company Name</label>
              <input
                type="text"
                required
                placeholder="Oscorp Systems"
                className="form-input"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Domain Name</label>
              <input
                type="text"
                required
                placeholder="oscorp.com"
                className="form-input"
                value={newOrgDomain}
                onChange={(e) => setNewOrgDomain(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Pricing SLA Tier</label>
              <select
                className="form-select"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
              >
                <option value="starter">Starter</option>
                <option value="pro">Professional</option>
                <option value="business">Business</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Provision Tenant Sandbox
            </button>
          </form>
        </div>

        <div className="card" style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontWeight: 700 }}>SSO & RBAC Security Audit Logs</h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Real-time Node Event Tracking</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '310px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-sidebar)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{log.action}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    User: <span style={{ color: 'var(--text-secondary)', fontWeight: 550 }}>{log.user}</span> ({log.role})
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-end' }}>
                  <span className={`badge ${log.status === 'success' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                    {log.status}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LoginAttemptsTable />
    </div>
  );
};
