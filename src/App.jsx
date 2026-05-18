
// AtomQuest Goal Setting & Tracking Portal
// Full working implementation

import { useState, useEffect } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const THRUST_AREAS = ["Revenue Growth", "Cost Optimisation", "Customer Experience", "People & Culture", "Innovation & Digital", "Operational Excellence", "Compliance & Risk"];
const UOM_TYPES = ["Numeric (Min)", "Numeric (Max)", "% (Min)", "% (Max)", "Timeline", "Zero-based"];
const QUARTERS = ["Q1 (July)", "Q2 (October)", "Q3 (January)", "Q4 / Annual (March)"];

const INITIAL_USERS = {
  emp1: { id: "emp1", name: "Priya Sharma", role: "employee", managerId: "mgr1", department: "Sales", email: "priya.sharma@company.com" },
  emp2: { id: "emp2", name: "Arjun Mehta", role: "employee", managerId: "mgr1", department: "Sales", email: "arjun.mehta@company.com" },
  emp3: { id: "emp3", name: "Neha Patel", role: "employee", managerId: "mgr2", department: "Technology", email: "neha.patel@company.com" },
  mgr1: { id: "mgr1", name: "Vikram Nair", role: "manager", managerId: null, department: "Sales", email: "vikram.nair@company.com" },
  mgr2: { id: "mgr2", name: "Sunita Rao", role: "manager", managerId: null, department: "Technology", email: "sunita.rao@company.com" },
  admin: { id: "admin", name: "HR Admin", role: "admin", managerId: null, department: "HR", email: "hr.admin@company.com" },
};

const CREDS = { emp1: "emp123", emp2: "emp123", emp3: "emp123", mgr1: "mgr123", mgr2: "mgr123", admin: "admin123" };

const INITIAL_GOALS = {
  g1: {
    id: "g1", employeeId: "emp1", thrustArea: "Revenue Growth", title: "Achieve Q4 Sales Target",
    description: "Drive sales revenue to ₹50L by end of FY", uom: "Numeric (Min)", target: 5000000,
    weightage: 40, status: "approved", sharedGoal: false,
    achievements: { "Q1 (July)": 1200000, "Q2 (October)": 2600000 },
    checkInStatuses: { "Q1 (July)": "On Track", "Q2 (October)": "On Track" },
    managerComments: { "Q1 (July)": "Good progress, keep it up!" },
    createdAt: "2025-05-03", lockedAt: "2025-05-07"
  },
  g2: {
    id: "g2", employeeId: "emp1", thrustArea: "Customer Experience", title: "Improve CSAT Score",
    description: "Raise CSAT from 72% to 85%", uom: "% (Min)", target: 85,
    weightage: 30, status: "approved", sharedGoal: false,
    achievements: { "Q1 (July)": 76 },
    checkInStatuses: { "Q1 (July)": "On Track" },
    managerComments: {},
    createdAt: "2025-05-03", lockedAt: "2025-05-07"
  },
  g3: {
    id: "g3", employeeId: "emp1", thrustArea: "People & Culture", title: "Complete Training Modules",
    description: "Finish all 4 mandatory L&D modules", uom: "Numeric (Min)", target: 4,
    weightage: 20, status: "approved", sharedGoal: false,
    achievements: { "Q1 (July)": 2 },
    checkInStatuses: { "Q1 (July)": "On Track" },
    managerComments: {},
    createdAt: "2025-05-03", lockedAt: "2025-05-07"
  },
  g4: {
    id: "g4", employeeId: "emp1", thrustArea: "Compliance & Risk", title: "Zero Safety Incidents",
    description: "Maintain zero workplace safety incidents across the year", uom: "Zero-based", target: 0,
    weightage: 10, status: "approved", sharedGoal: false,
    achievements: { "Q1 (July)": 0, "Q2 (October)": 0 },
    checkInStatuses: { "Q1 (July)": "Completed", "Q2 (October)": "Completed" },
    managerComments: {},
    createdAt: "2025-05-03", lockedAt: "2025-05-07"
  },
  g5: {
    id: "g5", employeeId: "emp2", thrustArea: "Revenue Growth", title: "New Client Acquisition",
    description: "Onboard 5 new enterprise clients", uom: "Numeric (Min)", target: 5,
    weightage: 50, status: "pending", sharedGoal: false,
    achievements: {},
    checkInStatuses: {},
    managerComments: {},
    createdAt: "2025-05-10"
  },
  g6: {
    id: "g6", employeeId: "emp2", thrustArea: "Cost Optimisation", title: "Reduce TAT",
    description: "Reduce deal closure TAT from 45 days to 30 days", uom: "Numeric (Max)", target: 30,
    weightage: 30, status: "pending", sharedGoal: false,
    achievements: {},
    checkInStatuses: {},
    managerComments: {},
    createdAt: "2025-05-10"
  },
  g7: {
    id: "g7", employeeId: "emp2", thrustArea: "People & Culture", title: "Team Mentorship",
    description: "Mentor 2 junior team members through the quarter", uom: "Numeric (Min)", target: 2,
    weightage: 20, status: "pending", sharedGoal: false,
    achievements: {},
    checkInStatuses: {},
    managerComments: {},
    createdAt: "2025-05-10"
  },
};

