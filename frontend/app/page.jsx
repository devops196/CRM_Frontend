"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";

import {
  Activity, ArrowRight, ArrowUpRight, BarChart3, Bell, Building2,
  CalendarCheck, CalendarDays, Check, CheckCheck, CheckCircle2,
  ChevronDown, CircleAlert, CircleDollarSign, CircleHelp,
  ClipboardCheck, ClipboardList, Clock3, Command, Download,
  FileSpreadsheet, Filter, LayoutDashboard, LockKeyhole, LogOut,
  Megaphone, Menu, Moon, Pencil, Plus, RefreshCw, Rocket, Search,
  Settings, ShieldCheck, SlidersHorizontal, Sparkles, Sun, Target,
  Trash2, TrendingUp, Users, UserRound, Zap, Layers3, X
} from "lucide-react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

const NAV = [
  ["Dashboard", LayoutDashboard, "Overview"],
  ["Employees", Users, "People"],
  ["Team Lookup", UserRound, "Directory"],
  ["Leave Management", CalendarDays, "Time off"],
  ["Credits & Usage", CircleDollarSign, "Benefits"],
  ["Announcements", Megaphone, "Company news"],
  ["Onboarding", ClipboardList, "Joiners"],
  ["Offboarding", LogOut, "Leavers"],
  ["Reports & Export", BarChart3, "Insights"],
  ["Admin Tools", ShieldCheck, "Admin"],
  ["Settings", Settings, "Workspace"],
];

const DEMO_EMPLOYEES = [
  { id: 1, full_name: "Kuber Singh", email: "admin@company.com", department: "Operations", role: "CRM Administrator", status: "Active", app_role: "Admin", joined_on: "2025-07-01", phone: "9000000001" },
  { id: 2, full_name: "Neha Gupta", email: "neha.hr@company.com", department: "HR", role: "HR Manager", status: "Active", app_role: "HR", joined_on: "2025-08-12", phone: "9000000002" },
  { id: 3, full_name: "Vikram Joshi", email: "vikram.hr@company.com", department: "HR", role: "HR Executive", status: "Active", app_role: "HR", joined_on: "2025-09-15", phone: "9000000003" },
  { id: 4, full_name: "Aditi Sharma", email: "aditi.sharma@company.com", department: "Engineering", role: "Software Engineer", status: "Active", app_role: "Employee", joined_on: "2026-01-12", phone: "9000000004" },
  { id: 5, full_name: "Rohan Mehta", email: "rohan.mehta@company.com", department: "Product", role: "Product Manager", status: "Active", app_role: "Employee", joined_on: "2025-11-05", phone: "9000000005" },
  { id: 6, full_name: "Priya Verma", email: "priya.verma@company.com", department: "Design", role: "UX Designer", status: "On Leave", app_role: "Employee", joined_on: "2025-08-18", phone: "9000000006" },
  { id: 7, full_name: "Arjun Singh", email: "arjun.singh@company.com", department: "Marketing", role: "Marketing Executive", status: "Active", app_role: "Employee", joined_on: "2026-03-10", phone: "9000000007" },
  { id: 8, full_name: "Ishita Jain", email: "ishita.jain@company.com", department: "Finance", role: "Financial Analyst", status: "Active", app_role: "Employee", joined_on: "2025-10-20", phone: "9000000008" },
  { id: 9, full_name: "Dev Malhotra", email: "dev.malhotra@company.com", department: "Engineering", role: "Backend Developer", status: "Active", app_role: "Employee", joined_on: "2026-02-02", phone: "9000000009" },
  { id: 10, full_name: "Meera Kapoor", email: "meera.kapoor@company.com", department: "Engineering", role: "QA Engineer", status: "Active", app_role: "Employee", joined_on: "2025-12-11", phone: "9000000010" },
  { id: 11, full_name: "Yash Agarwal", email: "yash.agarwal@company.com", department: "Sales", role: "Sales Associate", status: "Active", app_role: "Employee", joined_on: "2026-04-04", phone: "9000000011" },
  { id: 12, full_name: "Sana Khan", email: "sana.khan@company.com", department: "Operations", role: "Operations Analyst", status: "Active", app_role: "Employee", joined_on: "2025-07-22", phone: "9000000012" },
  { id: 13, full_name: "Kabir Rathore", email: "kabir.rathore@company.com", department: "Product", role: "Product Designer", status: "Active", app_role: "Employee", joined_on: "2026-05-16", phone: "9000000013" },
  { id: 14, full_name: "Ananya Das", email: "ananya.das@company.com", department: "Marketing", role: "Content Strategist", status: "Active", app_role: "Employee", joined_on: "2026-06-03", phone: "9000000014" },
  { id: 15, full_name: "Rahul Bansal", email: "rahul.bansal@company.com", department: "Engineering", role: "DevOps Engineer", status: "Active", app_role: "Employee", joined_on: "2025-09-01", phone: "9000000015" },
];

const DEMO_RECORDS = {
  leaves: [
    { id: 1, employee_id: 4, leave_type: "Casual Leave", start_date: "2026-11-10", end_date: "2026-11-11", reason: "Family commitment", status: "Pending", reviewed_by: null, review_note: null, created_at: "2026-10-28T09:30:00" },
    { id: 2, employee_id: 6, leave_type: "Sick Leave", start_date: "2026-10-28", end_date: "2026-10-30", reason: "Not feeling well", status: "Approved", reviewed_by: 2, review_note: "Approved for recovery", created_at: "2026-10-27T11:10:00" },
    { id: 3, employee_id: 5, leave_type: "Earned Leave", start_date: "2026-11-02", end_date: "2026-11-04", reason: "Personal travel", status: "Pending", reviewed_by: null, review_note: null, created_at: "2026-10-26T12:40:00" },
  ],
  credits: [
    { id: 1, category: "Learning", employee_id: 4, allocated_credits: 100, used_credits: 25, updated_at: "2026-10-28T09:30:00" },
    { id: 2, category: "Wellness", employee_id: 5, allocated_credits: 75, used_credits: 15, updated_at: "2026-10-25T10:15:00" },
    { id: 3, category: "Learning", employee_id: 9, allocated_credits: 120, used_credits: 60, updated_at: "2026-10-23T14:00:00" },
    { id: 4, category: "Travel", employee_id: 11, allocated_credits: 200, used_credits: 40, updated_at: "2026-10-24T13:45:00" },
    { id: 5, category: "Wellness", employee_id: 12, allocated_credits: 80, used_credits: 10, updated_at: "2026-10-21T08:40:00" },
  ],
  announcements: [
    { id: 1, title: "Welcome to Internal CRM", body: "The new employee workspace is ready for the pilot. Please review your profile and contact HR if anything needs updating.", created_by: 1, published: true, created_at: "2026-10-28T09:00:00" },
    { id: 2, title: "November Team Town Hall", body: "Our monthly town hall will take place on November 6. Please share agenda suggestions with your manager.", created_by: 2, published: true, created_at: "2026-10-27T13:20:00" },
    { id: 3, title: "Benefits enrollment reminder", body: "Please review your wellness and learning credit balances before the next monthly review.", created_by: 2, published: true, created_at: "2026-10-25T16:10:00" },
  ],
  onboarding: [
    { id: 1, workflow_type: "onboarding", employee_id: 4, title: "Complete security training", description: "Finish the company security awareness module.", owner_id: 2, due_date: "2026-11-05", status: "Pending", created_at: "2026-10-27T09:00:00" },
    { id: 2, workflow_type: "onboarding", employee_id: 9, title: "Set up development environment", description: "Verify repository and development access.", owner_id: 1, due_date: "2026-11-03", status: "In Progress", created_at: "2026-10-26T09:00:00" },
    { id: 3, workflow_type: "onboarding", employee_id: 13, title: "Meet your product team", description: "Schedule introductions with design and engineering.", owner_id: 2, due_date: "2026-11-06", status: "Completed", created_at: "2026-10-25T09:00:00" },
  ],
  offboarding: [
    { id: 1, workflow_type: "offboarding", employee_id: 11, title: "Collect company assets", description: "Confirm laptop and access card return checklist.", owner_id: 2, due_date: "2026-11-12", status: "Pending", created_at: "2026-10-26T10:00:00" },
  ],
  audit: [
    { id: 1, actor_employee_id: 1, action: "employee.created", entity_type: "employee", entity_id: 15, details: { email: "rahul.bansal@company.com" }, created_at: "2026-10-28T10:11:00" },
    { id: 2, actor_employee_id: 2, action: "leave.applied", entity_type: "leave_request", entity_id: 1, details: { leave_type: "Casual Leave" }, created_at: "2026-10-28T09:30:00" },
    { id: 3, actor_employee_id: 1, action: "credits.allocated", entity_type: "credit_allocation", entity_id: 5, details: { category: "Wellness" }, created_at: "2026-10-24T12:10:00" },
  ],
};

const INITIAL_FORMS = {
  employee: { full_name: "", email: "", department: "Engineering", role: "", app_role: "Employee", status: "Active", phone: "" },
  leave: { leave_type: "Casual Leave", start_date: "", end_date: "", reason: "" },
  credit: { category: "Learning", employee_id: "4", allocated_credits: "100", used_credits: "0" },
  announcement: { title: "", body: "", published: true },
  task: { workflow_type: "onboarding", employee_id: "4", title: "", description: "", owner_id: "2", due_date: "", status: "Pending" },
};

