'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CRMStateContext = createContext(undefined);

// Seeds Data
const initialOrganizations = [
  { id: 'org_1', name: 'Stark Enterprises', domain: 'starkenterprises.com', plan: 'enterprise', status: 'active', revenue: 45000, usersCount: 145, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'org_2', name: 'Wayne Enterprises', domain: 'waynecorp.com', plan: 'enterprise', status: 'active', revenue: 38000, usersCount: 98, createdAt: '2026-02-15T10:30:00Z' },
  { id: 'org_3', name: 'Tyrell Corporation', domain: 'tyrell.io', plan: 'business', status: 'active', revenue: 15000, usersCount: 32, createdAt: '2026-03-01T12:00:00Z' },
  { id: 'org_4', name: 'Acme Products', domain: 'acme.org', plan: 'pro', status: 'active', revenue: 4500, usersCount: 12, createdAt: '2026-04-20T09:15:00Z' },
  { id: 'org_5', name: 'Cyberdyne Systems', domain: 'cyberdyne.jp', plan: 'starter', status: 'suspended', revenue: 990, usersCount: 4, createdAt: '2026-05-18T14:45:00Z' }
];

const initialCustomers = [
  {
    id: 'cust_1',
    name: 'Olivia Stark',
    company: 'Stark Enterprises',
    email: 'olivia.stark@starkenterprises.com',
    phone: '+1 (555) 782-7561',
    industry: 'Defense & Aerospace',
    website: 'https://starkenterprises.com',
    taxId: 'TX-98231872',
    address: '10880 Wilshire Blvd, Los Angeles, CA 90024',
    assignedTo: 'David Kim',
    status: 'active',
    priority: 'critical',
    riskScore: 8,
    tags: ['VIP', 'Enterprise', 'Multi-tenant'],
    aiInsights: [
      'Customer sentiment is highly positive. Ready for contract expansion discussions in Q3.',
      'High engagement with AI automation tools, saving over 42 manual hours this month.'
    ],
    mrr: 4500,
    createdAt: '2026-01-15T11:00:00Z'
  },
  {
    id: 'cust_2',
    name: 'Bruce Wayne',
    company: 'Wayne Enterprises',
    email: 'bruce@waynecorp.com',
    phone: '+1 (555) 902-1245',
    industry: 'Technology & Investment',
    website: 'https://waynecorp.com',
    taxId: 'TX-11823992',
    address: '1007 Mountain Drive, Gotham City, NJ 07001',
    assignedTo: 'Maya Patel',
    status: 'active',
    priority: 'high',
    riskScore: 12,
    tags: ['Automotive', 'Global Account'],
    aiInsights: [
      'Frequent support tickets related to private satellite APIs. Support performance is critical.',
      'A renewal meeting is scheduled for next month. Suggesting pitching the Cyber-Suite module.'
    ],
    mrr: 3800,
    createdAt: '2026-02-18T14:22:00Z'
  },
  {
    id: 'cust_3',
    name: 'Eldon Tyrell',
    company: 'Tyrell Corporation',
    email: 'eldon@tyrell.io',
    phone: '+1 (555) 303-9182',
    industry: 'Biotechnology',
    website: 'https://tyrell.io',
    taxId: 'TX-55123981',
    address: 'Pyramid District 4, Los Angeles, CA 90012',
    assignedTo: 'Alex Rivera',
    status: 'onboarding',
    priority: 'medium',
    riskScore: 28,
    tags: ['Bio-Tech', 'Beta Tester'],
    aiInsights: [
      'Onboarding phase is 60% complete. Needs assistance configuring custom action webhooks.',
      'Slight delays in payment processing for initial setups. Watch risk score closely.'
    ],
    mrr: 1500,
    createdAt: '2026-03-05T09:00:00Z'
  }
];