const AUDIT_INITIAL = [
  { id: 1, action: "Goal approved", goalId: "g1", goalTitle: "Achieve Q4 Sales Target", by: "Vikram Nair", role: "manager", timestamp: "2025-05-07 10:23" },
  { id: 2, action: "Goal approved", goalId: "g2", goalTitle: "Improve CSAT Score", by: "Vikram Nair", role: "manager", timestamp: "2025-05-07 10:25" },
  { id: 3, action: "Q1 achievement logged", goalId: "g1", goalTitle: "Achieve Q4 Sales Target", by: "Priya Sharma", role: "employee", timestamp: "2025-07-05 09:10" },
  { id: 4, action: "Manager check-in comment added", goalId: "g1", goalTitle: "Achieve Q4 Sales Target", by: "Vikram Nair", role: "manager", timestamp: "2025-07-12 14:30" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeScore(goal, quarter) {
  const achievement = goal.achievements[quarter];
  if (achievement === undefined || achievement === null || achievement === "") return null;
  const target = Number(goal.target);
  const act = Number(achievement);
  if (!target && goal.uom !== "Zero-based") return null;
  switch (goal.uom) {
    case "Numeric (Min)": case "% (Min)": return Math.min((act / target) * 100, 200).toFixed(1);
    case "Numeric (Max)": case "% (Max)": return act === 0 ? "N/A" : Math.min((target / act) * 100, 200).toFixed(1);
    case "Zero-based": return act === 0 ? 100 : 0;
    case "Timeline": return act <= target ? 100 : Math.max(0, (1 - (act - target) / target) * 100).toFixed(1);
    default: return null;
  }
}

function getStatusColor(status) {
  return { approved: "#10b981", pending: "#f59e0b", rejected: "#ef4444", draft: "#6b7280" }[status] || "#6b7280";
}

function getCheckInColor(s) {
  return { "Completed": "#10b981", "On Track": "#3b82f6", "Not Started": "#9ca3af" }[s] || "#9ca3af";
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showCreds, setShowCreds] = useState(false);

  const credList = [
    { id: "emp1", password: "emp123", name: "Priya Sharma", role: "Employee" },
    { id: "emp2", password: "emp123", name: "Arjun Mehta", role: "Employee" },
    { id: "emp3", password: "emp123", name: "Neha Patel", role: "Employee" },
    { id: "mgr1", password: "mgr123", name: "Vikram Nair", role: "Manager" },
    { id: "mgr2", password: "mgr123", name: "Sunita Rao", role: "Manager" },
    { id: "admin", password: "admin123", name: "HR Admin", role: "Admin" },
  ];

  const roleColor = { Employee: "#3b82f6", Manager: "#8b5cf6", Admin: "#10b981" };

  function handleLogin() {
    const trimmed = userId.trim();
    if (!trimmed) { setError("Please enter your User ID."); return; }
    if (!password) { setError("Please enter your password."); return; }
    if (CREDS[trimmed] === password) {
      setError("");
      onLogin(INITIAL_USERS[trimmed]);
    } else {
      setError("Invalid User ID or password. Check the credentials table below.");
    }
  }

  function quickLogin(id, pw) {
    setUserId(id);
    setPassword(pw);
    setError("");
    onLogin(INITIAL_USERS[id]);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "40px 36px", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: 14, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>⚡</div>
            <h1 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>AtomQuest</h1>
            <p style={{ color: "#94a3b8", fontSize: 12, margin: "6px 0 0", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "sans-serif" }}>Goal Tracking Portal</p>
          </div>

          {/* User ID */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: "#94a3b8", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "sans-serif", display: "block", marginBottom: 6 }}>User ID</label>
            <input
              type="text"
              value={userId}
              onChange={e => { setUserId(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="e.g. emp1, mgr1, admin"
              style={{ width: "100%", padding: "11px 13px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#f1f5f9", fontSize: 14, fontFamily: "sans-serif", boxSizing: "border-box", outline: "none" }}
              autoFocus
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: "#94a3b8", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "sans-serif", display: "block", marginBottom: 6 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Enter password"
                style={{ width: "100%", padding: "11px 42px 11px 13px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#f1f5f9", fontSize: 14, fontFamily: "sans-serif", boxSizing: "border-box", outline: "none" }}
              />
              <button onClick={() => setShowPassword(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0 }}>
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 7, padding: "9px 13px", marginBottom: 16 }}>
              <p style={{ color: "#f87171", fontSize: 13, margin: 0, fontFamily: "sans-serif" }}>⚠ {error}</p>
            </div>
          )}

          {/* Sign In Button */}
          <button onClick={handleLogin} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", borderRadius: 8, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif", letterSpacing: "0.3px", marginBottom: 16 }}>
            Sign In →
          </button>

          {/* Toggle credentials hint */}
          <button onClick={() => setShowCreds(s => !s)} style={{ width: "100%", padding: "9px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: "sans-serif" }}>
            {showCreds ? "▲ Hide" : "▼ Show"} demo credentials
          </button>
        </div>

        {/* Credentials Table */}
        {showCreds && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "20px 20px", marginTop: 14 }}>
            <p style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", fontFamily: "sans-serif", margin: "0 0 14px" }}>Demo Accounts — click any row to auto-login</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {credList.map(c => (
                <button key={c.id} onClick={() => quickLogin(c.id, c.password)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "10px 14px", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: roleColor[c.role] + "33", border: "1px solid " + roleColor[c.role] + "55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: roleColor[c.role], fontWeight: 700, fontFamily: "sans-serif" }}>
                      {c.name[0]}
                    </div>
                    <div>
                      <div style={{ color: "#e2e8f0", fontSize: 13, fontFamily: "sans-serif", fontWeight: 500 }}>{c.name}</div>
                      <div style={{ color: roleColor[c.role], fontSize: 11, fontFamily: "sans-serif" }}>{c.role}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#60a5fa", fontSize: 12, fontFamily: "monospace" }}>{c.id}</div>
                    <div style={{ color: "#64748b", fontSize: 11, fontFamily: "monospace" }}>{c.password}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Layout Shell ─────────────────────────────────────────────────────────────
function Shell({ user, onLogout, children, activeTab, setActiveTab }) {
  const roleColor = { employee: "#3b82f6", manager: "#8b5cf6", admin: "#10b981" }[user.role];
  const tabs = user.role === "employee"
    ? [{ id: "goals", label: "My Goals" }, { id: "achievements", label: "Check-ins" }]
    : user.role === "manager"
    ? [{ id: "team", label: "Team Dashboard" }, { id: "approvals", label: "Approvals" }, { id: "checkins", label: "Check-ins" }]
    : [{ id: "overview", label: "Overview" }, { id: "cycles", label: "Cycles" }, { id: "reports", label: "Reports" }, { id: "audit", label: "Audit Log" }];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'Georgia', serif", color: "#e2e8f0" }}>
      {/* Top Bar */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}>AtomQuest Portal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: roleColor, textTransform: "uppercase", letterSpacing: "1px", fontFamily: "sans-serif" }}>{user.role}</div>
          </div>
          <button onClick={onLogout} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#94a3b8", fontSize: 12, cursor: "pointer", fontFamily: "sans-serif" }}>Sign out</button>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 32px", display: "flex", gap: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "14px 20px", background: "none", border: "none", borderBottom: activeTab === t.id ? `2px solid ${roleColor}` : "2px solid transparent", color: activeTab === t.id ? "#f1f5f9" : "#64748b", fontSize: 13, cursor: "pointer", fontFamily: "sans-serif", fontWeight: activeTab === t.id ? 600 : 400, transition: "all 0.2s", marginBottom: -1 }}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "28px 32px" }}>{children}</div>
    </div>
  );
}