function initials(name = "") {
  return name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "U";
}
function dateLabel(input, options = {}) {
  if (!input) return "—";
  const d = new Date(`${String(input).slice(0, 10)}T12:00:00`);
  return Number.isNaN(d.getTime()) ? String(input) : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: options.year ? "numeric" : undefined }).format(d);
}
function timestampLabel(input) {
  if (!input) return "Just now";
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? String(input) : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);
}
function csvEscape(value) {
  const plain = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${plain.replaceAll('"', '""')}"`;
}
function exportCsv(filename, rows) {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.map(csvEscape).join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function api(path, token, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
  });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try { const body = await response.json(); message = body.detail || message; } catch {}
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState(DEMO_EMPLOYEES);
  const [records, setRecords] = useState(DEMO_RECORDS);
  const [metrics, setMetrics] = useState({ total_employees: 15, active_employees: 14, on_leave_today: 1, departments: 8 });
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All departments");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [connection, setConnection] = useState("Demo preview");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL_FORMS.employee);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const googleInitialized = useRef(false);

  const isWorkspace = Boolean(token || demoMode);
  const isAdminOrHr = ["Admin", "HR"].includes(user?.app_role);
  const isAdmin = user?.app_role === "Admin";
  const pendingLeaves = records.leaves.filter((item) => item.status === "Pending");
  const announcements = records.announcements;
  const departments = useMemo(() => ["All departments", ...new Set(employees.map((e) => e.department).filter(Boolean).sort())], [employees]);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("crm_token");
      const savedTheme = localStorage.getItem("crm_theme");
      if (savedTheme === "dark") setDarkMode(true);
      if (savedToken) {
        setEmployees([]);
        setRecords({ leaves: [], credits: [], announcements: [], onboarding: [], offboarding: [], audit: [] });
        setMetrics({ total_employees: 0, active_employees: 0, on_leave_today: 0, departments: 0 });
        setToken(savedToken); loadMe(savedToken);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (window.google?.accounts?.id) {
      setGoogleReady(true);
      return;
    }

    const script = existingScript || document.createElement("script");
    const handleLoad = () => setGoogleReady(true);
    const handleError = () =>
      setError("Google Sign-In could not load. Check your network connection.");

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    if (!existingScript) {
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    if (!token && !demoMode) return;
    loadSection(active);
    // Search and view filters stay client-side so typing is instant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, active, demoMode]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3300);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    try { localStorage.setItem("crm_theme", darkMode ? "dark" : "light"); } catch {}
  }, [darkMode]);

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen((v) => !v); }
      if (event.key === "Escape") { setCommandOpen(false); setNotificationsOpen(false); setShowForm(false); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function loadMe(t) {
    try {
      const me = await api("/auth/me", t);
      setUser(me); setConnection("Connected to live workspace");
    } catch {
      localStorage.removeItem("crm_token"); setToken(""); setUser(null); setConnection("Session expired");
    }
  }

  const setDemoSection = useCallback((section) => {
    if (section === "Dashboard") {
      setMetrics({
        total_employees: employees.filter((e) => e.status !== "Inactive").length,
        active_employees: employees.filter((e) => e.status === "Active").length,
        on_leave_today: employees.filter((e) => e.status === "On Leave").length,
        departments: new Set(employees.filter((e) => e.status !== "Inactive").map((e) => e.department)).size,
      });
      return;
    }
    if (section === "Reports & Export") return;
    if (section === "Settings") return;
    if (section === "Admin Tools" && user?.app_role !== "Admin") return;
  }, [employees, user]);

  async function loadSection(section) {
    if (demoMode && !token) {
      setConnection("Demo workspace · local changes only");
      setDemoSection(section);
      return;
    }
    if (!token) return;
    setLoading(true); setError("");
    try {
      if (section === "Dashboard") {
        const results = await Promise.allSettled([
          api("/dashboard", token), api("/employees", token), api("/leaves", token),
          api("/announcements", token), api("/workflows/onboarding", token), api("/workflows/offboarding", token), api("/credits", token),
        ]);
        if (results.every((result) => result.status === "rejected")) throw new Error("The API could not be reached. Start the FastAPI backend and check NEXT_PUBLIC_API_URL.");
        if (results[0].status === "fulfilled") setMetrics(results[0].value);
        if (results[1].status === "fulfilled") setEmployees(results[1].value);
        setRecords((old) => ({ ...old,
          leaves: results[2].status === "fulfilled" ? results[2].value : old.leaves,
          announcements: results[3].status === "fulfilled" ? results[3].value : old.announcements,
          onboarding: results[4].status === "fulfilled" ? results[4].value : old.onboarding,
          offboarding: results[5].status === "fulfilled" ? results[5].value : old.offboarding,
          credits: results[6].status === "fulfilled" ? results[6].value : old.credits,
        }));
      } else if (section === "Employees" || section === "Team Lookup" || section === "Reports & Export") {
        setEmployees(await api("/employees", token));
        if (section === "Reports & Export") {
          const [leaveResult, creditResult] = await Promise.allSettled([api("/leaves", token), api("/credits", token)]);
          setRecords((old) => ({ ...old, leaves: leaveResult.status === "fulfilled" ? leaveResult.value : old.leaves, credits: creditResult.status === "fulfilled" ? creditResult.value : old.credits }));
        }
      } else if (section === "Leave Management") {
        const result = await api("/leaves", token); setRecords((old) => ({ ...old, leaves: result }));
      } else if (section === "Credits & Usage") {
        const result = await api("/credits", token); setRecords((old) => ({ ...old, credits: result }));
      } else if (section === "Announcements") {
        const result = await api("/announcements", token); setRecords((old) => ({ ...old, announcements: result }));
      } else if (section === "Onboarding") {
        const result = await api("/workflows/onboarding", token); setRecords((old) => ({ ...old, onboarding: result }));
      } else if (section === "Offboarding") {
        const result = await api("/workflows/offboarding", token); setRecords((old) => ({ ...old, offboarding: result }));
      } else if (section === "Admin Tools") {
        if (user?.app_role === "Admin") { const result = await api("/audit-logs", token); setRecords((old) => ({ ...old, audit: result })); }
      }
      setConnection("Connected to live workspace");
    } catch (exception) {
      setConnection("API connection issue"); setError(exception.message || "Unable to load this section.");
    } finally { setLoading(false); }
  }

  function notify(message) { setToast(message); }
  function navigate(section) { setActive(section); setMobile(false); setNotificationsOpen(false); }

  function signIn() {
    setBusy(true);

    if (!window.google?.accounts?.id) {
        setBusy(false);
        notify("Google Sign-In is still loading.", "error");
        return;
    }

    try {
        window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,

            callback: async (response) => {
                try {
                    if (!response.credential) {
                        throw new Error("Google credential not received.");
                    }

                    const result = await fetch(`${API}/auth/google`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            credential: response.credential,
                        }),
                    });

                    const data = await result.json();

                    if (!result.ok) {
                        throw new Error(data.detail || "Login failed");
                    }

                    localStorage.setItem("crm_token", data.access_token);

                    setToken(data.access_token);
                    setUser(data.user);
                    setDemoMode(false);

                    notify("Login successful!", "success");

                } catch (error) {
                    console.error("Google Login:", error);
                    notify(error.message, "error");
                } finally {
                    setBusy(false);
                }
            },

            auto_select: false,
            cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt((notification) => {
            console.log("Google prompt:", {
                notDisplayed: notification.isNotDisplayed(),
                skipped: notification.isSkippedMoment(),
                dismissed: notification.isDismissedMoment(),
            });
        });

    } catch (error) {
        console.error("Google initialization error:", error);
        setBusy(false);
        notify("Google Sign-In initialization failed.", "error");
    }
}
  function enterDemo() {
    setToken(""); setUser({ id: 1, full_name: "Kuber Singh", email: "admin@company.com", app_role: "Admin", department: "Operations" });
    setEmployees(DEMO_EMPLOYEES.map((employee) => ({ ...employee })));
    setRecords(JSON.parse(JSON.stringify(DEMO_RECORDS)));
    setMetrics({ total_employees: 15, active_employees: 14, on_leave_today: 1, departments: 8 });
    setDemoMode(true); setActive("Dashboard"); setError(""); setConnection("Demo workspace · local changes only");
    notify("Demo workspace opened. Changes stay in this browser session.");
  }

  function logout() {
    localStorage.removeItem("crm_token"); setToken(""); setUser(null); setDemoMode(false); setActive("Dashboard");
    setError(""); setConnection("Signed out"); setNotificationsOpen(false);
  }

  function openForm() {
    setError(""); setEditingEmployee(null);
    if (active === "Employees" || active === "Team Lookup") setForm({ ...INITIAL_FORMS.employee });
    else if (active === "Leave Management") setForm({ ...INITIAL_FORMS.leave });
    else if (active === "Credits & Usage") setForm({ ...INITIAL_FORMS.credit });
    else if (active === "Announcements") setForm({ ...INITIAL_FORMS.announcement });
    else setForm({ ...INITIAL_FORMS.task, workflow_type: active === "Offboarding" ? "offboarding" : "onboarding" });
    setShowForm(true);
  }

  function editEmployee(employee) {
    setEditingEmployee(employee);
    setForm({ full_name: employee.full_name || "", email: employee.email || "", department: employee.department || "Engineering", role: employee.role || "", app_role: employee.app_role || "Employee", status: employee.status || "Active", phone: employee.phone || "" });
    setShowForm(true); setError("");
  }

  async function submitForm(event) {
    event.preventDefault();
    if (!token && !demoMode) { setError("Sign in with a company Google account or open the demo workspace first."); return; }
    setBusy(true); setError("");
    try {
      const body = { ...form };
      if (active === "Employees" || active === "Team Lookup") {
        if (editingEmployee) {
          if (demoMode) setEmployees((items) => items.map((item) => item.id === editingEmployee.id ? { ...item, ...body } : item));
          else {
            const { email, joined_on, ...editable } = body;
            if (!isAdmin) delete editable.app_role;
            await api(`/employees/${editingEmployee.id}`, token, { method: "PATCH", body: JSON.stringify(editable) });
          }
          notify("Employee profile updated.");
        } else {
          const employeeBody = { ...body, app_role: isAdmin ? body.app_role : "Employee", status: "Active", joined_on: new Date().toISOString().slice(0, 10) };
          if (demoMode) {
            const created = { ...employeeBody, id: Math.max(0, ...employees.map((item) => item.id)) + 1, status: "Active", created_at: new Date().toISOString() };
            setEmployees((items) => [created, ...items]);
          } else await api("/employees", token, { method: "POST", body: JSON.stringify(employeeBody) });
          notify("Employee added to the directory.");
        }
      } else if (active === "Leave Management") {
        const leaveBody = { ...body };
        if (demoMode) setRecords((items) => ({ ...items, leaves: [{ ...leaveBody, id: Math.max(0, ...items.leaves.map((item) => item.id)) + 1, employee_id: user.id, status: "Pending", reviewed_by: null, review_note: null, created_at: new Date().toISOString() }, ...items.leaves] }));
        else await api("/leaves", token, { method: "POST", body: JSON.stringify(leaveBody) });
        notify("Leave request submitted.");
      } else if (active === "Credits & Usage") {
        const creditBody = { ...body, employee_id: Number(body.employee_id), allocated_credits: Number(body.allocated_credits), used_credits: Number(body.used_credits) };
        if (demoMode) setRecords((items) => ({ ...items, credits: [{ ...creditBody, id: Math.max(0, ...items.credits.map((item) => item.id)) + 1, updated_at: new Date().toISOString() }, ...items.credits] }));
        else await api("/credits", token, { method: "POST", body: JSON.stringify(creditBody) });
        notify("Credit allocation saved.");
      } else if (active === "Announcements") {
        if (demoMode) setRecords((items) => ({ ...items, announcements: [{ ...body, id: Math.max(0, ...items.announcements.map((item) => item.id)) + 1, created_by: user.id, created_at: new Date().toISOString() }, ...items.announcements] }));
        else await api("/announcements", token, { method: "POST", body: JSON.stringify(body) });
        notify("Announcement published.");
      } else {
        const taskBody = { ...body, employee_id: Number(body.employee_id), owner_id: body.owner_id ? Number(body.owner_id) : null, due_date: body.due_date || null, workflow_type: active === "Offboarding" ? "offboarding" : "onboarding" };
        const key = active === "Offboarding" ? "offboarding" : "onboarding";
        if (demoMode) setRecords((items) => ({ ...items, [key]: [{ ...taskBody, id: Math.max(0, ...items[key].map((item) => item.id)) + 1, created_at: new Date().toISOString() }, ...items[key]] }));
        else await api("/workflows", token, { method: "POST", body: JSON.stringify(taskBody) });
        notify("Workflow task created.");
      }
      setShowForm(false); setEditingEmployee(null);
      if (demoMode) setDemoSection(active); else await loadSection(active);
    } catch (exception) { setError(exception.message || "Could not save changes."); }
    finally { setBusy(false); }
  }

  async function reviewLeave(id, newStatus) {
    try {
      if (demoMode) setRecords((items) => ({ ...items, leaves: items.leaves.map((item) => item.id === id ? { ...item, status: newStatus, reviewed_by: user.id } : item) }));
      else await api(`/leaves/${id}/review`, token, { method: "PATCH", body: JSON.stringify({ status: newStatus }) });
      notify(`Leave request ${newStatus.toLowerCase()}.`); if (!demoMode) await loadSection(active);
    } catch (exception) { setError(exception.message); }
  }

  async function taskStatus(id, newStatus) {
    const key = active === "Offboarding" ? "offboarding" : "onboarding";
    try {
      if (demoMode) setRecords((items) => ({ ...items, [key]: items[key].map((item) => item.id === id ? { ...item, status: newStatus } : item) }));
      else await api(`/workflows/tasks/${id}`, token, { method: "PATCH", body: JSON.stringify({ status: newStatus }) });
      if (!demoMode) await loadSection(active); notify(`Task marked ${newStatus.toLowerCase()}.`);
    } catch (exception) { setError(exception.message); }
  }

  async function deactivateEmployee(employee) {
    if (!window.confirm(`Deactivate ${employee.full_name}? Their historical records will be retained.`)) return;
    try {
      if (demoMode) setEmployees((items) => items.map((item) => item.id === employee.id ? { ...item, status: "Inactive" } : item));
      else await api(`/employees/${employee.id}`, token, { method: "DELETE" });
      notify(`${employee.full_name} was deactivated.`); if (!demoMode) await loadSection(active);
    } catch (exception) { setError(exception.message); }
  }

  async function deleteAnnouncement(announcement) {
    if (!window.confirm(`Delete the announcement “${announcement.title}”?`)) return;
    try {
      if (demoMode) setRecords((items) => ({ ...items, announcements: items.announcements.filter((item) => item.id !== announcement.id) }));
      else await api(`/announcements/${announcement.id}`, token, { method: "DELETE" });
      notify("Announcement deleted."); if (!demoMode) await loadSection(active);
    } catch (exception) { setError(exception.message); }
  }

  const filteredEmployees = useMemo(() => employees.filter((employee) => {
    const query = search.trim().toLowerCase();
    const matchesQuery = !query || `${employee.full_name} ${employee.email} ${employee.department} ${employee.role} ${employee.app_role}`.toLowerCase().includes(query);
    const matchesDepartment = departmentFilter === "All departments" || employee.department === departmentFilter;
    const matchesStatus = statusFilter === "All statuses" || employee.status === statusFilter;
    return matchesQuery && matchesDepartment && matchesStatus;
  }), [employees, search, departmentFilter, statusFilter]);

  const currentDate = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const heading = active === "Dashboard" ? `Good evening${user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}` : active;
  const subtitle = {
    Dashboard: "Your people, workflows, and important updates — all in one calm workspace.",
    Employees: "A clear view of the people behind your business.",
    "Team Lookup": "Find the right teammate, department, or role in seconds.",
    "Leave Management": "Keep time off transparent, organized, and easy to review.",
    "Credits & Usage": "Track learning, wellness, and other employee benefits.",
    Announcements: "One place for company news, reminders, and shared context.",
    Onboarding: "Make every new starter feel ready from day one.",
    Offboarding: "Keep transitions respectful, secure, and complete.",
    "Reports & Export": "Turn people data into an at-a-glance operational picture.",
    "Admin Tools": "Review access and keep a useful record of important actions.",
    Settings: "Your session, theme, and workspace configuration.",
  }[active] || "Manage your people operations in one place.";

  const openExport = () => {
    if (active === "Leave Management") exportCsv("internal-crm-leave-requests.csv", records.leaves.map((item) => ({ ...item, employee: employees.find((e) => e.id === item.employee_id)?.full_name || item.employee_id })));
    else if (active === "Credits & Usage") exportCsv("internal-crm-credits.csv", records.credits.map((item) => ({ ...item, employee: employees.find((e) => e.id === item.employee_id)?.full_name || item.employee_id, remaining: Number(item.allocated_credits) - Number(item.used_credits) })));
    else if (active === "Admin Tools") exportCsv("internal-crm-audit-log.csv", records.audit);
    else exportCsv("internal-crm-employees.csv", filteredEmployees);
    notify("CSV export prepared.");
  };

  return (
    <main className={`app-shell ${darkMode ? "theme-dark" : ""} ${collapsed ? "sidebar-collapsed" : ""}`}>
      {mobile && <button className="mobile-overlay" onClick={() => setMobile(false)} aria-label="Close navigation" />}
      {!isWorkspace ? (
        <section className="auth-screen">
          <div className="auth-topline"><div className="brand auth-brand"><span className="brand-mark"><Activity size={19} /></span><span>internal<span className="brand-light">CRM</span><sup>PRO</sup></span></div><span className="auth-version"><span className="live-dot" /> PEOPLE OPERATIONS PLATFORM</span></div>
          <div className="auth-grid">
            <div className="auth-story">
              <div className="story-badge"><Sparkles size={14} /> THE WORKPLACE, REIMAGINED</div>
              <h1>Work moves<br /><span>better together.</span></h1>
              <p>People, processes, and progress — all connected in one thoughtful workspace built for modern teams.</p>
              <div className="story-checks"><div><CheckCircle2 size={16} /> Employee directory & team insights</div><div><CheckCircle2 size={16} /> Leave and benefits workflows</div><div><CheckCircle2 size={16} /> Secure roles and audit trails</div></div>
              <div className="auth-preview">
                <div className="preview-top"><div><span className="mini-label">WORKFORCE PULSE</span><strong>Team health</strong></div><span className="preview-chip"><TrendingUp size={13} /> Steady</span></div>
                <div className="preview-metrics"><div><strong>15</strong><small>Team members</small></div><div><strong>08</strong><small>Departments</small></div><div><strong>94<span>%</span></strong><small>Profile coverage</small></div></div>
                <div className="preview-bars"><span style={{ height: "35%" }} /><span style={{ height: "52%" }} /><span style={{ height: "44%" }} /><span style={{ height: "70%" }} /><span style={{ height: "62%" }} /><span style={{ height: "88%" }} /><span style={{ height: "74%" }} /><span style={{ height: "100%" }} /><span style={{ height: "83%" }} /><span style={{ height: "93%" }} /><span style={{ height: "77%" }} /><span style={{ height: "97%" }} /></div>
                <div className="preview-bottom"><span><span className="live-dot" /> Workspace preview</span><span>Updated just now</span></div>
              </div>
              <div className="auth-footnote">DESIGNED FOR TEAMS THAT CARE ABOUT HOW WORK GETS DONE <span>✳</span></div>
            </div>
            <div className="auth-side">
              <div className="login-card"><div className="login-icon"><LockKeyhole size={21} /></div><span className="eyebrow">WELCOME TO INTERNAL CRM</span><h2>Pick up where<br />your team left off.</h2><p>Sign in with your company Google account to continue to your secure workspace.</p>
                {error && <div className="error-banner"><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss error"><X size={14} /></button></div>}
                <button className="google-button" disabled={!googleReady || busy} onClick={signIn}><span className="google-g">G</span>{busy ? "Connecting your workspace…" : "Continue with Google"}<ArrowRight size={16} /></button>
                {!GOOGLE_CLIENT_ID && <div className="setup-hint"><CircleHelp size={14} /> Google OAuth isn't configured yet. You can still explore the live demo below.</div>}
                <div className="login-divider"><span /> OR TRY IT OUT <span /></div>
                <button className="demo-button" onClick={enterDemo}><span className="demo-button-icon"><Rocket size={16} /></span><span><strong>Explore demo workspace</strong><small>15 sample people · interactive preview</small></span><ArrowUpRight size={17} /></button>
                <div className="login-security"><ShieldCheck size={15} /><span>Role-based access</span><i /> <span>Protected workspace</span></div>
              </div>
              <div className="trust-line"><span>✦</span> Built for people-first operations <span>✦</span></div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <aside className={`sidebar ${mobile ? "sidebar-open" : ""}`}>
            <div className="brand"><span className="brand-mark"><Activity size={19} /></span><span className="brand-text">internal<span className="brand-light">CRM</span><sup>PRO</sup></span><button className="close-nav" onClick={() => setMobile(false)} aria-label="Close sidebar"><X size={18} /></button></div>
            <div className="workspace-switcher"><div className="workspace-emblem"><Building2 size={16} /></div><div className="workspace-switcher-copy"><strong>Acme Workspace</strong><small>{demoMode ? "Demo environment" : "Company workspace"}</small></div><ChevronDown size={14} /></div>
            <div className="workspace-label">WORKSPACE</div>
            <nav className="sidebar-nav">{NAV.slice(0, 8).map(([label, Icon, helper]) => <button key={label} onClick={() => navigate(label)} className={`nav-item ${active === label ? "selected" : ""}`} title={collapsed ? label : undefined}><Icon size={18} /><span className="nav-copy">{label}</span>{label === "Leave Management" && pendingLeaves.length > 0 && <span className="nav-count">{pendingLeaves.length}</span>}</button>)}
              <div className="nav-divider" /><div className="workspace-label secondary-label">ANALYTICS & CONTROL</div>
              {NAV.slice(8).map(([label, Icon]) => <button key={label} onClick={() => navigate(label)} className={`nav-item ${active === label ? "selected" : ""}`} title={collapsed ? label : undefined}><Icon size={18} /><span className="nav-copy">{label}</span>{label === "Admin Tools" && isAdmin && <span className="admin-pip" />}</button>)}
            </nav>
            <div className="sidebar-bottom"><div className="sidebar-promo"><div className="promo-orb"><Zap size={16} /></div><strong>Your team, in sync.</strong><p>Small actions create great employee experiences.</p><button onClick={() => navigate("Reports & Export")}>Explore insights <ArrowUpRight size={13} /></button></div>
              <div className="profile-mini"><div className="avatar admin-avatar">{initials(user?.full_name)}</div><div className="profile-copy"><strong>{user?.full_name || "Guest"}</strong><small>{demoMode ? "Demo administrator" : user?.app_role || "Employee"}</small></div><button className="profile-menu" onClick={logout} title="Sign out / exit demo"><LogOut size={15} /></button></div>
              <button className="collapse-button" onClick={() => setCollapsed((value) => !value)}><ChevronDown size={14} /><span>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span></button>
            </div>
          </aside>

          <section className="main-area"><header className="topbar"><button className="menu-button" onClick={() => setMobile(true)} aria-label="Open navigation"><Menu size={20} /></button><button className="collapse-top" onClick={() => setCollapsed((value) => !value)} aria-label="Toggle sidebar"><Layers3 size={17} /></button>
              <label className="global-search"><Search size={17} /><input placeholder="Search people, teams, roles…" value={search} onChange={(event) => { setSearch(event.target.value); if (!['Employees', 'Team Lookup'].includes(active)) setActive('Employees'); }} /><kbd>Ctrl K</kbd></label>
              <div className="top-actions"><div className={`connection-pill ${connection.includes("Connected") ? "connected" : ""}`} title={connection}><span />{demoMode ? "Demo mode" : token ? "Live workspace" : "Preview"}</div>
                <button className="top-icon-button" onClick={() => setDarkMode((value) => !value)} title={darkMode ? "Switch to light theme" : "Switch to dark theme"}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
                <div className="notification-wrap"><button className={`top-icon-button ${notificationsOpen ? "is-open" : ""}`} onClick={() => setNotificationsOpen((value) => !value)} title="Notifications"><Bell size={18} />{pendingLeaves.length > 0 && <i />}</button>{notificationsOpen && <div className="notification-popover"><div className="popover-title"><div><strong>Notifications</strong><small>{pendingLeaves.length + announcements.length} workspace updates</small></div><button onClick={() => setNotificationsOpen(false)}><X size={15} /></button></div>{pendingLeaves.slice(0, 3).map((leave) => <button className="notification-item" key={`leave-${leave.id}`} onClick={() => navigate("Leave Management")}><span className="notification-symbol amber-symbol"><CalendarDays size={15} /></span><span><strong>Leave request waiting</strong><small>{employees.find((e) => e.id === leave.employee_id)?.full_name || "An employee"} · {leave.leave_type}</small></span><ArrowUpRight size={14} /></button>)}{announcements.slice(0, 2).map((announcement) => <button className="notification-item" key={`announcement-${announcement.id}`} onClick={() => navigate("Announcements")}><span className="notification-symbol green-symbol"><Megaphone size={15} /></span><span><strong>{announcement.title}</strong><small>Company announcement</small></span><ArrowUpRight size={14} /></button>)}{pendingLeaves.length + announcements.length === 0 && <div className="empty-state small-empty">You're all caught up.</div>}</div>}</div>
                <div className="top-user"><div className="avatar admin-avatar">{initials(user?.full_name)}</div><div className="top-user-copy"><strong>{user?.full_name}</strong><small>{user?.app_role}</small></div><ChevronDown size={14} /></div>
              </div></header>

            <div className="page-content"><div className="page-heading"><div><div className="eyebrow">INTERNAL OPERATIONS <span className="eyebrow-separator">/</span> {active === "Dashboard" ? "COMMAND CENTER" : active.toUpperCase()}</div><h1>{heading} <span className="heading-spark">{active === "Dashboard" ? "✳" : ""}</span></h1><p>{subtitle}</p></div><div className="heading-actions">{demoMode && <span className="demo-mode-pill"><span /> DEMO DATA</span>}{token && <button className="secondary-button" onClick={() => loadSection(active)} disabled={loading}><RefreshCw size={15} className={loading ? "spin" : ""} /> Refresh</button>}{isAdminOrHr && ["Employees", "Team Lookup", "Credits & Usage", "Announcements", "Onboarding", "Offboarding"].includes(active) && <button className="primary-button" onClick={openForm}><Plus size={16} /> {active === "Credits & Usage" ? "Allocate credits" : active === "Announcements" ? "New announcement" : active === "Onboarding" || active === "Offboarding" ? "Add task" : "Add employee"}</button>}{active === "Leave Management" && <button className="primary-button" onClick={openForm}><Plus size={16} /> Apply for leave</button>}{["Employees", "Team Lookup", "Leave Management", "Credits & Usage", "Reports & Export", "Admin Tools"].includes(active) && <button className="secondary-button export-button" onClick={openExport}><Download size={15} /> Export CSV</button>}</div></div>

              {demoMode && <div className="demo-banner"><div className="demo-banner-icon"><Sparkles size={17} /></div><div><strong>You're exploring the interactive demo</strong><span>Try the workflows and UI. Demo changes are local and reset when you exit.</span></div><button onClick={logout}>Exit demo <ArrowRight size={14} /></button></div>}
              {error && <div className="error-banner"><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss error"><X size={15} /></button></div>}

              {active === "Dashboard" ? <DashboardView employees={employees} metrics={metrics} records={records} navigate={navigate} loading={loading} user={user} /> : null}
              {active === "Employees" || active === "Team Lookup" ? <EmployeeView employees={filteredEmployees} departments={departments} departmentFilter={departmentFilter} setDepartmentFilter={setDepartmentFilter} clearSearch={() => setSearch("")} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onAdd={openForm} onEdit={editEmployee} onDeactivate={deactivateEmployee} canManage={isAdminOrHr} isAdmin={isAdmin} teamMode={active === "Team Lookup"} /> : null}
              {active === "Leave Management" ? <LeaveView data={records.leaves} employees={employees} user={user} onReview={reviewLeave} onAdd={openForm} /> : null}
              {active === "Credits & Usage" ? <CreditsView data={records.credits} employees={employees} onAdd={openForm} canManage={isAdminOrHr} /> : null}
              {active === "Announcements" ? <AnnouncementsView data={records.announcements} onAdd={openForm} onDelete={deleteAnnouncement} canManage={isAdminOrHr} /> : null}
              {active === "Onboarding" || active === "Offboarding" ? <WorkflowView data={records[active === "Offboarding" ? "offboarding" : "onboarding"]} employees={employees} onAdd={openForm} onStatus={taskStatus} canManage={isAdminOrHr} type={active} /> : null}
              {active === "Reports & Export" ? <ReportsView employees={employees} records={records} onExport={openExport} navigate={navigate} /> : null}
              {active === "Admin Tools" ? <AuditView data={records.audit} role={user?.app_role} employees={employees} /> : null}
              {active === "Settings" ? <SettingsView user={user} demoMode={demoMode} darkMode={darkMode} setDarkMode={setDarkMode} connection={connection} onLogout={logout} /> : null}
              <footer className="app-footer"><span>© 2026 <strong>Internal CRM Pro</strong> <i /> Built for better workdays.</span><span className="footer-status"><span />{demoMode ? "Demo session" : "Secure session active"}</span></footer>
            </div>
          </section>
        </>
      )}

      {showForm && <FormModal active={active} form={form} setForm={setForm} onClose={() => { setShowForm(false); setEditingEmployee(null); }} onSubmit={submitForm} busy={busy} employees={employees} editingEmployee={editingEmployee} canChangeRole={isAdmin} />}
      {commandOpen && <CommandPalette search={commandSearch} setSearch={setCommandSearch} onClose={() => { setCommandOpen(false); setCommandSearch(""); }} navigate={navigate} onAdd={() => { setCommandOpen(false); openForm(); }} />}
      {toast && <div className="toast"><span><Check size={15} /></span>{toast}</div>}
    </main>
  );
}

function DashboardView({ employees, metrics, records, navigate, loading, user }) {
  const activeCount = Number(metrics.active_employees ?? employees.filter((e) => e.status === "Active").length);
  const totalCount = Number(metrics.total_employees ?? employees.length);
  const leaveCount = Number(metrics.on_leave_today ?? employees.filter((e) => e.status === "On Leave").length);
  const departmentCount = Number(metrics.departments ?? new Set(employees.map((e) => e.department)).size);
  const deptData = [...new Set(employees.filter((e) => e.status !== "Inactive").map((e) => e.department))].map((department) => ({ department, count: employees.filter((e) => e.department === department && e.status !== "Inactive").length })).sort((a, b) => b.count - a.count);
  const maxDept = Math.max(1, ...deptData.map((d) => d.count));
  const onboardingTasks = [...records.onboarding, ...records.offboarding];
  const completedTasks = onboardingTasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = onboardingTasks.filter((task) => task.status !== "Completed").length;
  const pendingLeaves = records.leaves.filter((leave) => leave.status === "Pending");
  const creditTotal = records.credits.reduce((sum, item) => sum + Number(item.allocated_credits || 0), 0);
  const creditUsed = records.credits.reduce((sum, item) => sum + Number(item.used_credits || 0), 0);
  const topDepartments = deptData.slice(0, 6);

  return <>
    <section className="hero-card"><div className="hero-content"><div className="hero-pill"><span className="hero-pill-dot" /> YOUR PEOPLE OPERATIONS, AT A GLANCE</div><h2>Great teams don’t happen<br /><em>by accident.</em></h2><p>Here’s what’s happening across your workplace today. Make a small move that keeps everything moving.</p><div className="hero-actions"><button className="hero-primary" onClick={() => navigate("Employees")}>Explore your team <ArrowRight size={15} /></button><button className="hero-ghost" onClick={() => navigate("Reports & Export")}>View insights <ArrowUpRight size={15} /></button></div><div className="hero-people"><div className="avatar-stack">{employees.slice(1, 5).map((employee) => <span className="avatar-stack-item" key={employee.id}>{initials(employee.full_name)}</span>)}</div><span><strong>{totalCount} people</strong> make things happen here</span></div></div><div className="hero-visual"><div className="hero-ring ring-a" /><div className="hero-ring ring-b" /><div className="hero-ring ring-c" /><div className="hero-core"><span><Activity size={24} /></span><strong>People pulse</strong><small>Looking healthy</small></div><div className="floating-stat float-one"><span className="floating-icon"><Users size={14} /></span><span><small>Active team</small><strong>{activeCount} <i>people</i></strong></span><span className="float-up"><TrendingUp size={13} /></span></div><div className="floating-stat float-two"><span className="floating-icon amber-float"><CalendarCheck size={14} /></span><span><small>Leave requests</small><strong>{pendingLeaves.length} <i>pending</i></strong></span></div></div><div className="hero-decoration">✳</div></section>

    <div className="section-caption"><span>THE BIG PICTURE</span><span className="caption-line" /><span className="caption-date">Today · {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date())}</span></div>
    <div className="stats-grid"><StatCard title="Total employees" value={totalCount} sub={`${activeCount} active in the workspace`} Icon={Users} tone="green" trend="Workforce" /><StatCard title="Active employees" value={activeCount} sub={`${totalCount ? Math.round(activeCount / totalCount * 100) : 0}% of your workforce`} Icon={CheckCircle2} tone="mint" trend="On track" /><StatCard title="On leave" value={leaveCount} sub="Currently marked on leave" Icon={CalendarDays} tone="amber" trend={leaveCount ? "In progress" : "All hands"} /><StatCard title="Departments" value={departmentCount} sub="Teams across the organization" Icon={Building2} tone="violet" trend="Cross-functional" /></div>

    <div className="dashboard-grid premium-grid"><section className="panel department-panel"><div className="panel-heading"><div><span className="panel-kicker">TEAM DISTRIBUTION</span><h2>Where people work</h2><p>A snapshot of your team by department.</p></div><button className="icon-square" onClick={() => navigate("Reports & Export")} title="Open reports"><ArrowUpRight size={17} /></button></div><div className="department-chart">{topDepartments.map((item, index) => <div className="department-row" key={item.department}><div className="department-meta"><span className={`department-dot dot-${index % 6}`} /><span>{item.department}</span><strong>{item.count}</strong></div><div className="department-track"><span className={`department-fill fill-${index % 6}`} style={{ width: `${item.count / maxDept * 100}%` }} /></div></div>)}{topDepartments.length === 0 && <EmptyState title="No employee data yet" message="Add employee records to see department insights." />}</div><div className="chart-bottom-note"><span><i className="legend-dot" /> Active and on-leave team members</span><strong>{totalCount} total</strong></div></section>

      <section className="panel pulse-panel"><div className="panel-heading"><div><span className="panel-kicker">WORKSPACE PULSE</span><h2>People at a glance</h2><p>How the current workforce is shaping up.</p></div><span className="pulse-label"><span /> LIVE VIEW</span></div><div className="pulse-body"><div className="donut-wrap"><div className="donut-chart" style={{ "--active-share": `${totalCount ? activeCount / totalCount * 100 : 0}%`, "--leave-share": `${totalCount ? leaveCount / totalCount * 100 : 0}%` }}><div className="donut-center"><strong>{totalCount}</strong><small>people</small></div></div></div><div className="pulse-legend"><div><span className="legend-dot dark-green-dot" /><span>Active</span><strong>{activeCount}</strong></div><div><span className="legend-dot yellow-dot" /><span>On leave</span><strong>{leaveCount}</strong></div><div><span className="legend-dot grey-dot" /><span>Other / inactive</span><strong>{Math.max(0, totalCount - activeCount - leaveCount)}</strong></div></div></div><div className="pulse-footer"><div><span className="pulse-footer-icon"><Target size={15} /></span><span><strong>Keep the rhythm going</strong><small>Clear workflows help people do their best work.</small></span></div><button onClick={() => navigate("Reports & Export")}><ArrowRight size={16} /></button></div></section>

      <section className="panel task-panel"><div className="panel-heading"><div><span className="panel-kicker">GETTING THINGS DONE</span><h2>Workflow snapshot</h2><p>Onboarding and offboarding progress.</p></div><button className="text-button" onClick={() => navigate("Onboarding")}>All tasks <ArrowUpRight size={14} /></button></div><div className="task-overview"><div className="task-progress-ring"><div><strong>{onboardingTasks.length ? Math.round(completedTasks / onboardingTasks.length * 100) : 0}%</strong><small>complete</small></div></div><div className="task-progress-copy"><strong>{completedTasks} of {onboardingTasks.length} tasks complete</strong><span>Keep every transition organized and predictable.</span><div className="task-progress-track"><span style={{ width: `${onboardingTasks.length ? completedTasks / onboardingTasks.length * 100 : 0}%` }} /></div><div className="task-mini-stats"><span><i className="task-dot done-dot" /> {completedTasks} completed</span><span><i className="task-dot pending-dot" /> {pendingTasks} open</span></div></div></div><div className="task-preview-list">{onboardingTasks.slice(0, 3).map((task) => <div key={`${task.workflow_type}-${task.id}`} className="task-preview"><span className={`task-type-icon ${task.status === "Completed" ? "task-done" : task.status === "Blocked" ? "task-blocked" : ""}`}>{task.status === "Completed" ? <Check size={15} /> : <ClipboardCheck size={15} />}</span><span><strong>{task.title}</strong><small>{employees.find((e) => e.id === task.employee_id)?.full_name || "Team member"} · Due {dateLabel(task.due_date)}</small></span><StatusBadge status={task.status} /></div>)}{onboardingTasks.length === 0 && <div className="empty-inline">Your workflow checklist is clear. Add a task whenever you're ready.</div>}</div></section>

      <section className="panel activity-panel"><div className="panel-heading"><div><span className="panel-kicker">STAY IN THE LOOP</span><h2>Latest updates</h2><p>Recent company news and reminders.</p></div><button className="icon-square" onClick={() => navigate("Announcements")} title="View announcements"><ArrowUpRight size={17} /></button></div><div className="announcement-preview-list">{records.announcements.slice(0, 3).map((announcement, index) => <button key={announcement.id} className="announcement-preview" onClick={() => navigate("Announcements")}><span className={`announcement-preview-icon icon-tone-${index % 3}`}><Megaphone size={16} /></span><span className="announcement-preview-copy"><strong>{announcement.title}</strong><small>{timestampLabel(announcement.created_at)}</small><span>{announcement.body}</span></span><ArrowUpRight size={15} /></button>)}{records.announcements.length === 0 && <EmptyState title="Nothing new just yet" message="Company updates will show up here." />}</div><button className="panel-bottom-link" onClick={() => navigate("Announcements")}>Browse all announcements <ArrowRight size={14} /></button></section>
    </div>
  </>;
}

function StatCard({ title, value, sub, Icon, tone, trend }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19} /></div><div className="stat-copy"><span>{title}</span><strong>{value}</strong><small>{sub}</small></div><div className={`stat-trend trend-${tone}`}><span className="trend-tick"><TrendingUp size={12} /></span>{trend}</div></article>;
}

function EmployeeView({ employees, departments, departmentFilter, setDepartmentFilter, clearSearch, statusFilter, setStatusFilter, onAdd, onEdit, onDeactivate, canManage, isAdmin, teamMode }) {
  return <section className="panel directory-panel"><div className="directory-toolbar"><div><span className="panel-kicker">PEOPLE DIRECTORY</span><h2>{teamMode ? "Find your people" : "Everyone on the team"}</h2><p>{employees.length} visible profiles · Search by name, role, email, or department.</p></div><div className="directory-controls"><label className="filter-select"><Filter size={14} /><select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} aria-label="Filter by department">{departments.map((department) => <option key={department}>{department}</option>)}</select></label><label className="filter-select"><SlidersHorizontal size={14} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status">{["All statuses", "Active", "On Leave", "Inactive"].map((status) => <option key={status}>{status}</option>)}</select></label>{canManage && <button className="primary-button" onClick={onAdd}><Plus size={15} /> Add employee</button>}</div></div>
    <div className="table-meta"><span><span className="table-live-dot" /> Directory synced</span><span>Showing <strong>{employees.length}</strong> records</span></div><div className="table-wrap"><table className="pro-table"><thead><tr><th>TEAM MEMBER</th><th>DEPARTMENT</th><th>JOB TITLE</th><th>JOINED</th><th>STATUS</th><th>ACCESS ROLE</th>{canManage && <th className="align-right">ACTIONS</th>}</tr></thead><tbody>{employees.map((employee, index) => <tr key={employee.id}><td><div className="table-person"><div className={`avatar employee-avatar avatar-tone-${index % 6}`}>{initials(employee.full_name)}</div><div><strong>{employee.full_name}</strong><span>{employee.email}</span></div></div></td><td><span className="dept-chip">{employee.department}</span></td><td><span className="job-title">{employee.role}</span></td><td>{dateLabel(employee.joined_on, { year: true })}</td><td><StatusBadge status={employee.status} /></td><td><span className={`role-pill ${employee.app_role === "Admin" ? "role-admin" : employee.app_role === "HR" ? "role-hr" : ""}`}>{employee.app_role || "Employee"}</span></td>{canManage && <td><div className="row-action-group"><button className="table-action" onClick={() => onEdit(employee)} title="Edit employee"><Pencil size={14} /></button>{isAdmin && employee.status !== "Inactive" && <button className="table-action danger-action" onClick={() => onDeactivate(employee)} title="Deactivate employee"><LogOut size={14} /></button>}</div></td>}</tr>)}</tbody></table>{employees.length === 0 && <EmptyState title="No people found" message="Try changing the search term or filters." actionLabel="Clear filters" onAction={() => { setDepartmentFilter("All departments"); setStatusFilter("All statuses"); clearSearch(); }} />}</div><div className="table-footer"><span>Showing {employees.length} people <span className="footer-dot">·</span> Personal information is role-restricted</span><span className="table-foot-secure"><ShieldCheck size={13} /> Secure directory</span></div></section>;
}

function LeaveView({ data, employees, user, onReview, onAdd }) {
  const pending = data.filter((leave) => leave.status === "Pending").length;
  const approved = data.filter((leave) => leave.status === "Approved").length;
  const rejected = data.filter((leave) => leave.status === "Rejected").length;
  return <><div className="module-kpis"><ModuleKpi Icon={Clock3} title="Awaiting review" value={pending} tone="amber" /><ModuleKpi Icon={CheckCheck} title="Approved" value={approved} tone="green" /><ModuleKpi Icon={CircleAlert} title="Declined" value={rejected} tone="rose" /></div><section className="panel directory-panel"><div className="directory-toolbar"><div><span className="panel-kicker">TIME OFF & ABSENCE</span><h2>Leave requests</h2><p>Every request, decision, and date in one timeline.</p></div><button className="primary-button" onClick={onAdd}><Plus size={15} /> Apply for leave</button></div><div className="table-wrap"><table className="pro-table"><thead><tr><th>EMPLOYEE</th><th>LEAVE TYPE</th><th>DATES</th><th>REASON</th><th>STATUS</th><th>{["Admin", "HR"].includes(user?.app_role) ? "REVIEW" : "REVIEW NOTE"}</th></tr></thead><tbody>{data.map((leave, index) => <tr key={leave.id}><td><div className="table-person"><div className={`avatar employee-avatar avatar-tone-${index % 6}`}>{initials(employees.find((e) => e.id === leave.employee_id)?.full_name || "TM")}</div><div><strong>{employees.find((e) => e.id === leave.employee_id)?.full_name || `Employee #${leave.employee_id}`}</strong><span>{employees.find((e) => e.id === leave.employee_id)?.department || "—"}</span></div></div></td><td>{leave.leave_type}</td><td><strong className="date-range">{dateLabel(leave.start_date)}</strong><small className="date-sub">to {dateLabel(leave.end_date)}</small></td><td className="reason-cell">{leave.reason || "No reason added"}</td><td><StatusBadge status={leave.status} /></td><td>{["Admin", "HR"].includes(user?.app_role) && leave.status === "Pending" ? <div className="review-actions"><button className="approve-button" onClick={() => onReview(leave.id, "Approved")}><Check size={13} /> Approve</button><button className="reject-button" onClick={() => onReview(leave.id, "Rejected")}><X size={13} /> Decline</button></div> : <span className="review-note">{leave.review_note || "—"}</span>}</td></tr>)}</tbody></table>{!data.length && <EmptyState title="No leave requests" message="When someone requests time off, it will appear here." />}</div></section></>;
}

function CreditsView({ data, employees, onAdd, canManage }) {
  const allocated = data.reduce((sum, item) => sum + Number(item.allocated_credits || 0), 0);
  const used = data.reduce((sum, item) => sum + Number(item.used_credits || 0), 0);
  const remaining = allocated - used;
  return <><div className="module-kpis"><ModuleKpi Icon={CircleDollarSign} title="Credits allocated" value={allocated.toLocaleString("en-IN", { maximumFractionDigits: 0 })} tone="green" prefix="" /><ModuleKpi Icon={TrendingUp} title="Credits used" value={used.toLocaleString("en-IN", { maximumFractionDigits: 0 })} tone="violet" /><ModuleKpi Icon={Target} title="Available balance" value={remaining.toLocaleString("en-IN", { maximumFractionDigits: 0 })} tone="mint" /></div><section className="panel directory-panel"><div className="directory-toolbar"><div><span className="panel-kicker">EMPLOYEE BENEFITS</span><h2>Credits & usage</h2><p>Track the balance across learning, wellness, and travel budgets.</p></div>{canManage && <button className="primary-button" onClick={onAdd}><Plus size={15} /> Allocate credits</button>}</div><div className="table-wrap"><table className="pro-table"><thead><tr><th>EMPLOYEE</th><th>CATEGORY</th><th>ALLOCATED</th><th>USED</th><th>REMAINING</th><th>UTILIZATION</th></tr></thead><tbody>{data.map((credit, index) => { const person = employees.find((employee) => employee.id === credit.employee_id); const total = Number(credit.allocated_credits || 0); const usedValue = Number(credit.used_credits || 0); const percent = total ? Math.min(100, usedValue / total * 100) : 0; return <tr key={credit.id}><td><div className="table-person"><div className={`avatar employee-avatar avatar-tone-${index % 6}`}>{initials(person?.full_name || "TM")}</div><div><strong>{person?.full_name || `Employee #${credit.employee_id}`}</strong><span>{person?.department || "—"}</span></div></div></td><td><span className="dept-chip">{credit.category}</span></td><td className="number-cell">{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td><td className="number-cell">{usedValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td><td className="number-cell balance-cell">{(total - usedValue).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td><td><div className="utilization-cell"><div className="utilization-track"><span style={{ width: `${percent}%` }} /></div><small>{Math.round(percent)}%</small></div></td></tr>; })}</tbody></table>{!data.length && <EmptyState title="No credit allocations yet" message="Create an allocation to start tracking employee benefits." />}</div></section></>;
}

function AnnouncementsView({ data, onAdd, onDelete, canManage }) {
  return <section className="announcements-page"><div className="announcement-page-banner"><span className="announcement-page-icon"><Megaphone size={23} /></span><div><span className="panel-kicker">THE COMPANY BULLETIN</span><h2>Good communication<br /><em>changes everything.</em></h2><p>Important context, shared at the right time, helps everyone move in the same direction.</p></div><div className="bulletin-art"><div /><div /><div /><Megaphone size={48} /></div></div><div className="announcement-section-heading"><div><span className="panel-kicker">LATEST UPDATES</span><h2>News from your workspace</h2></div><span className="announcement-count">{data.length} posts</span></div><div className="announcement-grid">{data.map((announcement, index) => <article className="announcement-card-pro" key={announcement.id}><div className={`announcement-card-top card-tone-${index % 3}`}><span className="announcement-category"><Megaphone size={12} /> COMPANY UPDATE</span>{canManage && <button className="card-more" onClick={() => onDelete(announcement)} title="Delete announcement"><Trash2 size={14} /></button>}<span className="announcement-watermark">✳</span></div><div className="announcement-card-body"><div className="announcement-date"><CalendarDays size={13} /> {timestampLabel(announcement.created_at)}</div><h3>{announcement.title}</h3><p>{announcement.body}</p><div className="announcement-card-footer"><span className="publisher-avatar">{initials("Internal CRM")}</span><span><strong>Internal CRM</strong><small>People & Culture</small></span><span className="published-status"><i /> Published</span></div></div></article>)}{canManage && <button className="new-announcement-card" onClick={onAdd}><span><Plus size={21} /></span><strong>Share an update</strong><small>Keep everyone in the loop.</small></button>}</div>{!data.length && <EmptyState title="The bulletin is quiet" message="Share the first announcement with your team." actionLabel={canManage ? "Create announcement" : undefined} onAction={onAdd} />}</section>;
}

function WorkflowView({ data, employees, onAdd, onStatus, canManage, type }) {
  const completed = data.filter((task) => task.status === "Completed").length;
  const pending = data.filter((task) => task.status === "Pending").length;
  const blocked = data.filter((task) => task.status === "Blocked").length;
  return <><div className="workflow-banner"><div className="workflow-banner-copy"><span className="panel-kicker">PEOPLE JOURNEY</span><h2>{type === "Onboarding" ? "A great first day starts before day one." : "A thoughtful exit is part of a good experience."}</h2><p>{type === "Onboarding" ? "Give every new teammate clarity, confidence, and the tools to do their best work." : "Protect access, return company assets, and close every loop with care."}</p></div><div className="workflow-banner-art"><div className="workflow-step"><span>01</span><strong>{type === "Onboarding" ? "Prepare" : "Plan"}</strong></div><div className="workflow-step"><span>02</span><strong>{type === "Onboarding" ? "Welcome" : "Handover"}</strong></div><div className="workflow-step"><span>03</span><strong>{type === "Onboarding" ? "Empower" : "Close out"}</strong></div></div></div><div className="module-kpis"><ModuleKpi Icon={ClipboardList} title="Total checklist tasks" value={data.length} tone="green" /><ModuleKpi Icon={CheckCheck} title="Completed" value={completed} tone="mint" /><ModuleKpi Icon={Clock3} title="Still in progress" value={pending} tone="amber" /><ModuleKpi Icon={CircleAlert} title="Needs attention" value={blocked} tone="rose" /></div><section className="panel directory-panel"><div className="directory-toolbar"><div><span className="panel-kicker">{type.toUpperCase()} CHECKLIST</span><h2>{type} task board</h2><p>Assign clear ownership and keep every step visible.</p></div>{canManage && <button className="primary-button" onClick={onAdd}><Plus size={15} /> Add task</button>}</div><div className="table-wrap"><table className="pro-table"><thead><tr><th>TASK</th><th>TEAM MEMBER</th><th>OWNER</th><th>DUE DATE</th><th>STATUS</th><th>UPDATE STATUS</th></tr></thead><tbody>{data.map((task, index) => <tr key={task.id}><td><div className="workflow-task-title"><span className={`workflow-task-icon ${task.status === "Completed" ? "complete" : task.status === "Blocked" ? "blocked" : ""}`}>{task.status === "Completed" ? <Check size={14} /> : <ClipboardCheck size={14} />}</span><div><strong>{task.title}</strong><small>{task.description || "No description provided"}</small></div></div></td><td>{employees.find((employee) => employee.id === task.employee_id)?.full_name || `Employee #${task.employee_id}`}</td><td>{employees.find((employee) => employee.id === task.owner_id)?.full_name || "Unassigned"}</td><td>{dateLabel(task.due_date, { year: true })}</td><td><StatusBadge status={task.status} /></td><td><select className="status-select" value={task.status} onChange={(event) => onStatus(task.id, event.target.value)} aria-label={`Update ${task.title} status`}><option>Pending</option><option>In Progress</option><option>Completed</option><option>Blocked</option></select></td></tr>)}</tbody></table>{!data.length && <EmptyState title="No tasks on the board" message="Add a checklist item to get this workflow moving." actionLabel={canManage ? "Add task" : undefined} onAction={onAdd} />}</div></section></>;
}

function ReportsView({ employees, records, onExport, navigate }) {
  const departments = [...new Set(employees.map((employee) => employee.department))].map((department) => ({ department, count: employees.filter((employee) => employee.department === department && employee.status !== "Inactive").length })).sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...departments.map((item) => item.count));
  const leaveStats = ["Pending", "Approved", "Rejected"].map((status) => ({ status, count: records.leaves.filter((leave) => leave.status === status).length }));
  const creditsAllocated = records.credits.reduce((sum, item) => sum + Number(item.allocated_credits || 0), 0);
  const creditsUsed = records.credits.reduce((sum, item) => sum + Number(item.used_credits || 0), 0);
  return <><div className="reports-hero"><div><span className="panel-kicker">PEOPLE ANALYTICS</span><h2>Clarity creates<br /><em>better decisions.</em></h2><p>A practical view of your people data — ready to explore or export for your next review.</p></div><div className="reports-hero-icon"><BarChart3 size={38} /><span /><span /><span /></div></div><div className="module-kpis"><ModuleKpi Icon={Users} title="Employees in directory" value={employees.filter((e) => e.status !== "Inactive").length} tone="green" /><ModuleKpi Icon={CalendarDays} title="Leave requests" value={records.leaves.length} tone="amber" /><ModuleKpi Icon={CircleDollarSign} title="Allocated credits" value={creditsAllocated.toLocaleString("en-IN", { maximumFractionDigits: 0 })} tone="violet" /><ModuleKpi Icon={TrendingUp} title="Credit utilization" value={`${creditsAllocated ? Math.round(creditsUsed / creditsAllocated * 100) : 0}%`} tone="mint" /></div><div className="reports-grid"><section className="panel report-panel"><div className="panel-heading"><div><span className="panel-kicker">ORGANIZATION</span><h2>Department breakdown</h2><p>Team size by function</p></div><Users size={19} className="panel-heading-icon" /></div><div className="report-bars">{departments.map((item, index) => <div className="report-bar-row" key={item.department}><div><span>{item.department}</span><strong>{item.count}</strong></div><div className="department-track"><span className={`department-fill fill-${index % 6}`} style={{ width: `${item.count / max * 100}%` }} /></div></div>)}</div></section><section className="panel report-panel"><div className="panel-heading"><div><span className="panel-kicker">TIME OFF</span><h2>Leave decision mix</h2><p>Requests across all visible records</p></div><CalendarCheck size={19} className="panel-heading-icon" /></div><div className="leave-report-list">{leaveStats.map((item) => <div className="leave-report-row" key={item.status}><StatusBadge status={item.status} /><div className="leave-report-track"><span className={`leave-bar-${item.status.toLowerCase()}`} style={{ width: `${records.leaves.length ? item.count / records.leaves.length * 100 : 0}%` }} /></div><strong>{item.count}</strong></div>)}</div><div className="report-note"><ShieldCheck size={14} /> Only records visible to your role are included.</div></section></div><section className="panel export-panel"><div className="export-panel-icon"><FileSpreadsheet size={22} /></div><div><h2>Take your data with you</h2><p>Export clean CSVs for reporting, reviews, or offline analysis.</p></div><div className="export-actions"><button className="secondary-button" onClick={onExport}><Download size={15} /> Export directory</button><button className="primary-button" onClick={() => navigate("Employees")}>Manage people <ArrowRight size={15} /></button></div></section></>;
}

function AuditView({ data, role, employees }) {
  if (role !== "Admin") return <section className="panel access-denied"><div className="access-denied-icon"><ShieldCheck size={26} /></div><span className="panel-kicker">RESTRICTED AREA</span><h2>Administrator access required</h2><p>Audit logs contain sensitive operational history and are available only to Admin role accounts.</p></section>;
  return <section className="panel directory-panel"><div className="directory-toolbar"><div><span className="panel-kicker">SECURITY & COMPLIANCE</span><h2>Audit trail</h2><p>Important changes recorded across your CRM workspace.</p></div><span className="audit-safe-pill"><ShieldCheck size={14} /> Admin only</span></div><div className="table-wrap"><table className="pro-table"><thead><tr><th>EVENT</th><th>ACTOR</th><th>ENTITY</th><th>RECORD</th><th>TIME</th><th>DETAILS</th></tr></thead><tbody>{data.map((item, index) => <tr key={item.id}><td><span className="audit-action-icon"><Activity size={14} /></span><strong className="audit-action-text">{item.action}</strong></td><td>{employees.find((employee) => employee.id === item.actor_employee_id)?.full_name || "System"}</td><td><span className="dept-chip">{item.entity_type}</span></td><td>#{item.entity_id ?? "—"}</td><td>{timestampLabel(item.created_at)}</td><td><code className="audit-details">{JSON.stringify(item.details || {})}</code></td></tr>)}</tbody></table>{!data.length && <EmptyState title="No audit events yet" message="Actions recorded by the API will show up here." />}</div></section>;
}

function SettingsView({ user, demoMode, darkMode, setDarkMode, connection, onLogout }) {
  return <div className="settings-layout"><section className="panel settings-profile"><div className="settings-profile-cover"><div className="cover-orb" /><span className="profile-cover-label"><ShieldCheck size={13} /> SECURE WORKSPACE</span></div><div className="settings-profile-main"><div className="settings-avatar">{initials(user?.full_name)}</div><div><h2>{user?.full_name}</h2><p>{user?.email}</p><span className={`role-pill ${user?.app_role === "Admin" ? "role-admin" : "role-hr"}`}>{demoMode ? "Demo administrator" : user?.app_role}</span></div></div><div className="settings-details"><div><span>Department</span><strong>{user?.department || "—"}</strong></div><div><span>Account type</span><strong>{demoMode ? "Interactive demo" : "Company account"}</strong></div><div><span>Workspace access</span><strong>{user?.app_role || "Employee"}</strong></div><div><span>Connection</span><strong className="connection-text"><i />{connection}</strong></div></div></section><section className="panel settings-options"><div className="panel-heading"><div><span className="panel-kicker">PREFERENCES</span><h2>Make it yours</h2><p>A few controls for your workspace experience.</p></div><Settings size={20} className="panel-heading-icon" /></div><div className="settings-option-row"><span className="settings-option-icon"><Moon size={17} /></span><div><strong>Dark appearance</strong><small>Switch to a darker, lower-glare theme.</small></div><button className={`toggle-switch ${darkMode ? "toggle-on" : ""}`} role="switch" aria-checked={darkMode} onClick={() => setDarkMode((value) => !value)}><span /></button></div><div className="settings-option-row"><span className="settings-option-icon"><Bell size={17} /></span><div><strong>Workspace notifications</strong><small>Review pending items from the bell in the top bar.</small></div><span className="settings-value-pill">Available</span></div><div className="settings-option-row"><span className="settings-option-icon"><LockKeyhole size={17} /></span><div><strong>Role-based access</strong><small>Permissions are enforced by the FastAPI backend.</small></div><span className="settings-value-pill success-value">Enabled</span></div><div className="settings-option-row"><span className="settings-option-icon"><Building2 size={17} /></span><div><strong>Environment</strong><small>{demoMode ? "Sample data only. Changes aren't sent to the API." : "Connected to your configured CRM environment."}</small></div><span className="settings-value-pill">{demoMode ? "Demo" : "Live"}</span></div><div className="settings-footer"><div><strong>Need to switch accounts?</strong><small>Close this workspace session safely.</small></div><button className="secondary-button" onClick={onLogout}><LogOut size={14} /> {demoMode ? "Exit demo" : "Sign out"}</button></div></section><section className="settings-note"><ShieldCheck size={16} /><span><strong>Data safety matters.</strong> Use real employee data only after configuring OAuth, HTTPS, database backups, and organization-approved access rules.</span></section></div>;
}

function FormModal({ active, form, setForm, onClose, onSubmit, busy, employees, editingEmployee, canChangeRole }) {
  const title = editingEmployee ? "Edit employee" : active === "Employees" || active === "Team Lookup" ? "Add a teammate" : active === "Leave Management" ? "Request time off" : active === "Credits & Usage" ? "Allocate employee credits" : active === "Announcements" ? "Share a company update" : `Create ${active === "Offboarding" ? "offboarding" : "onboarding"} task`;
  const patch = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const field = (label, key, options = {}) => <label className="form-field"><span>{label}{options.required && <i> *</i>}</span><input required={options.required} type={options.type || "text"} min={options.min} max={options.max} value={form[key] ?? ""} placeholder={options.placeholder || ""} disabled={options.disabled} onChange={(event) => patch(key, event.target.value)} /></label>;
  const select = (label, key, options) => <label className="form-field"><span>{label}</span><select value={form[key] ?? ""} onChange={(event) => patch(key, event.target.value)}>{options.map((option) => typeof option === "string" ? <option key={option}>{option}</option> : <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
  const employeeOptions = employees.filter((employee) => employee.status !== "Inactive").map((employee) => ({ value: String(employee.id), label: `${employee.full_name} · ${employee.department}` }));
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><form className="modal pro-modal" onSubmit={onSubmit}><div className="modal-topline"><span className="modal-icon"><Sparkles size={19} /></span><button className="modal-close" type="button" onClick={onClose} aria-label="Close form"><X size={17} /></button></div><span className="panel-kicker">WORKSPACE ACTION</span><h2>{title}</h2><p className="modal-intro">{editingEmployee ? "Update the employee profile details below." : "Fill in the details to keep your workspace up to date."}</p><div className="modal-fields">
    {(active === "Employees" || active === "Team Lookup") && <>{field("Full name", "full_name", { required: true, placeholder: "e.g. Aditi Sharma" })}{field("Work email", "email", { required: true, type: "email", placeholder: "name@company.com", disabled: Boolean(editingEmployee) })}<div className="form-row">{select("Department", "department", ["Engineering", "Product", "Design", "HR", "Finance", "Marketing", "Operations", "Sales", "Customer Success"])}{field("Job title", "role", { required: true, placeholder: "e.g. Software Engineer" })}</div>{field("Phone (optional)", "phone", { placeholder: "Work phone number" })}{editingEmployee && <div className="form-row">{select("Employee status", "status", canChangeRole ? ["Active", "On Leave", "Inactive"] : ["Active", "On Leave"])}{canChangeRole && select("Access role", "app_role", ["Employee", "HR", "Admin"])}</div>}{!editingEmployee && canChangeRole && select("Access role", "app_role", ["Employee", "HR", "Admin"])}</>}
    {active === "Leave Management" && <>{select("Leave type", "leave_type", ["Casual Leave", "Sick Leave", "Earned Leave", "Unpaid Leave", "Work From Home"])}<div className="form-row">{field("Start date", "start_date", { required: true, type: "date" })}{field("End date", "end_date", { required: true, type: "date", min: form.start_date || undefined })}</div><label className="form-field"><span>Reason (optional)</span><textarea value={form.reason ?? ""} placeholder="Add a little context for your manager…" rows={3} onChange={(event) => patch("reason", event.target.value)} /></label></>}
    {active === "Credits & Usage" && <>{select("Employee", "employee_id", employeeOptions)}{select("Credit category", "category", ["Learning", "Wellness", "Travel", "Home Office", "Recognition", "Other"])}<div className="form-row">{field("Allocated credits", "allocated_credits", { required: true, type: "number", min: "0" })}{field("Credits used", "used_credits", { required: true, type: "number", min: "0" })}</div></>}
    {active === "Announcements" && <>{field("Announcement title", "title", { required: true, placeholder: "What should the team know?" })}<label className="form-field"><span>Message</span><textarea required value={form.body ?? ""} placeholder="Share the details with your team…" rows={5} onChange={(event) => patch("body", event.target.value)} /></label><label className="checkbox-field"><input type="checkbox" checked={Boolean(form.published)} onChange={(event) => patch("published", event.target.checked)} /><span>Publish this announcement immediately</span></label></>}
    {(active === "Onboarding" || active === "Offboarding") && <>{select("Employee", "employee_id", employeeOptions)}{field("Task title", "title", { required: true, placeholder: "e.g. Complete security training" })}<label className="form-field"><span>Description (optional)</span><textarea value={form.description ?? ""} placeholder="What needs to be completed?" rows={3} onChange={(event) => patch("description", event.target.value)} /></label>{select("Task owner", "owner_id", [{ value: "", label: "Unassigned" }, ...employeeOptions])}<div className="form-row">{field("Due date", "due_date", { type: "date" })}{select("Status", "status", ["Pending", "In Progress", "Completed", "Blocked"])}</div></>}</div>
    <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={busy}>{busy ? <><RefreshCw size={14} className="spin" /> Saving…</> : <><Check size={15} /> {editingEmployee ? "Save changes" : "Save to workspace"}</>}</button></div><p className="modal-note"><ShieldCheck size={13} /> Your changes are validated before they are saved.</p></form></div>;
}

function CommandPalette({ search, setSearch, onClose, navigate, onAdd }) {
  const actions = [
    ["Go to dashboard", "Overview and people pulse", LayoutDashboard, "Dashboard"],
    ["Open employee directory", "Find or manage people", Users, "Employees"],
    ["Review leave requests", "Time off and approvals", CalendarDays, "Leave Management"],
    ["Open credits & usage", "Benefits allocation", CircleDollarSign, "Credits & Usage"],
    ["Company announcements", "News and reminders", Megaphone, "Announcements"],
    ["Reports & export", "People insights and CSV", BarChart3, "Reports & Export"],
    ["Onboarding checklist", "New starter tasks", ClipboardList, "Onboarding"],
    ["Workspace settings", "Theme and account details", Settings, "Settings"],
  ];
  const filtered = actions.filter(([title, description]) => `${title} ${description}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="command-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="command-modal"><div className="command-search"><Search size={18} /><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="What would you like to do?" /><kbd>ESC</kbd></div><div className="command-section-label">QUICK NAVIGATION</div>{filtered.map(([title, description, Icon, destination], index) => <button key={destination} className="command-result" onClick={() => { navigate(destination); onClose(); }}><span className="command-icon"><Icon size={17} /></span><span><strong>{title}</strong><small>{description}</small></span><kbd>{index + 1}</kbd></button>)}<div className="command-footer"><span><Command size={13} /> Keyboard shortcut</span><span>Navigate with confidence</span></div></div></div>;
}

function ModuleKpi({ Icon, title, value, tone, prefix }) { return <article className="module-kpi"><span className={`module-kpi-icon ${tone}`}><Icon size={18} /></span><span className="module-kpi-label">{title}</span><strong>{prefix || ""}{value}</strong><small>Current workspace</small></article>; }
function StatusBadge({ status = "Pending" }) { const key = String(status).toLowerCase().replaceAll(" ", "-"); return <span className={`status-badge status-${key}`}><i />{status}</span>; }
function EmptyState({ title, message, actionLabel, onAction }) { return <div className="empty-state-pro"><span><Layers3 size={22} /></span><strong>{title}</strong><p>{message}</p>{actionLabel && onAction && <button className="secondary-button" onClick={onAction}>{actionLabel} <ArrowRight size={14} /></button>}</div>; }