const initialLeads = [
  {
    id: 'lead_1',
    name: 'Peter Parker',
    company: 'Daily Bugle',
    email: 'peter@dailybugle.com',
    phone: '+1 (555) 234-9812',
    source: 'website',
    status: 'qualified',
    value: 12000,
    score: 87,
    assignedTo: 'David Kim',
    riskScore: 15,
    createdAt: '2026-06-10T10:00:00Z',
    notes: 'Interested in communication tracking. Seeking dynamic automation triggers for news briefs.'
  },
  {
    id: 'lead_2',
    name: 'Sarah Connor',
    company: 'TechNoir Security',
    email: 'sconnor@technoir.org',
    phone: '+1 (555) 789-0123',
    source: 'linkedin',
    status: 'negotiation',
    value: 24000,
    score: 94,
    assignedTo: 'Alex Rivera',
    riskScore: 5,
    createdAt: '2026-06-15T08:30:00Z',
    notes: 'Urgent migration from legacy Zoho setup. Critical security and RBAC permissions needed.'
  },
  {
    id: 'lead_3',
    name: 'Neo Anderson',
    company: 'Metacortex Inc.',
    email: 'neo@metacortex.net',
    phone: '+1 (555) 456-7890',
    source: 'cold_call',
    status: 'new',
    value: 8000,
    score: 52,
    assignedTo: 'Emma Watson',
    riskScore: 42,
    createdAt: '2026-06-25T15:45:00Z',
    notes: 'General inquiry from a cold sales call. Requested an automated email summary brochure.'
  }
];

const initialInvoices = [
  {
    id: 'inv_1',
    invoiceNumber: 'INV-2026-001',
    companyName: 'Stark Enterprises',
    customerEmail: 'olivia.stark@starkenterprises.com',
    amount: 4500.00,
    status: 'paid',
    dueDate: '2026-07-15',
    paidAt: '2026-07-02T16:00:00Z',
    transactionId: 'txn_98231908231',
    items: [
      { description: 'Antigravity CRM Enterprise Plan Monthly', quantity: 1, unitPrice: 4500.00 }
    ],
    qrCode: 'ANTIGRAVITY-INV-2026-001'
  },
  {
    id: 'inv_2',
    invoiceNumber: 'INV-2026-002',
    companyName: 'Wayne Enterprises',
    customerEmail: 'bruce@waynecorp.com',
    amount: 3800.00,
    status: 'paid',
    dueDate: '2026-07-20',
    paidAt: '2026-07-05T09:12:00Z',
    transactionId: 'txn_12390881232',
    items: [
      { description: 'Antigravity CRM Enterprise Plan Monthly', quantity: 1, unitPrice: 3800.00 }
    ],
    qrCode: 'ANTIGRAVITY-INV-2026-002'
  },
  {
    id: 'inv_3',
    invoiceNumber: 'INV-2026-003',
    companyName: 'Tyrell Corporation',
    customerEmail: 'eldon@tyrell.io',
    amount: 1500.00,
    status: 'pending',
    dueDate: '2026-07-25',
    items: [
      { description: 'Antigravity CRM Business Plan Monthly', quantity: 1, unitPrice: 1500.00 },
      { description: 'Setup and API Integration Consultancy', quantity: 1, unitPrice: 0.00 }
    ],
    qrCode: 'ANTIGRAVITY-INV-2026-003'
  }
];

const initialTasks = [
  { id: 'task_1', title: 'Schedule Stark Q3 Expansion Meeting', description: 'Discuss API seat additions and custom security options.', priority: 'high', status: 'in_progress', dueDate: '2026-07-10', assignedTo: 'David Kim', dependencies: [], tags: ['Stark', 'Sales'] },
  { id: 'task_2', title: 'Resolve Wayne API Satellite Ticket', description: 'Investigate Webhook latency for satellite location streams.', priority: 'high', status: 'todo', dueDate: '2026-07-09', assignedTo: 'Maya Patel', dependencies: [], tags: ['Wayne', 'Support'] },
  { id: 'task_3', title: 'Setup Tyrell Replication Sandbox', description: 'Configure sandbox workspace environment for biological records tracking.', priority: 'medium', status: 'completed', dueDate: '2026-07-05', assignedTo: 'Alex Rivera', dependencies: [], tags: ['Tyrell', 'Setup'] },
  { id: 'task_4', title: 'Update Sales deck for Q3', description: 'Incorporate new automation and CRM chatbot performance statistics.', priority: 'low', status: 'todo', dueDate: '2026-07-18', assignedTo: 'Emma Watson', dependencies: [], tags: ['Marketing'] }
];