// ─── Employee: My Goals ───────────────────────────────────────────────────────
function EmployeeGoals({ user, goals, setGoals, auditLog, setAuditLog }) {
  const myGoals = Object.values(goals).filter(g => g.employeeId === user.id);
  const totalWeight = myGoals.filter(g => g.status !== "rejected").reduce((s, g) => s + Number(g.weightage), 0);
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [form, setForm] = useState({ thrustArea: THRUST_AREAS[0], title: "", description: "", uom: UOM_TYPES[0], target: "", weightage: "" });
  const [errors, setErrors] = useState({});

  function openNew() { setForm({ thrustArea: THRUST_AREAS[0], title: "", description: "", uom: UOM_TYPES[0], target: "", weightage: "" }); setEditGoal(null); setErrors({}); setShowForm(true); }
  function openEdit(g) { setForm({ thrustArea: g.thrustArea, title: g.title, description: g.description, uom: g.uom, target: g.target, weightage: g.weightage }); setEditGoal(g); setErrors({}); setShowForm(true); }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Required";
    if (!form.target) errs.target = "Required";
    const w = Number(form.weightage);
    if (!w || w < 10) errs.weightage = "Minimum 10%";
    if (w > 100) errs.weightage = "Cannot exceed 100%";
    const activeGoals = myGoals.filter(g => g.status !== "rejected" && g.id !== editGoal?.id);
    const newTotal = activeGoals.reduce((s, g) => s + Number(g.weightage), 0) + w;
    if (newTotal > 100) errs.weightage = `Total would exceed 100% (currently ${activeGoals.reduce((s, g) => s + Number(g.weightage), 0)}%)`;
    if (!editGoal && activeGoals.length >= 8) errs.general = "Maximum 8 goals per employee";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (editGoal) {
      setGoals(prev => ({ ...prev, [editGoal.id]: { ...prev[editGoal.id], ...form, status: "draft" } }));
    } else {
      const id = "g" + Date.now();
      setGoals(prev => ({ ...prev, [id]: { id, employeeId: user.id, ...form, status: "draft", sharedGoal: false, achievements: {}, checkInStatuses: {}, managerComments: {}, createdAt: new Date().toISOString().slice(0, 10) } }));
    }
    setShowForm(false);
  }

  function handleSubmit(goalId) {
    setGoals(prev => ({ ...prev, [goalId]: { ...prev[goalId], status: "pending" } }));
    setAuditLog(prev => [{ id: Date.now(), action: "Goal submitted for approval", goalId, goalTitle: goals[goalId].title, by: user.name, role: "employee", timestamp: new Date().toLocaleString() }, ...prev]);
  }

  function submitAll() {
    const draftGoals = myGoals.filter(g => g.status === "draft");
    if (totalWeight !== 100) { alert(`Total weightage must equal 100%. Currently: ${totalWeight}%`); return; }
    const newGoals = { ...goals };
    draftGoals.forEach(g => { newGoals[g.id] = { ...g, status: "pending" }; });
    setGoals(newGoals);
  }

  const draftGoals = myGoals.filter(g => g.status === "draft");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>My Goal Sheet — FY 2025–26</h2>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <Pill label={`${myGoals.length}/8 Goals`} color="#3b82f6" />
            <Pill label={`Weightage: ${totalWeight}%`} color={totalWeight === 100 ? "#10b981" : totalWeight > 100 ? "#ef4444" : "#f59e0b"} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {draftGoals.length > 0 && totalWeight === 100 && <Btn label="Submit All for Approval" onClick={submitAll} color="#8b5cf6" />}
          <Btn label="+ Add Goal" onClick={openNew} color="#3b82f6" />
        </div>
      </div>

      {totalWeight !== 100 && myGoals.length > 0 && (
        <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: "#fbbf24", fontFamily: "sans-serif" }}>
          ⚠️ Total weightage is {totalWeight}%. Must equal exactly 100% before submission.
        </div>
      )}

      {myGoals.length === 0 ? (
        <EmptyState message="No goals yet. Click '+ Add Goal' to create your first goal." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {myGoals.map(g => (
            <GoalCard key={g.id} goal={g} onEdit={() => openEdit(g)} onSubmit={() => handleSubmit(g.id)} showActions={g.status === "draft"} />
          ))}
        </div>
      )}

      {showForm && (
        <Modal title={editGoal ? "Edit Goal" : "Add New Goal"} onClose={() => setShowForm(false)}>
          <Field label="Thrust Area">
            <select value={form.thrustArea} onChange={e => setForm(f => ({ ...f, thrustArea: e.target.value }))} style={selectStyle}>
              {THRUST_AREAS.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Goal Title" error={errors.title}>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} placeholder="e.g. Achieve Q4 Revenue Target" />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, height: 64, resize: "vertical" }} placeholder="Brief description of the goal" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Unit of Measurement">
              <select value={form.uom} onChange={e => setForm(f => ({ ...f, uom: e.target.value }))} style={selectStyle}>
                {UOM_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Target" error={errors.target}>
              <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} style={inputStyle} placeholder="e.g. 100" />
            </Field>
          </div>
          <Field label="Weightage (%)" error={errors.weightage}>
            <input type="number" value={form.weightage} onChange={e => setForm(f => ({ ...f, weightage: e.target.value }))} style={inputStyle} placeholder="Min 10%, total must = 100%" min={10} max={100} />
          </Field>
          {errors.general && <p style={{ color: "#f87171", fontSize: 13, fontFamily: "sans-serif" }}>{errors.general}</p>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn label="Cancel" onClick={() => setShowForm(false)} color="#475569" />
            <Btn label="Save Goal" onClick={handleSave} color="#3b82f6" />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Employee: Check-ins ──────────────────────────────────────────────────────
function EmployeeCheckins({ user, goals, setGoals, auditLog, setAuditLog }) {
  const myGoals = Object.values(goals).filter(g => g.employeeId === user.id && g.status === "approved");
  const [selQ, setSelQ] = useState(QUARTERS[0]);
  const [inputs, setInputs] = useState({});

  function handleSave(goalId) {
    const val = inputs[goalId];
    if (val === undefined || val === "") return;
    setGoals(prev => ({
      ...prev, [goalId]: {
        ...prev[goalId],
        achievements: { ...prev[goalId].achievements, [selQ]: Number(val) },
        checkInStatuses: { ...prev[goalId].checkInStatuses, [selQ]: prev[goalId].checkInStatuses[selQ] || "On Track" }
      }
    }));
    setAuditLog(prev => [{ id: Date.now(), action: `${selQ} achievement logged`, goalId, goalTitle: goals[goalId].title, by: user.name, role: "employee", timestamp: new Date().toLocaleString() }, ...prev]);
    setInputs(p => { const n = { ...p }; delete n[goalId]; return n; });
  }

  function handleStatusChange(goalId, status) {
    setGoals(prev => ({ ...prev, [goalId]: { ...prev[goalId], checkInStatuses: { ...prev[goalId].checkInStatuses, [selQ]: status } } }));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Quarterly Check-ins</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {QUARTERS.map(q => (
            <button key={q} onClick={() => setSelQ(q)} style={{ padding: "7px 14px", background: selQ === q ? "#3b82f6" : "rgba(255,255,255,0.06)", border: "1px solid " + (selQ === q ? "#3b82f6" : "rgba(255,255,255,0.1)"), borderRadius: 6, color: selQ === q ? "#fff" : "#94a3b8", fontSize: 12, cursor: "pointer", fontFamily: "sans-serif" }}>
              {q}
            </button>
          ))}
        </div>
      </div>
      {myGoals.length === 0 ? <EmptyState message="No approved goals to check in on yet." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {myGoals.map(g => {
            const score = computeScore(g, selQ);
            const existingAchievement = g.achievements[selQ];
            const existingStatus = g.checkInStatuses[selQ] || "Not Started";
            const managerComment = g.managerComments?.[selQ];
            return (
              <div key={g.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#64748b", fontFamily: "sans-serif", marginBottom: 4 }}>{g.thrustArea}</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{g.title}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontFamily: "sans-serif" }}>Weight</div>
                    <div style={{ fontWeight: 700, color: "#f59e0b" }}>{g.weightage}%</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div style={statBox}><div style={statLabel}>UoM</div><div style={statVal}>{g.uom}</div></div>
                  <div style={statBox}><div style={statLabel}>Target</div><div style={statVal}>{g.target}</div></div>
                  <div style={statBox}><div style={statLabel}>Score</div><div style={{ ...statVal, color: score >= 100 ? "#10b981" : score >= 75 ? "#f59e0b" : "#ef4444" }}>{score !== null ? score + "%" : "—"}</div></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label={`Actual Achievement (${selQ})`}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="number" value={inputs[g.id] !== undefined ? inputs[g.id] : (existingAchievement ?? "")} onChange={e => setInputs(p => ({ ...p, [g.id]: e.target.value }))} style={{ ...inputStyle, flex: 1 }} placeholder="Enter actual" />
                      <button onClick={() => handleSave(g.id)} style={{ padding: "0 14px", background: "#3b82f6", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif" }}>Save</button>
                    </div>
                  </Field>
                  <Field label="Status">
                    <select value={existingStatus} onChange={e => handleStatusChange(g.id, e.target.value)} style={{ ...selectStyle, borderColor: getCheckInColor(existingStatus) }}>
                      <option>Not Started</option><option>On Track</option><option>Completed</option>
                    </select>
                  </Field>
                </div>
                {managerComment && (
                  <div style={{ marginTop: 10, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 6, padding: "8px 12px" }}>
                    <div style={{ fontSize: 11, color: "#a78bfa", fontFamily: "sans-serif", marginBottom: 3 }}>MANAGER COMMENT</div>
                    <div style={{ fontSize: 13, color: "#e2e8f0", fontFamily: "sans-serif" }}>{managerComment}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Manager: Team Dashboard ──────────────────────────────────────────────────
function ManagerTeam({ user, goals, users }) {
  const myTeam = Object.values(users).filter(u => u.managerId === user.id);

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700 }}>Team Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {myTeam.map(emp => {
          const empGoals = Object.values(goals).filter(g => g.employeeId === emp.id);
          const approved = empGoals.filter(g => g.status === "approved").length;
          const pending = empGoals.filter(g => g.status === "pending").length;
          const totalW = empGoals.filter(g => g.status !== "rejected").reduce((s, g) => s + Number(g.weightage), 0);
          return (
            <div key={emp.id} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15 }}>{emp.name[0]}</div>
                <div><div style={{ fontWeight: 600 }}>{emp.name}</div><div style={{ fontSize: 12, color: "#64748b", fontFamily: "sans-serif" }}>{emp.department}</div></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div style={statBox}><div style={statLabel}>Goals</div><div style={statVal}>{empGoals.length}</div></div>
                <div style={statBox}><div style={statLabel}>Approved</div><div style={{ ...statVal, color: "#10b981" }}>{approved}</div></div>
                <div style={statBox}><div style={statLabel}>Pending</div><div style={{ ...statVal, color: "#f59e0b" }}>{pending}</div></div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "sans-serif", color: "#64748b", marginBottom: 4 }}>
                  <span>Weightage</span><span style={{ color: totalW === 100 ? "#10b981" : "#f59e0b" }}>{totalW}%</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
                  <div style={{ height: "100%", width: Math.min(totalW, 100) + "%", background: totalW === 100 ? "#10b981" : "#f59e0b", borderRadius: 4, transition: "width 0.3s" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Manager: Approvals ───────────────────────────────────────────────────────
function ManagerApprovals({ user, goals, setGoals, users, auditLog, setAuditLog }) {
  const myTeamIds = Object.values(users).filter(u => u.managerId === user.id).map(u => u.id);
  const pendingGoals = Object.values(goals).filter(g => myTeamIds.includes(g.employeeId) && g.status === "pending");
  const [editing, setEditing] = useState({});

  function handleApprove(g) {
    setGoals(prev => ({ ...prev, [g.id]: { ...prev[g.id], status: "approved", lockedAt: new Date().toISOString().slice(0, 10), target: editing[g.id + "_target"] || g.target, weightage: editing[g.id + "_weight"] || g.weightage } }));
    setAuditLog(prev => [{ id: Date.now(), action: "Goal approved", goalId: g.id, goalTitle: g.title, by: user.name, role: "manager", timestamp: new Date().toLocaleString() }, ...prev]);
  }

  function handleReject(g) {
    setGoals(prev => ({ ...prev, [g.id]: { ...prev[g.id], status: "rejected" } }));
    setAuditLog(prev => [{ id: Date.now(), action: "Goal returned for rework", goalId: g.id, goalTitle: g.title, by: user.name, role: "manager", timestamp: new Date().toLocaleString() }, ...prev]);
  }

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700 }}>Pending Approvals {pendingGoals.length > 0 && <span style={{ background: "#f59e0b", color: "#000", borderRadius: 12, padding: "2px 8px", fontSize: 12, marginLeft: 8 }}>{pendingGoals.length}</span>}</h2>
      {pendingGoals.length === 0 ? <EmptyState message="No pending goals to review. All caught up!" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pendingGoals.map(g => {
            const emp = users[g.employeeId];
            return (
              <div key={g.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", fontFamily: "sans-serif" }}>{emp?.name} · {g.thrustArea}</div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginTop: 2 }}>{g.title}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4, fontFamily: "sans-serif" }}>{g.description}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
                  <div style={statBox}><div style={statLabel}>UoM</div><div style={statVal}>{g.uom}</div></div>
                  <div style={statBox}>
                    <div style={statLabel}>Target</div>
                    <input type="number" defaultValue={g.target} onChange={e => setEditing(p => ({ ...p, [g.id + "_target"]: e.target.value }))} style={{ background: "transparent", border: "none", color: "#f1f5f9", fontWeight: 700, fontSize: 14, width: "100%", fontFamily: "Georgia,serif" }} />
                  </div>
                  <div style={statBox}>
                    <div style={statLabel}>Weight %</div>
                    <input type="number" defaultValue={g.weightage} onChange={e => setEditing(p => ({ ...p, [g.id + "_weight"]: e.target.value }))} style={{ background: "transparent", border: "none", color: "#f59e0b", fontWeight: 700, fontSize: 14, width: "100%", fontFamily: "Georgia,serif" }} min={10} />
                  </div>
                  <div style={statBox}><div style={statLabel}>Submitted</div><div style={statVal}>{g.createdAt}</div></div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn label="✓ Approve & Lock" onClick={() => handleApprove(g)} color="#10b981" />
                  <Btn label="↩ Return for Rework" onClick={() => handleReject(g)} color="#ef4444" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Manager: Check-ins ───────────────────────────────────────────────────────
function ManagerCheckins({ user, goals, setGoals, users, auditLog, setAuditLog }) {
  const myTeamIds = Object.values(users).filter(u => u.managerId === user.id).map(u => u.id);
  const teamGoals = Object.values(goals).filter(g => myTeamIds.includes(g.employeeId) && g.status === "approved");
  const [selQ, setSelQ] = useState(QUARTERS[0]);
  const [comments, setComments] = useState({});

  function saveComment(goalId) {
    const c = comments[goalId];
    if (!c?.trim()) return;
    setGoals(prev => ({ ...prev, [goalId]: { ...prev[goalId], managerComments: { ...prev[goalId].managerComments, [selQ]: c } } }));
    setAuditLog(prev => [{ id: Date.now(), action: "Manager check-in comment added", goalId, goalTitle: goals[goalId].title, by: user.name, role: "manager", timestamp: new Date().toLocaleString() }, ...prev]);
    setComments(p => { const n = { ...p }; delete n[goalId]; return n; });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Team Check-ins</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {QUARTERS.map(q => <button key={q} onClick={() => setSelQ(q)} style={{ padding: "7px 14px", background: selQ === q ? "#8b5cf6" : "rgba(255,255,255,0.06)", border: "1px solid " + (selQ === q ? "#8b5cf6" : "rgba(255,255,255,0.1)"), borderRadius: 6, color: selQ === q ? "#fff" : "#94a3b8", fontSize: 12, cursor: "pointer", fontFamily: "sans-serif" }}>{q}</button>)}
        </div>
      </div>
      {teamGoals.length === 0 ? <EmptyState message="No approved team goals to review." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {teamGoals.map(g => {
            const emp = users[g.employeeId];
            const achievement = g.achievements[selQ];
            const status = g.checkInStatuses[selQ] || "Not Started";
            const score = computeScore(g, selQ);
            const existingComment = g.managerComments?.[selQ];
            return (
              <div key={g.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", fontFamily: "sans-serif" }}>{emp?.name} · {g.thrustArea}</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{g.title}</div>
                  </div>
                  <span style={{ padding: "3px 10px", background: getCheckInColor(status) + "22", color: getCheckInColor(status), borderRadius: 12, fontSize: 11, fontFamily: "sans-serif", alignSelf: "flex-start" }}>{status}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
                  <div style={statBox}><div style={statLabel}>Target</div><div style={statVal}>{g.target}</div></div>
                  <div style={statBox}><div style={statLabel}>Actual</div><div style={statVal}>{achievement ?? "—"}</div></div>
                  <div style={statBox}><div style={statLabel}>Score</div><div style={{ ...statVal, color: score >= 100 ? "#10b981" : score >= 75 ? "#f59e0b" : "#ef4444" }}>{score !== null ? score + "%" : "—"}</div></div>
                  <div style={statBox}><div style={statLabel}>Weight</div><div style={{ ...statVal, color: "#f59e0b" }}>{g.weightage}%</div></div>
                </div>
                {existingComment && <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 6, padding: "8px 12px", marginBottom: 10, fontSize: 13, color: "#e2e8f0", fontFamily: "sans-serif" }}>💬 {existingComment}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={comments[g.id] || ""} onChange={e => setComments(p => ({ ...p, [g.id]: e.target.value }))} style={{ ...inputStyle, flex: 1 }} placeholder="Add check-in comment..." />
                  <button onClick={() => saveComment(g.id)} style={{ padding: "0 14px", background: "#8b5cf6", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif" }}>Post</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Admin: Overview ──────────────────────────────────────────────────────────
function AdminOverview({ goals, users }) {
  const allGoals = Object.values(goals);
  const stats = [
    { label: "Total Employees", value: Object.values(users).filter(u => u.role === "employee").length, color: "#3b82f6" },
    { label: "Goals Created", value: allGoals.length, color: "#8b5cf6" },
    { label: "Approved", value: allGoals.filter(g => g.status === "approved").length, color: "#10b981" },
    { label: "Pending", value: allGoals.filter(g => g.status === "pending").length, color: "#f59e0b" },
  ];
  const employees = Object.values(users).filter(u => u.role === "employee");

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700 }}>Organisation Overview</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...cardStyle, textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", fontFamily: "sans-serif", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Completion Dashboard</h3>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "sans-serif", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.05)" }}>
              {["Employee", "Department", "Goals Set", "Approved", "Pending", "Check-in Q1", "Check-in Q2"].map(h => <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => {
              const empGoals = allGoals.filter(g => g.employeeId === emp.id);
              const q1Done = empGoals.filter(g => g.checkInStatuses?.["Q1 (July)"]).length;
              const q2Done = empGoals.filter(g => g.checkInStatuses?.["Q2 (October)"]).length;
              return (
                <tr key={emp.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                  <td style={{ padding: "10px 16px", fontWeight: 500 }}>{emp.name}</td>
                  <td style={{ padding: "10px 16px", color: "#94a3b8" }}>{emp.department}</td>
                  <td style={{ padding: "10px 16px" }}>{empGoals.length}</td>
                  <td style={{ padding: "10px 16px", color: "#10b981" }}>{empGoals.filter(g => g.status === "approved").length}</td>
                  <td style={{ padding: "10px 16px", color: "#f59e0b" }}>{empGoals.filter(g => g.status === "pending").length}</td>
                  <td style={{ padding: "10px 16px" }}><span style={{ padding: "2px 8px", background: q1Done > 0 ? "#10b98122" : "#9ca3af22", color: q1Done > 0 ? "#10b981" : "#9ca3af", borderRadius: 10 }}>{q1Done}/{empGoals.filter(g => g.status === "approved").length}</span></td>
                  <td style={{ padding: "10px 16px" }}><span style={{ padding: "2px 8px", background: q2Done > 0 ? "#10b98122" : "#9ca3af22", color: q2Done > 0 ? "#10b981" : "#9ca3af", borderRadius: 10 }}>{q2Done}/{empGoals.filter(g => g.status === "approved").length}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Admin: Reports ───────────────────────────────────────────────────────────
function AdminReports({ goals, users }) {
  const approved = Object.values(goals).filter(g => g.status === "approved");

  function downloadCSV() {
    const rows = [["Employee", "Goal Title", "Thrust Area", "UoM", "Target", "Q1 Actual", "Q1 Score", "Q2 Actual", "Q2 Score", "Weightage"]];
    approved.forEach(g => {
      const emp = users[g.employeeId];
      rows.push([emp?.name, g.title, g.thrustArea, g.uom, g.target, g.achievements["Q1 (July)"] ?? "", computeScore(g, "Q1 (July)") ?? "", g.achievements["Q2 (October)"] ?? "", computeScore(g, "Q2 (October)") ?? "", g.weightage + "%"]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "achievement_report.csv"; a.click();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Achievement Report</h2>
        <Btn label="⬇ Export CSV" onClick={downloadCSV} color="#10b981" />
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "sans-serif", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.05)" }}>
              {["Employee", "Goal", "Thrust Area", "UoM", "Target", "Q1 Actual", "Q1 Score%", "Q2 Actual", "Q2 Score%", "Weight"].map(h => <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: 10, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {approved.map((g, i) => {
              const emp = users[g.employeeId];
              return (
                <tr key={g.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                  <td style={{ padding: "8px 12px", fontWeight: 500 }}>{emp?.name}</td>
                  <td style={{ padding: "8px 12px", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.title}</td>
                  <td style={{ padding: "8px 12px", color: "#94a3b8" }}>{g.thrustArea}</td>
                  <td style={{ padding: "8px 12px", color: "#94a3b8" }}>{g.uom}</td>
                  <td style={{ padding: "8px 12px" }}>{g.target}</td>
                  <td style={{ padding: "8px 12px" }}>{g.achievements["Q1 (July)"] ?? "—"}</td>
                  <td style={{ padding: "8px 12px", color: "#10b981" }}>{computeScore(g, "Q1 (July)") ? computeScore(g, "Q1 (July)") + "%" : "—"}</td>
                  <td style={{ padding: "8px 12px" }}>{g.achievements["Q2 (October)"] ?? "—"}</td>
                  <td style={{ padding: "8px 12px", color: "#10b981" }}>{computeScore(g, "Q2 (October)") ? computeScore(g, "Q2 (October)") + "%" : "—"}</td>
                  <td style={{ padding: "8px 12px", color: "#f59e0b" }}>{g.weightage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Admin: Audit Log ─────────────────────────────────────────────────────────
function AdminAudit({ auditLog }) {
  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700 }}>Audit Trail</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {auditLog.map(e => (
          <div key={e.id} style={{ ...cardStyle, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{e.action}</span>
              <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "sans-serif", marginLeft: 8 }}>on "{e.goalTitle}"</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, fontFamily: "sans-serif" }}>{e.by} <span style={{ color: "#64748b" }}>({e.role})</span></div>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "sans-serif" }}>{e.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin: Cycles ────────────────────────────────────────────────────────────
function AdminCycles() {
  const cycles = [
    { period: "Phase 1 — Goal Setting", opens: "1st May 2025", action: "Goal Creation, Submission & Approval", active: false, done: true },
    { period: "Q1 Check-in", opens: "July 2025", action: "Progress Update — Planned vs. Actual", active: true, done: false },
    { period: "Q2 Check-in", opens: "October 2025", action: "Progress Update — Planned vs. Actual", active: false, done: false },
    { period: "Q3 Check-in", opens: "January 2026", action: "Progress Update — Planned vs. Actual", active: false, done: false },
    { period: "Q4 / Annual", opens: "March / April 2026", action: "Final Achievement Capture", active: false, done: false },
  ];
  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700 }}>Check-in Schedule</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {cycles.map((c, i) => (
          <div key={i} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `3px solid ${c.active ? "#10b981" : c.done ? "#3b82f6" : "rgba(255,255,255,0.1)"}` }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.period}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "sans-serif", marginTop: 3 }}>{c.action}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#64748b", fontFamily: "sans-serif" }}>{c.opens}</div>
              <span style={{ padding: "2px 8px", background: c.active ? "#10b98122" : c.done ? "#3b82f622" : "#ffffff11", color: c.active ? "#10b981" : c.done ? "#3b82f6" : "#64748b", borderRadius: 10, fontSize: 11, fontFamily: "sans-serif" }}>
                {c.active ? "● Active" : c.done ? "✓ Completed" : "Upcoming"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────
function GoalCard({ goal, onEdit, onSubmit, showActions }) {
  return (
    <div style={{ ...cardStyle, borderLeft: `3px solid ${getStatusColor(goal.status)}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#64748b", fontFamily: "sans-serif", marginBottom: 3 }}>{goal.thrustArea} {goal.sharedGoal && <span style={{ color: "#8b5cf6" }}>· Shared</span>}</div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{goal.title}</div>
          {goal.description && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3, fontFamily: "sans-serif" }}>{goal.description}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
          <span style={{ padding: "3px 10px", background: getStatusColor(goal.status) + "22", color: getStatusColor(goal.status), borderRadius: 12, fontSize: 11, fontFamily: "sans-serif", whiteSpace: "nowrap" }}>{goal.status}</span>
          <span style={{ fontWeight: 700, color: "#f59e0b", fontSize: 15 }}>{goal.weightage}%</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: "4px 16px", marginTop: 10 }}>
        <span style={{ fontSize: 11, color: "#64748b", fontFamily: "sans-serif" }}>UoM: <span style={{ color: "#e2e8f0" }}>{goal.uom}</span></span>
        <span style={{ fontSize: 11, color: "#64748b", fontFamily: "sans-serif" }}>Target: <span style={{ color: "#e2e8f0" }}>{goal.target}</span></span>
        {goal.lockedAt && <span style={{ fontSize: 11, color: "#64748b", fontFamily: "sans-serif" }}>Locked: <span style={{ color: "#e2e8f0" }}>{goal.lockedAt}</span></span>}
      </div>
      {showActions && (
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn label="Edit" onClick={onEdit} color="#475569" small />
          <Btn label="Submit for Approval" onClick={onSubmit} color="#3b82f6" small />
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "sans-serif", display: "block", marginBottom: 5 }}>{label}</label>
      {children}
      {error && <p style={{ color: "#f87171", fontSize: 12, margin: "4px 0 0", fontFamily: "sans-serif" }}>{error}</p>}
    </div>
  );
}

function Pill({ label, color }) {
  return <span style={{ padding: "3px 10px", background: color + "22", color, borderRadius: 12, fontSize: 12, fontFamily: "sans-serif" }}>{label}</span>;
}

function Btn({ label, onClick, color, small }) {
  return <button onClick={onClick} style={{ padding: small ? "5px 12px" : "8px 18px", background: color, border: "none", borderRadius: 6, color: "#fff", fontSize: small ? 12 : 13, cursor: "pointer", fontFamily: "sans-serif", fontWeight: 500, whiteSpace: "nowrap" }}>{label}</button>;
}

function EmptyState({ message }) {
  return <div style={{ textAlign: "center", padding: "48px 20px", color: "#475569", fontFamily: "sans-serif", fontSize: 14 }}>{message}</div>;
}

const cardStyle = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "16px 20px" };
const inputStyle = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 7, color: "#f1f5f9", fontSize: 13, fontFamily: "Georgia,serif", boxSizing: "border-box" };
const selectStyle = { width: "100%", padding: "9px 12px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 7, color: "#f1f5f9", fontSize: 13, fontFamily: "sans-serif" };
const statBox = { background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "8px 10px" };
const statLabel = { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "sans-serif", marginBottom: 3 };
const statVal = { fontWeight: 700, fontSize: 14 };

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [auditLog, setAuditLog] = useState(AUDIT_INITIAL);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (user) {
      const defaults = { employee: "goals", manager: "team", admin: "overview" };
      setActiveTab(defaults[user.role]);
    }
  }, [user]);

  if (!user) return <LoginScreen onLogin={setUser} />;

  function renderContent() {
    if (user.role === "employee") {
      if (activeTab === "goals") return <EmployeeGoals user={user} goals={goals} setGoals={setGoals} auditLog={auditLog} setAuditLog={setAuditLog} />;
      if (activeTab === "achievements") return <EmployeeCheckins user={user} goals={goals} setGoals={setGoals} auditLog={auditLog} setAuditLog={setAuditLog} />;
    }
    if (user.role === "manager") {
      if (activeTab === "team") return <ManagerTeam user={user} goals={goals} users={INITIAL_USERS} />;
      if (activeTab === "approvals") return <ManagerApprovals user={user} goals={goals} setGoals={setGoals} users={INITIAL_USERS} auditLog={auditLog} setAuditLog={setAuditLog} />;
      if (activeTab === "checkins") return <ManagerCheckins user={user} goals={goals} setGoals={setGoals} users={INITIAL_USERS} auditLog={auditLog} setAuditLog={setAuditLog} />;
    }
    if (user.role === "admin") {
      if (activeTab === "overview") return <AdminOverview goals={goals} users={INITIAL_USERS} />;
      if (activeTab === "cycles") return <AdminCycles />;
      if (activeTab === "reports") return <AdminReports goals={goals} users={INITIAL_USERS} />;
      if (activeTab === "audit") return <AdminAudit auditLog={auditLog} />;
    }
    return null;
  }

  return (
    <Shell user={user} onLogout={() => setUser(null)} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Shell>
  );
}