const initialTickets = [
  {
    id: 'tkt_1',
    customerName: 'Bruce Wayne',
    customerEmail: 'bruce@waynecorp.com',
    subject: 'Satellite Webhook Latency',
    description: 'We are experiencing a 400ms delay in data feeds from orbit nodes through the Webhook action module.',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'Maya Patel',
    createdAt: '2026-07-06T10:00:00Z',
    timeline: [
      { sender: 'Bruce Wayne', message: 'The satellite webhooks are bottlenecking. We need latency below 100ms.', timestamp: '2026-07-06T10:00:00Z' },
      { sender: 'AI Support Assistant', message: 'Hello Mr. Wayne. I analyzed the payload structures and notice heavy nested payload schemas. Compressing the geo-JSON arrays will decrease serialization delays by 150ms. An engineer has been paged to optimize network routes.', timestamp: '2026-07-06T10:02:00Z', isAI: true },
      { sender: 'Maya Patel', message: 'Hi Mr. Wayne, I am testing routes through the AWS Virginia gateway directly. I will follow up in 2 hours.', timestamp: '2026-07-06T11:45:00Z' }
    ]
  },
  {
    id: 'tkt_2',
    customerName: 'Eldon Tyrell',
    customerEmail: 'eldon@tyrell.io',
    subject: 'Sandbox API Token Expired',
    description: 'The beta testing API token expires every 24 hours. Can we extend it to 7 days for developers?',
    priority: 'medium',
    status: 'open',
    assignedTo: 'Alex Rivera',
    createdAt: '2026-07-07T08:30:00Z',
    timeline: [
      { sender: 'Eldon Tyrell', message: 'Token renewal frequency is interrupting our replicant staging tests. Please extend.', timestamp: '2026-07-07T08:30:00Z' }
    ]
  }
];

const initialCommunications = [
  { id: 'comm_1', type: 'call', direction: 'incoming', contactName: 'Olivia Stark', details: 'Discussed pricing tier upgrade. Indicated strong readiness for annual commitment.', timestamp: '2026-07-06T14:30:00Z', duration: '8m 42s', sentiment: 'positive', aiSummary: 'Client wants to proceed with Enterprise Tier renewal. Key topics: Multi-tenant safety, SLA agreements. Sentiment: Extremely Enthusiastic.' },
  { id: 'comm_2', type: 'email', direction: 'outgoing', contactName: 'Bruce Wayne', details: 'Sent follow up documentation on orbit node webhook compressions.', timestamp: '2026-07-06T11:50:00Z', sentiment: 'neutral', aiSummary: 'Technical routing documents sent. Awaiting feedback from client engineering team.' },
  { id: 'comm_3', type: 'whatsapp', direction: 'incoming', contactName: 'Eldon Tyrell', details: 'Staging deployment for replication database succeeded. Requesting API verification.', timestamp: '2026-07-07T09:12:00Z', sentiment: 'positive', aiSummary: 'Customer confirmed staging sandbox is active. Requesting token expansion.' }
];

const initialWorkflows = [
  { id: 'wf_1', name: 'Auto-Assign High-Score Leads', trigger: 'Lead Created', actions: ['Condition: AI Score > 80', 'Assign Employee: David Kim', 'Send Email: Welcome Brochure', 'Notify Team via Slack'], active: true },
  { id: 'wf_2', name: 'Generate Invoice on Close Won', trigger: 'Payment Received', actions: ['Generate Invoice', 'Email PDF Receipt', 'Update Customer status: active', 'Create Task: Schedule Onboarding Call'], active: true },
  { id: 'wf_3', name: 'SLA Escalation Ticket Alert', trigger: 'Ticket Raised', actions: ['Condition: Priority = critical', 'Assign Employee: Maya Patel', 'Send SMS alert', 'Delay: 1 hour', 'Notify Slack: Alert SLA Breach'], active: false }
];

const initialAuditLogs = [
  { id: 'aud_1', user: 'Eleanor Vance', role: 'Super Admin', action: 'Modified System Settings: Multi-factor Authentication forced', timestamp: '2026-07-07T09:30:00Z', status: 'success' },
  { id: 'aud_2', user: 'Rajesh Kesevan', role: 'Admin', action: 'Created Webhook Integration Link for Wayne Systems', timestamp: '2026-07-07T10:15:00Z', status: 'success' },
  { id: 'aud_3', user: 'David Kim', role: 'Sales Representative', action: 'Converted Lead (Sarah Connor) to Active Customer', timestamp: '2026-07-07T11:00:00Z', status: 'success' }
];

export const CRMStateProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState(() => {
    if (typeof window === 'undefined') return initialOrganizations;
    const saved = localStorage.getItem('crm_orgs');
    return saved ? JSON.parse(saved) : initialOrganizations;
  });

  const [customers, setCustomers] = useState(() => {
    if (typeof window === 'undefined') return initialCustomers;
    const saved = localStorage.getItem('crm_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [leads, setLeads] = useState(() => {
    if (typeof window === 'undefined') return initialLeads;
    const saved = localStorage.getItem('crm_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [invoices, setInvoices] = useState(() => {
    if (typeof window === 'undefined') return initialInvoices;
    const saved = localStorage.getItem('crm_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [tasks, setTasks] = useState(() => {
    if (typeof window === 'undefined') return initialTasks;
    const saved = localStorage.getItem('crm_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [tickets, setTickets] = useState(() => {
    if (typeof window === 'undefined') return initialTickets;
    const saved = localStorage.getItem('crm_tickets');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [communications, setCommunications] = useState(() => {
    if (typeof window === 'undefined') return initialCommunications;
    const saved = localStorage.getItem('crm_communications');
    return saved ? JSON.parse(saved) : initialCommunications;
  });

  const [workflows, setWorkflows] = useState(() => {
    if (typeof window === 'undefined') return initialWorkflows;
    const saved = localStorage.getItem('crm_workflows');
    return saved ? JSON.parse(saved) : initialWorkflows;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    if (typeof window === 'undefined') return initialAuditLogs;
    const saved = localStorage.getItem('crm_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Sync state to localStorage
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('crm_orgs', JSON.stringify(organizations)); }, [organizations]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('crm_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('crm_leads', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('crm_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('crm_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('crm_tickets', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('crm_communications', JSON.stringify(communications)); }, [communications]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('crm_workflows', JSON.stringify(workflows)); }, [workflows]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('crm_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);

  // Mutations
  const addOrganization = (org) => {
    const newOrg = {
      ...org,
      id: `org_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOrganizations((prev) => [newOrg, ...prev]);
    addAuditLog(`Added Organization: ${org.name}`, 'System', 'Admin');
  };

  const updateOrganization = (id, updates) => {
    setOrganizations((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    addAuditLog(`Updated Organization ID ${id}`, 'System', 'Admin');
  };

  const addCustomer = (cust) => {
    const newCust = {
      ...cust,
      id: `cust_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [newCust, ...prev]);
    addAuditLog(`Created Customer profile: ${cust.name} (${cust.company})`, 'System', 'Admin');
  };

  const updateCustomer = (id, updates) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCustomer = (id) => {
    const target = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    addAuditLog(`Deleted Customer: ${target?.name || id}`, 'System', 'Admin', 'warning');
  };

  const addLead = (lead) => {
    const newLead = {
      ...lead,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    addAuditLog(`Created Lead: ${lead.name} (${lead.company})`, 'System', 'Sales Rep');
    triggerWorkflowSimulation('Lead Created');
  };

  const updateLead = (id, updates) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const convertLead = (leadId) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    setLeads((prev) => prev.filter((l) => l.id !== leadId));

    const newCustomer = {
      id: `cust_${Date.now()}`,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      industry: 'Technology',
      website: `https://${lead.company.toLowerCase().replace(/\s+/g, '')}.com`,
      taxId: `TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: '100 Main St, Tech City, USA',
      assignedTo: lead.assignedTo,
      status: 'onboarding',
      priority: lead.value > 15000 ? 'high' : 'medium',
      riskScore: 10,
      tags: ['Converted', 'Lead-In'],
      aiInsights: [
        'Converted from highly scoring lead.',
        'Initial MRR generated from estimated opportunity value.'
      ],
      mrr: Math.floor(lead.value / 12),
      createdAt: new Date().toISOString(),
    };

    setCustomers((prev) => [newCustomer, ...prev]);

    addInvoice({
      companyName: lead.company,
      customerEmail: lead.email,
      amount: lead.value,
      status: 'pending',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        { description: `Antigravity CRM System Setup Opportunity Fee for ${lead.company}`, quantity: 1, unitPrice: lead.value }
      ]
    });

    addAuditLog(`Converted Lead to Customer: ${lead.name}`, 'System', 'Sales Rep');
    triggerWorkflowSimulation('Payment Received');
  };

  const addInvoice = (invoice) => {
    const invCount = invoices.length + 1;
    const invoiceNumber = `INV-2026-${String(invCount).padStart(3, '0')}`;
    const newInvoice = {
      ...invoice,
      id: `inv_${Date.now()}`,
      invoiceNumber,
      qrCode: `ANTIGRAVITY-${invoiceNumber}`
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    addAuditLog(`Generated Invoice: ${invoiceNumber} for ${invoice.companyName}`, 'System', 'Finance');
  };

  const payInvoice = (invoiceId) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'paid',
              paidAt: new Date().toISOString(),
              transactionId: `txn_${Math.random().toString(36).substring(2, 13)}`,
            }
          : inv
      )
    );
    addAuditLog(`Invoice Paid ID ${invoiceId}`, 'System', 'Finance');
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: `task_${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addTicket = (ticket) => {
    const newTicket = {
      ...ticket,
      id: `tkt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      timeline: [
        { sender: ticket.customerName, message: ticket.description, timestamp: new Date().toISOString() }
      ]
    };
    setTickets((prev) => [newTicket, ...prev]);
    addAuditLog(`Support Ticket Raised: ${ticket.subject}`, 'Client Portal', 'Customer');
    triggerWorkflowSimulation('Ticket Raised');
  };

  const addTicketReply = (ticketId, message, sender, isAI = false) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              timeline: [
                ...t.timeline,
                { sender, message, timestamp: new Date().toISOString(), isAI }
              ]
            }
          : t
      )
    );
  };

  const updateTicketStatus = (id, status) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    addAuditLog(`Support Ticket status updated to ${status} for ID ${id}`, 'System', 'Support');
  };

  const addCommunication = (comm) => {
    const newComm = {
      ...comm,
      id: `comm_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setCommunications((prev) => [newComm, ...prev]);
  };

  const addWorkflow = (wf) => {
    const newWf = {
      ...wf,
      id: `wf_${Date.now()}`,
    };
    setWorkflows((prev) => [...prev, newWf]);
  };

  const updateWorkflow = (id, updates) => {
    setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  const triggerWorkflowSimulation = (triggerName) => {
    const activeWfs = workflows.filter((w) => w.trigger === triggerName && w.active);
    activeWfs.forEach((wf) => {
      addAuditLog(`Triggered Workflow: "${wf.name}"`, 'Automation Engine', 'System');
      wf.actions.forEach((act) => {
        setTimeout(() => {
          addAuditLog(`Action Executed: ${act}`, 'Automation Engine', 'System');
        }, 100);
      });
    });
  };

  const addAuditLog = (action, user, role, status = 'success') => {
    const newLog = {
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      user,
      role,
      action,
      timestamp: new Date().toISOString(),
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev].slice(0, 50));
  };

  const resetDatabase = () => {
    setOrganizations(initialOrganizations);
    setCustomers(initialCustomers);
    setLeads(initialLeads);
    setInvoices(initialInvoices);
    setTasks(initialTasks);
    setTickets(initialTickets);
    setCommunications(initialCommunications);
    setWorkflows(initialWorkflows);
    setAuditLogs(initialAuditLogs);
    if (typeof window !== 'undefined') localStorage.clear();
    addAuditLog('Database reset to initial demo seeds', 'System', 'Admin', 'warning');
  };

  return (
    <CRMStateContext.Provider
      value={{
        organizations,
        customers,
        leads,
        invoices,
        tasks,
        tickets,
        communications,
        workflows,
        auditLogs,
        addOrganization,
        updateOrganization,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addLead,
        updateLead,
        deleteLead,
        convertLead,
        addInvoice,
        payInvoice,
        addTask,
        updateTask,
        deleteTask,
        addTicket,
        addTicketReply,
        updateTicketStatus,
        addCommunication,
        addWorkflow,
        updateWorkflow,
        triggerWorkflowSimulation,
        addAuditLog,
        resetDatabase,
      }}
    >
      {children}
    </CRMStateContext.Provider>
  );
};

export const useCRMState = () => {
  const context = useContext(CRMStateContext);
  if (!context) {
    throw new Error('useCRMState must be used within a CRMStateProvider');
  }
  return context;
};
