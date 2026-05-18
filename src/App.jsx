
// AtomQuest Goal Setting & Tracking Portal
// Redesigned — elegant, muted, human-crafted

import { useState, useEffect } from "react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:        "#13110f",
  surface:   "#1c1916",
  surfaceAlt:"#221f1b",
  border:    "rgba(255,245,230,0.07)",
  borderMid: "rgba(255,245,230,0.12)",
  text:      "#e8ddd0",
  textMuted: "#8a7d6e",
  textDim:   "#5a5048",
  amber:     "#c8923a",
  amberPale: "rgba(200,146,58,0.15)",
  green:     "#6aaa7e",
  greenPale: "rgba(106,170,126,0.15)",
  red:       "#b36a5e",
  redPale:   "rgba(179,106,94,0.15)",
  blue:      "#7a99b8",
  bluePale:  "rgba(122,153,184,0.15)",
  purple:    "#9d85a8",
  purplePale:"rgba(157,133,168,0.15)",
};

const FONT_SERIF  = "'Georgia', 'Times New Roman', serif";
const FONT_SANS   = "'Helvetica Neue', Arial, sans-serif";
const FONT_MONO   = "'Courier New', monospace";

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const THRUST_AREAS = ["Revenue Growth","Cost Optimisation","Customer Experience","People & Culture","Innovation & Digital","Operational Excellence","Compliance & Risk"];
const UOM_TYPES    = ["Numeric (Min)","Numeric (Max)","% (Min)","% (Max)","Timeline","Zero-based"];
const QUARTERS     = ["Q1 (July)","Q2 (October)","Q3 (January)","Q4 / Annual (March)"];

const INITIAL_USERS = {
  emp1:  { id:"emp1",  name:"Priya Sharma",  role:"employee", managerId:"mgr1", department:"Sales",      email:"priya.sharma@company.com"  },
  emp2:  { id:"emp2",  name:"Arjun Mehta",   role:"employee", managerId:"mgr1", department:"Sales",      email:"arjun.mehta@company.com"   },
  emp3:  { id:"emp3",  name:"Neha Patel",    role:"employee", managerId:"mgr2", department:"Technology", email:"neha.patel@company.com"    },
  mgr1:  { id:"mgr1",  name:"Vikram Nair",   role:"manager",  managerId:null,   department:"Sales",      email:"vikram.nair@company.com"   },
  mgr2:  { id:"mgr2",  name:"Sunita Rao",    role:"manager",  managerId:null,   department:"Technology", email:"sunita.rao@company.com"    },
  admin: { id:"admin", name:"HR Admin",      role:"admin",    managerId:null,   department:"HR",         email:"hr.admin@company.com"      },
};

const CREDS = { emp1:"emp123", emp2:"emp123", emp3:"emp123", mgr1:"mgr123", mgr2:"mgr123", admin:"admin123" };

const INITIAL_GOALS = {
  g1: { id:"g1", employeeId:"emp1", thrustArea:"Revenue Growth",     title:"Achieve Q4 Sales Target",      description:"Drive sales revenue to ₹50L by end of FY", uom:"Numeric (Min)", target:5000000, weightage:40, status:"approved", sharedGoal:false, achievements:{"Q1 (July)":1200000,"Q2 (October)":2600000}, checkInStatuses:{"Q1 (July)":"On Track","Q2 (October)":"On Track"}, managerComments:{"Q1 (July)":"Good progress, keep it up!"}, createdAt:"2025-05-03", lockedAt:"2025-05-07" },
  g2: { id:"g2", employeeId:"emp1", thrustArea:"Customer Experience", title:"Improve CSAT Score",           description:"Raise CSAT from 72% to 85%",               uom:"% (Min)",        target:85,      weightage:30, status:"approved", sharedGoal:false, achievements:{"Q1 (July)":76},           checkInStatuses:{"Q1 (July)":"On Track"},                          managerComments:{},                               createdAt:"2025-05-03", lockedAt:"2025-05-07" },
  g3: { id:"g3", employeeId:"emp1", thrustArea:"People & Culture",    title:"Complete Training Modules",    description:"Finish all 4 mandatory L&D modules",        uom:"Numeric (Min)", target:4,       weightage:20, status:"approved", sharedGoal:false, achievements:{"Q1 (July)":2},            checkInStatuses:{"Q1 (July)":"On Track"},                          managerComments:{},                               createdAt:"2025-05-03", lockedAt:"2025-05-07" },
  g4: { id:"g4", employeeId:"emp1", thrustArea:"Compliance & Risk",   title:"Zero Safety Incidents",        description:"Maintain zero workplace safety incidents",   uom:"Zero-based",     target:0,       weightage:10, status:"approved", sharedGoal:false, achievements:{"Q1 (July)":0,"Q2 (October)":0}, checkInStatuses:{"Q1 (July)":"Completed","Q2 (October)":"Completed"}, managerComments:{},                             createdAt:"2025-05-03", lockedAt:"2025-05-07" },
  g5: { id:"g5", employeeId:"emp2", thrustArea:"Revenue Growth",     title:"New Client Acquisition",       description:"Onboard 5 new enterprise clients",          uom:"Numeric (Min)", target:5,       weightage:50, status:"pending",  sharedGoal:false, achievements:{},                          checkInStatuses:{},                                                managerComments:{},                               createdAt:"2025-05-10" },
  g6: { id:"g6", employeeId:"emp2", thrustArea:"Cost Optimisation",  title:"Reduce TAT",                   description:"Reduce deal closure TAT from 45 to 30 days",uom:"Numeric (Max)", target:30,      weightage:30, status:"pending",  sharedGoal:false, achievements:{},                          checkInStatuses:{},                                                managerComments:{},                               createdAt:"2025-05-10" },
  g7: { id:"g7", employeeId:"emp2", thrustArea:"People & Culture",   title:"Team Mentorship",              description:"Mentor 2 junior team members through the quarter", uom:"Numeric (Min)", target:2, weightage:20, status:"pending",  sharedGoal:false, achievements:{},                          checkInStatuses:{},                                                managerComments:{},                               createdAt:"2025-05-10" },
};

const AUDIT_INITIAL = [
  { id:1, action:"Goal approved",                   goalId:"g1", goalTitle:"Achieve Q4 Sales Target",   by:"Vikram Nair",  role:"manager",  timestamp:"2025-05-07 10:23" },
  { id:2, action:"Goal approved",                   goalId:"g2", goalTitle:"Improve CSAT Score",         by:"Vikram Nair",  role:"manager",  timestamp:"2025-05-07 10:25" },
  { id:3, action:"Q1 achievement logged",           goalId:"g1", goalTitle:"Achieve Q4 Sales Target",   by:"Priya Sharma", role:"employee", timestamp:"2025-07-05 09:10" },
  { id:4, action:"Manager check-in comment added",  goalId:"g1", goalTitle:"Achieve Q4 Sales Target",   by:"Vikram Nair",  role:"manager",  timestamp:"2025-07-12 14:30" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function computeScore(goal, quarter) {
  const achievement = goal.achievements[quarter];
  if (achievement === undefined || achievement === null || achievement === "") return null;
  const target = Number(goal.target);
  const act    = Number(achievement);
  if (!target && goal.uom !== "Zero-based") return null;
  switch (goal.uom) {
    case "Numeric (Min)": case "% (Min)": return Math.min((act / target) * 100, 200).toFixed(1);
    case "Numeric (Max)": case "% (Max)": return act === 0 ? "N/A" : Math.min((target / act) * 100, 200).toFixed(1);
    case "Zero-based":  return act === 0 ? 100 : 0;
    case "Timeline":    return act <= target ? 100 : Math.max(0, (1 - (act - target) / target) * 100).toFixed(1);
    default: return null;
  }
}

function statusColor(status) {
  return { approved:T.green, pending:T.amber, rejected:T.red, draft:T.textDim }[status] || T.textDim;
}
function checkInColor(s) {
  return { "Completed":T.green, "On Track":T.blue, "Not Started":T.textDim }[s] || T.textDim;
}
function roleAccent(role) {
  return { employee:T.blue, manager:T.purple, admin:T.green }[role] || T.textMuted;
}
function initials(name) { return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); }

// ─── Base Styles ───────────────────────────────────────────────────────────────
const card = {
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  padding: "18px 22px",
};

const inputBase = {
  width: "100%",
  padding: "9px 13px",
  background: T.bg,
  border: `1px solid ${T.borderMid}`,
  borderRadius: 6,
  color: T.text,
  fontSize: 13,
  fontFamily: FONT_SERIF,
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.15s",
};

const selectBase = {
  ...inputBase,
  fontFamily: FONT_SANS,
  cursor: "pointer",
};

const statBox = {
  background: T.bg,
  borderRadius: 6,
  padding: "8px 12px",
};
const statLabel = {
  fontSize: 9,
  color: T.textDim,
  textTransform: "uppercase",
  letterSpacing: "1.2px",
  fontFamily: FONT_SANS,
  marginBottom: 4,
};
const statVal = {
  fontWeight: 600,
  fontSize: 14,
  fontFamily: FONT_SERIF,
  color: T.text,
};

// ─── Primitive Components ──────────────────────────────────────────────────────
function Btn({ label, onClick, variant = "default", small, icon }) {
  const variants = {
    default:  { bg: T.surfaceAlt, border: T.borderMid, color: T.text },
    primary:  { bg: T.amberPale,  border: `rgba(200,146,58,0.4)`, color: T.amber },
    green:    { bg: T.greenPale,  border: `rgba(106,170,126,0.4)`, color: T.green },
    red:      { bg: T.redPale,    border: `rgba(179,106,94,0.4)`,  color: T.red },
    ghost:    { bg: "transparent",border: T.border,                color: T.textMuted },
    purple:   { bg: T.purplePale, border: `rgba(157,133,168,0.4)`, color: T.purple },
  };
  const v = variants[variant] || variants.default;
  return (
    <button onClick={onClick} style={{
      padding: small ? "5px 12px" : "8px 18px",
      background: v.bg,
      border: `1px solid ${v.border}`,
      borderRadius: 6,
      color: v.color,
      fontSize: small ? 11 : 12,
      fontFamily: FONT_SANS,
      fontWeight: 500,
      cursor: "pointer",
      letterSpacing: "0.3px",
      whiteSpace: "nowrap",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      transition: "opacity 0.15s",
    }}
    onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >{icon}{label}</button>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      padding: "2px 10px",
      background: color + "22",
      color,
      borderRadius: 100,
      fontSize: 11,
      fontFamily: FONT_SANS,
      letterSpacing: "0.2px",
    }}>{label}</span>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block",
        fontSize: 10,
        color: T.textDim,
        textTransform: "uppercase",
        letterSpacing: "1.2px",
        fontFamily: FONT_SANS,
        marginBottom: 6,
      }}>{label}</label>
      {children}
      {error && <p style={{ color: T.red, fontSize: 11, margin: "4px 0 0", fontFamily: FONT_SANS }}>{error}</p>}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "56px 20px",
      color: T.textDim,
      fontFamily: FONT_SANS,
      fontSize: 13,
      letterSpacing: "0.2px",
    }}>
      <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.4 }}>○</div>
      {message}
    </div>
  );
}

function Avatar({ name, size = 36, color }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: "50%",
      background: (color || T.textDim) + "22",
      border: `1px solid ${(color || T.textDim)}44`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.35,
      fontWeight: 600,
      fontFamily: FONT_SANS,
      color: color || T.textMuted,
      flexShrink: 0,
    }}>
      {initials(name)}
    </div>
  );
}


// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(10,8,6,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20,
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: T.surface,
        border: `1px solid ${T.borderMid}`,
        borderRadius: 10,
        padding: 28,
        width: "100%",
        maxWidth: 520,
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, fontFamily: FONT_SERIF, color: T.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", fontSize: 22, lineHeight: 1, padding: "0 2px" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Goal Card ─────────────────────────────────────────────────────────────────
function GoalCard({ goal, onEdit, onSubmit, showActions }) {
  const sc = statusColor(goal.status);
  return (
    <div style={{ ...card, borderLeft: `2px solid ${sc}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: T.textDim, fontFamily: FONT_SANS, marginBottom: 4, letterSpacing: "0.3px" }}>
            {goal.thrustArea}
            {goal.sharedGoal && <span style={{ color: T.purple, marginLeft: 6 }}>· Shared</span>}
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, fontFamily: FONT_SERIF, color: T.text, lineHeight: 1.4 }}>{goal.title}</div>
          {goal.description && (
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4, fontFamily: FONT_SANS, lineHeight: 1.5 }}>{goal.description}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 16, flexShrink: 0 }}>
          <Badge label={goal.status} color={sc} />
          <span style={{ fontFamily: FONT_SANS, fontWeight: 600, color: T.amber, fontSize: 13 }}>{goal.weightage}%</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: T.textDim, fontFamily: FONT_SANS }}>
          UoM <span style={{ color: T.textMuted, marginLeft: 4 }}>{goal.uom}</span>
        </span>
        <span style={{ fontSize: 11, color: T.textDim, fontFamily: FONT_SANS }}>
          Target <span style={{ color: T.textMuted, marginLeft: 4 }}>{goal.target}</span>
        </span>
        {goal.lockedAt && (
          <span style={{ fontSize: 11, color: T.textDim, fontFamily: FONT_SANS }}>
            Locked <span style={{ color: T.textMuted, marginLeft: 4 }}>{goal.lockedAt}</span>
          </span>
        )}
      </div>

      {showActions && (
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <Btn label="Edit" onClick={onEdit} variant="ghost" small />
          <Btn label="Submit for Approval" onClick={onSubmit} variant="primary" small />
        </div>
      )}
    </div>
  );
}

// ─── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [userId, setUserId]           = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState("");
  const [showCreds, setShowCreds]     = useState(false);

  const credList = [
    { id:"emp1",  password:"emp123",   name:"Priya Sharma", role:"Employee" },
    { id:"emp2",  password:"emp123",   name:"Arjun Mehta",  role:"Employee" },
    { id:"emp3",  password:"emp123",   name:"Neha Patel",   role:"Employee" },
    { id:"mgr1",  password:"mgr123",   name:"Vikram Nair",  role:"Manager"  },
    { id:"mgr2",  password:"mgr123",   name:"Sunita Rao",   role:"Manager"  },
    { id:"admin", password:"admin123", name:"HR Admin",     role:"Admin"    },
  ];

  const roleColor = { Employee: T.blue, Manager: T.purple, Admin: T.green };

  function handleLogin() {
    const trimmed = userId.trim();
    if (!trimmed)  { setError("Please enter your User ID."); return; }
    if (!password) { setError("Please enter your password."); return; }
    if (CREDS[trimmed] === password) { setError(""); onLogin(INITIAL_USERS[trimmed]); }
    else setError("Invalid credentials. Try a demo account below.");
  }

  function quickLogin(id, pw) {
    setUserId(id); setPassword(pw); setError("");
    onLogin(INITIAL_USERS[id]);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT_SERIF,
      padding: 24,
    }}>
      {/* Subtle texture overlay */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,146,58,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 48, height: 48,
            background: T.amberPale,
            border: `1px solid rgba(200,146,58,0.3)`,
            borderRadius: 12,
            margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>◈</div>
          <h1 style={{ color: T.text, fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: "-0.3px" }}>AtomQuest</h1>
          <p style={{ color: T.textDim, fontSize: 11, margin: "6px 0 0", letterSpacing: "2.5px", textTransform: "uppercase", fontFamily: FONT_SANS }}>Goal Tracking Portal</p>
        </div>

        {/* Card */}
        <div style={{
          background: T.surface,
          border: `1px solid ${T.borderMid}`,
          borderRadius: 10,
          padding: "32px 30px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}>
          <Field label="User ID">
            <input
              type="text"
              value={userId}
              onChange={e => { setUserId(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="emp1, mgr1, admin…"
              style={{ ...inputBase, fontFamily: FONT_SANS }}
              autoFocus
            />
          </Field>

          <Field label="Password">
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Enter password"
                style={{ ...inputBase, fontFamily: FONT_SANS, paddingRight: 40 }}
              />
              <button
                onClick={() => setShowPassword(s => !s)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.textDim, cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}
              >{showPassword ? "○" : "●"}</button>
            </div>
          </Field>

          {error && (
            <div style={{ background: T.redPale, border: `1px solid rgba(179,106,94,0.3)`, borderRadius: 6, padding: "9px 13px", marginBottom: 16 }}>
              <p style={{ color: T.red, fontSize: 12, margin: 0, fontFamily: FONT_SANS }}>{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "11px",
              background: T.amberPale,
              border: `1px solid rgba(200,146,58,0.4)`,
              borderRadius: 7,
              color: T.amber,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: FONT_SANS,
              letterSpacing: "0.5px",
              marginBottom: 12,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Sign In
          </button>

          <button
            onClick={() => setShowCreds(s => !s)}
            style={{
              width: "100%",
              padding: "8px",
              background: "transparent",
              border: `1px solid ${T.border}`,
              borderRadius: 6,
              color: T.textDim,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: FONT_SANS,
              letterSpacing: "0.5px",
            }}
          >
            {showCreds ? "▲ Hide" : "▼ Show"} demo accounts
          </button>
        </div>

        {/* Credentials */}
        {showCreds && (
          <div style={{ ...card, marginTop: 12 }}>
            <p style={{ color: T.textDim, fontSize: 10, textTransform: "uppercase", letterSpacing: "1.2px", fontFamily: FONT_SANS, margin: "0 0 12px" }}>
              Click any row to sign in
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {credList.map(c => (
                <button
                  key={c.id}
                  onClick={() => quickLogin(c.id, c.password)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "transparent",
                    border: `1px solid ${T.border}`,
                    borderRadius: 6,
                    padding: "9px 12px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = T.surfaceAlt}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={c.name} size={30} color={roleColor[c.role]} />
                    <div>
                      <div style={{ color: T.text, fontSize: 12, fontFamily: FONT_SANS, fontWeight: 500 }}>{c.name}</div>
                      <div style={{ color: roleColor[c.role], fontSize: 10, fontFamily: FONT_SANS }}>{c.role}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_MONO }}>{c.id}</div>
                    <div style={{ color: T.textDim, fontSize: 10, fontFamily: FONT_MONO }}>{c.password}</div>
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

// ─── Shell ─────────────────────────────────────────────────────────────────────
function Shell({ user, onLogout, children, activeTab, setActiveTab }) {
  const accent = roleAccent(user.role);
  const tabs = user.role === "employee"
    ? [{ id:"goals", label:"My Goals" }, { id:"achievements", label:"Check-ins" }]
    : user.role === "manager"
    ? [{ id:"team", label:"Team" }, { id:"approvals", label:"Approvals" }, { id:"checkins", label:"Check-ins" }]
    : [{ id:"overview", label:"Overview" }, { id:"cycles", label:"Cycles" }, { id:"reports", label:"Reports" }, { id:"audit", label:"Audit" }];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: FONT_SERIF, color: T.text }}>
      {/* Top Bar */}
      <div style={{
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 28, height: 28,
            background: T.amberPale,
            border: `1px solid rgba(200,146,58,0.3)`,
            borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13,
          }}>◈</div>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.2px", color: T.text }}>AtomQuest</span>
          <span style={{ fontSize: 12, color: T.textDim, fontFamily: FONT_SANS }}>/ FY 2025–26</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{user.name}</div>
            <div style={{ fontSize: 10, color: accent, textTransform: "uppercase", letterSpacing: "1.2px", fontFamily: FONT_SANS }}>{user.role}</div>
          </div>
          <Avatar name={user.name} size={32} color={accent} />
          <Btn label="Sign out" onClick={onLogout} variant="ghost" small />
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        padding: "0 32px",
        display: "flex", gap: 0,
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "12px 18px",
              background: "none", border: "none",
              borderBottom: activeTab === t.id ? `2px solid ${accent}` : "2px solid transparent",
              color: activeTab === t.id ? T.text : T.textMuted,
              fontSize: 12, cursor: "pointer",
              fontFamily: FONT_SANS,
              fontWeight: activeTab === t.id ? 600 : 400,
              letterSpacing: "0.3px",
              transition: "color 0.15s",
              marginBottom: -1,
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "30px 32px", maxWidth: 1100 }}>{children}</div>
    </div>
  );
}

// ─── Employee: My Goals ────────────────────────────────────────────────────────
function EmployeeGoals({ user, goals, setGoals, auditLog, setAuditLog }) {
  const myGoals    = Object.values(goals).filter(g => g.employeeId === user.id);
  const totalWeight = myGoals.filter(g => g.status !== "rejected").reduce((s, g) => s + Number(g.weightage), 0);
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [form, setForm]         = useState({ thrustArea: THRUST_AREAS[0], title: "", description: "", uom: UOM_TYPES[0], target: "", weightage: "" });
  const [errors, setErrors]     = useState({});

  function openNew() { setForm({ thrustArea: THRUST_AREAS[0], title: "", description: "", uom: UOM_TYPES[0], target: "", weightage: "" }); setEditGoal(null); setErrors({}); setShowForm(true); }
  function openEdit(g) { setForm({ thrustArea: g.thrustArea, title: g.title, description: g.description, uom: g.uom, target: g.target, weightage: g.weightage }); setEditGoal(g); setErrors({}); setShowForm(true); }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Required";
    if (!form.target) errs.target = "Required";
    const w = Number(form.weightage);
    if (!w || w < 10) errs.weightage = "Minimum 10%";
    if (w > 100) errs.weightage = "Cannot exceed 100%";
    const active = myGoals.filter(g => g.status !== "rejected" && g.id !== editGoal?.id);
    const newTotal = active.reduce((s, g) => s + Number(g.weightage), 0) + w;
    if (newTotal > 100) errs.weightage = `Total would exceed 100% (current: ${active.reduce((s,g)=>s+Number(g.weightage),0)}%)`;
    if (!editGoal && active.length >= 8) errs.general = "Maximum 8 goals per employee";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (editGoal) {
      setGoals(prev => ({ ...prev, [editGoal.id]: { ...prev[editGoal.id], ...form, status: "draft" } }));
    } else {
      const id = "g" + Date.now();
      setGoals(prev => ({ ...prev, [id]: { id, employeeId: user.id, ...form, status: "draft", sharedGoal: false, achievements: {}, checkInStatuses: {}, managerComments: {}, createdAt: new Date().toISOString().slice(0,10) } }));
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600, fontFamily: FONT_SERIF, color: T.text }}>My Goal Sheet</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <Badge label={`${myGoals.length}/8 goals`} color={T.blue} />
            <Badge label={`${totalWeight}% weighted`} color={totalWeight === 100 ? T.green : totalWeight > 100 ? T.red : T.amber} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {draftGoals.length > 0 && totalWeight === 100 && <Btn label="Submit All" onClick={submitAll} variant="purple" />}
          <Btn label="+ Add Goal" onClick={openNew} variant="primary" />
        </div>
      </div>

      {totalWeight !== 100 && myGoals.length > 0 && (
        <div style={{ background: T.amberPale, border: `1px solid rgba(200,146,58,0.25)`, borderRadius: 7, padding: "10px 16px", marginBottom: 20 }}>
          <p style={{ color: T.amber, fontSize: 12, margin: 0, fontFamily: FONT_SANS }}>
            Total weightage is {totalWeight}% — must reach exactly 100% before submission.
          </p>
        </div>
      )}

      {myGoals.length === 0 ? (
        <EmptyState message="No goals yet. Click '+ Add Goal' to begin." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {myGoals.map(g => (
            <GoalCard key={g.id} goal={g} onEdit={() => openEdit(g)} onSubmit={() => handleSubmit(g.id)} showActions={g.status === "draft"} />
          ))}
        </div>
      )}

      {showForm && (
        <Modal title={editGoal ? "Edit Goal" : "New Goal"} onClose={() => setShowForm(false)}>
          <Field label="Thrust Area">
            <select value={form.thrustArea} onChange={e => setForm(f => ({ ...f, thrustArea: e.target.value }))} style={selectBase}>
              {THRUST_AREAS.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Goal Title" error={errors.title}>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputBase} placeholder="e.g. Achieve Q4 Revenue Target" />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputBase, height: 72, resize: "vertical" }} placeholder="Brief description of the goal" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Unit of Measurement">
              <select value={form.uom} onChange={e => setForm(f => ({ ...f, uom: e.target.value }))} style={selectBase}>
                {UOM_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Target" error={errors.target}>
              <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} style={inputBase} placeholder="e.g. 100" />
            </Field>
          </div>
          <Field label="Weightage (%)" error={errors.weightage}>
            <input type="number" value={form.weightage} onChange={e => setForm(f => ({ ...f, weightage: e.target.value }))} style={inputBase} placeholder="Min 10%, total = 100%" min={10} max={100} />
          </Field>
          {errors.general && <p style={{ color: T.red, fontSize: 12, fontFamily: FONT_SANS, marginBottom: 8 }}>{errors.general}</p>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <Btn label="Cancel" onClick={() => setShowForm(false)} variant="ghost" />
            <Btn label="Save Goal" onClick={handleSave} variant="primary" />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Employee: Check-ins ───────────────────────────────────────────────────────
function EmployeeCheckins({ user, goals, setGoals, auditLog, setAuditLog }) {
  const myGoals = Object.values(goals).filter(g => g.employeeId === user.id && g.status === "approved");
  const [selQ, setSelQ]   = useState(QUARTERS[0]);
  const [inputs, setInputs] = useState({});

  function handleSave(goalId) {
    const val = inputs[goalId];
    if (val === undefined || val === "") return;
    setGoals(prev => ({
      ...prev, [goalId]: { ...prev[goalId],
        achievements:    { ...prev[goalId].achievements,    [selQ]: Number(val) },
        checkInStatuses: { ...prev[goalId].checkInStatuses, [selQ]: prev[goalId].checkInStatuses[selQ] || "On Track" },
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
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, fontFamily: FONT_SERIF }}>Quarterly Check-ins</h2>
        <div style={{ display: "flex", gap: 6 }}>
          {QUARTERS.map(q => (
            <button key={q} onClick={() => setSelQ(q)} style={{
              padding: "6px 13px",
              background: selQ === q ? T.bluePale : "transparent",
              border: `1px solid ${selQ === q ? "rgba(122,153,184,0.4)" : T.border}`,
              borderRadius: 6,
              color: selQ === q ? T.blue : T.textMuted,
              fontSize: 11, cursor: "pointer", fontFamily: FONT_SANS,
              transition: "all 0.12s",
            }}>{q}</button>
          ))}
        </div>
      </div>

      {myGoals.length === 0 ? <EmptyState message="No approved goals to check in on yet." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {myGoals.map(g => {
            const score = computeScore(g, selQ);
            const existingAchievement = g.achievements[selQ];
            const existingStatus      = g.checkInStatuses[selQ] || "Not Started";
            const managerComment      = g.managerComments?.[selQ];
            const scoreNum = parseFloat(score);
            const scoreColor = score === null ? T.textDim : scoreNum >= 100 ? T.green : scoreNum >= 75 ? T.amber : T.red;

            return (
              <div key={g.id} style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: T.textDim, fontFamily: FONT_SANS, marginBottom: 3 }}>{g.thrustArea}</div>
                    <div style={{ fontWeight: 600, fontSize: 14, fontFamily: FONT_SERIF }}>{g.title}</div>
                  </div>
                  <span style={{ fontFamily: FONT_SANS, fontWeight: 600, color: T.amber, fontSize: 12 }}>{g.weightage}%</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <div style={statBox}><div style={statLabel}>UoM</div><div style={statVal}>{g.uom}</div></div>
                  <div style={statBox}><div style={statLabel}>Target</div><div style={statVal}>{g.target}</div></div>
                  <div style={statBox}><div style={statLabel}>Score</div><div style={{ ...statVal, color: scoreColor }}>{score !== null ? score + "%" : "—"}</div></div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label={`Actual (${selQ})`}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="number"
                        value={inputs[g.id] !== undefined ? inputs[g.id] : (existingAchievement ?? "")}
                        onChange={e => setInputs(p => ({ ...p, [g.id]: e.target.value }))}
                        style={{ ...inputBase, flex: 1 }}
                        placeholder="Enter actual"
                      />
                      <button onClick={() => handleSave(g.id)} style={{ padding: "0 14px", background: T.bluePale, border: `1px solid rgba(122,153,184,0.3)`, borderRadius: 6, color: T.blue, cursor: "pointer", fontSize: 11, fontFamily: FONT_SANS }}>Save</button>
                    </div>
                  </Field>
                  <Field label="Status">
                    <select value={existingStatus} onChange={e => handleStatusChange(g.id, e.target.value)} style={{ ...selectBase, borderColor: checkInColor(existingStatus) + "66" }}>
                      <option>Not Started</option><option>On Track</option><option>Completed</option>
                    </select>
                  </Field>
                </div>

                {managerComment && (
                  <div style={{ marginTop: 10, background: T.purplePale, border: `1px solid rgba(157,133,168,0.2)`, borderRadius: 6, padding: "9px 13px" }}>
                    <div style={{ fontSize: 10, color: T.purple, fontFamily: FONT_SANS, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>Manager Note</div>
                    <div style={{ fontSize: 13, color: T.textMuted, fontFamily: FONT_SANS }}>{managerComment}</div>
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

// ─── Manager: Team Dashboard ───────────────────────────────────────────────────
function ManagerTeam({ user, goals, users }) {
  const myTeam = Object.values(users).filter(u => u.managerId === user.id);

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 600, fontFamily: FONT_SERIF }}>Team Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {myTeam.map(emp => {
          const empGoals = Object.values(goals).filter(g => g.employeeId === emp.id);
          const approved  = empGoals.filter(g => g.status === "approved").length;
          const pending   = empGoals.filter(g => g.status === "pending").length;
          const totalW    = empGoals.filter(g => g.status !== "rejected").reduce((s,g) => s + Number(g.weightage), 0);
          return (
            <div key={emp.id} style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Avatar name={emp.name} size={38} color={T.blue} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, fontFamily: FONT_SERIF }}>{emp.name}</div>
                  <div style={{ fontSize: 11, color: T.textDim, fontFamily: FONT_SANS }}>{emp.department}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                <div style={statBox}><div style={statLabel}>Goals</div><div style={statVal}>{empGoals.length}</div></div>
                <div style={statBox}><div style={statLabel}>Approved</div><div style={{ ...statVal, color: T.green }}>{approved}</div></div>
                <div style={statBox}><div style={statLabel}>Pending</div><div style={{ ...statVal, color: T.amber }}>{pending}</div></div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: FONT_SANS, color: T.textDim, marginBottom: 5 }}>
                  <span>Weightage</span>
                  <span style={{ color: totalW === 100 ? T.green : T.amber }}>{totalW}%</span>
                </div>
                <div style={{ height: 3, background: T.border, borderRadius: 4 }}>
                  <div style={{ height: "100%", width: Math.min(totalW, 100) + "%", background: totalW === 100 ? T.green : T.amber, borderRadius: 4, transition: "width 0.3s" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Manager: Approvals ────────────────────────────────────────────────────────
function ManagerApprovals({ user, goals, setGoals, users, auditLog, setAuditLog }) {
  const myTeamIds   = Object.values(users).filter(u => u.managerId === user.id).map(u => u.id);
  const pendingGoals = Object.values(goals).filter(g => myTeamIds.includes(g.employeeId) && g.status === "pending");
  const [editing, setEditing] = useState({});

  function handleApprove(g) {
    setGoals(prev => ({ ...prev, [g.id]: { ...prev[g.id], status: "approved", lockedAt: new Date().toISOString().slice(0,10), target: editing[g.id+"_target"] || g.target, weightage: editing[g.id+"_weight"] || g.weightage } }));
    setAuditLog(prev => [{ id: Date.now(), action: "Goal approved", goalId: g.id, goalTitle: g.title, by: user.name, role: "manager", timestamp: new Date().toLocaleString() }, ...prev]);
  }

  function handleReject(g) {
    setGoals(prev => ({ ...prev, [g.id]: { ...prev[g.id], status: "rejected" } }));
    setAuditLog(prev => [{ id: Date.now(), action: "Goal returned for rework", goalId: g.id, goalTitle: g.title, by: user.name, role: "manager", timestamp: new Date().toLocaleString() }, ...prev]);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, fontFamily: FONT_SERIF }}>Pending Approvals</h2>
        {pendingGoals.length > 0 && <Badge label={String(pendingGoals.length)} color={T.amber} />}
      </div>

      {pendingGoals.length === 0 ? <EmptyState message="No pending goals to review." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pendingGoals.map(g => {
            const emp = users[g.employeeId];
            return (
              <div key={g.id} style={{ ...card, borderLeft: `2px solid ${T.amber}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: T.textDim, fontFamily: FONT_SANS, marginBottom: 3 }}>
                      {emp?.name} · {g.thrustArea}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, fontFamily: FONT_SERIF }}>{g.title}</div>
                    <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4, fontFamily: FONT_SANS }}>{g.description}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
                  <div style={statBox}><div style={statLabel}>UoM</div><div style={statVal}>{g.uom}</div></div>
                  <div style={statBox}>
                    <div style={statLabel}>Target</div>
                    <input type="number" defaultValue={g.target} onChange={e => setEditing(p => ({ ...p, [g.id+"_target"]: e.target.value }))} style={{ background: "transparent", border: "none", color: T.text, fontWeight: 600, fontSize: 14, width: "100%", fontFamily: FONT_SERIF, outline: "none", padding: 0 }} />
                  </div>
                  <div style={statBox}>
                    <div style={statLabel}>Weight %</div>
                    <input type="number" defaultValue={g.weightage} onChange={e => setEditing(p => ({ ...p, [g.id+"_weight"]: e.target.value }))} style={{ background: "transparent", border: "none", color: T.amber, fontWeight: 600, fontSize: 14, width: "100%", fontFamily: FONT_SERIF, outline: "none", padding: 0 }} min={10} />
                  </div>
                  <div style={statBox}><div style={statLabel}>Submitted</div><div style={statVal}>{g.createdAt}</div></div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn label="Approve & Lock" onClick={() => handleApprove(g)} variant="green" />
                  <Btn label="Return for Rework" onClick={() => handleReject(g)} variant="red" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Manager: Check-ins ────────────────────────────────────────────────────────
function ManagerCheckins({ user, goals, setGoals, users, auditLog, setAuditLog }) {
  const myTeamIds = Object.values(users).filter(u => u.managerId === user.id).map(u => u.id);
  const teamGoals = Object.values(goals).filter(g => myTeamIds.includes(g.employeeId) && g.status === "approved");
  const [selQ, setSelQ]       = useState(QUARTERS[0]);
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
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, fontFamily: FONT_SERIF }}>Team Check-ins</h2>
        <div style={{ display: "flex", gap: 6 }}>
          {QUARTERS.map(q => (
            <button key={q} onClick={() => setSelQ(q)} style={{
              padding: "6px 13px",
              background: selQ === q ? T.purplePale : "transparent",
              border: `1px solid ${selQ === q ? "rgba(157,133,168,0.4)" : T.border}`,
              borderRadius: 6,
              color: selQ === q ? T.purple : T.textMuted,
              fontSize: 11, cursor: "pointer", fontFamily: FONT_SANS,
            }}>{q}</button>
          ))}
        </div>
      </div>

      {teamGoals.length === 0 ? <EmptyState message="No approved team goals to review." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {teamGoals.map(g => {
            const emp             = users[g.employeeId];
            const achievement     = g.achievements[selQ];
            const status          = g.checkInStatuses[selQ] || "Not Started";
            const score           = computeScore(g, selQ);
            const existingComment = g.managerComments?.[selQ];
            const scoreNum        = parseFloat(score);
            const scoreColor      = score === null ? T.textDim : scoreNum >= 100 ? T.green : scoreNum >= 75 ? T.amber : T.red;

            return (
              <div key={g.id} style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: T.textDim, fontFamily: FONT_SANS, marginBottom: 3 }}>{emp?.name} · {g.thrustArea}</div>
                    <div style={{ fontWeight: 600, fontSize: 14, fontFamily: FONT_SERIF }}>{g.title}</div>
                  </div>
                  <Badge label={status} color={checkInColor(status)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
                  <div style={statBox}><div style={statLabel}>Target</div><div style={statVal}>{g.target}</div></div>
                  <div style={statBox}><div style={statLabel}>Actual</div><div style={statVal}>{achievement ?? "—"}</div></div>
                  <div style={statBox}><div style={statLabel}>Score</div><div style={{ ...statVal, color: scoreColor }}>{score !== null ? score + "%" : "—"}</div></div>
                  <div style={statBox}><div style={statLabel}>Weight</div><div style={{ ...statVal, color: T.amber }}>{g.weightage}%</div></div>
                </div>
                {existingComment && (
                  <div style={{ background: T.purplePale, border: `1px solid rgba(157,133,168,0.2)`, borderRadius: 6, padding: "9px 13px", marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: T.purple, fontFamily: FONT_SANS, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 }}>Your Note</div>
                    <div style={{ fontSize: 13, color: T.textMuted, fontFamily: FONT_SANS }}>{existingComment}</div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={comments[g.id] || ""}
                    onChange={e => setComments(p => ({ ...p, [g.id]: e.target.value }))}
                    style={{ ...inputBase, flex: 1 }}
                    placeholder="Add check-in comment…"
                  />
                  <button onClick={() => saveComment(g.id)} style={{ padding: "0 16px", background: T.purplePale, border: `1px solid rgba(157,133,168,0.3)`, borderRadius: 6, color: T.purple, cursor: "pointer", fontSize: 11, fontFamily: FONT_SANS }}>Post</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Admin: Overview ───────────────────────────────────────────────────────────
function AdminOverview({ goals, users }) {
  const allGoals  = Object.values(goals);
  const employees = Object.values(users).filter(u => u.role === "employee");
  const stats = [
    { label: "Employees",     value: employees.length,                                   color: T.blue   },
    { label: "Goals Created", value: allGoals.length,                                    color: T.purple },
    { label: "Approved",      value: allGoals.filter(g => g.status === "approved").length, color: T.green  },
    { label: "Pending",       value: allGoals.filter(g => g.status === "pending").length,  color: T.amber  },
  ];

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 600, fontFamily: FONT_SERIF }}>Organisation Overview</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 600, fontFamily: FONT_SERIF, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: T.textDim, fontFamily: FONT_SANS, letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, color: T.textMuted, fontFamily: FONT_SANS, letterSpacing: "0.3px" }}>Completion Dashboard</h3>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
          <thead>
            <tr style={{ background: T.surfaceAlt }}>
              {["Employee","Department","Goals Set","Approved","Pending","Q1 Check-in","Q2 Check-in"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: T.textDim, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => {
              const empGoals = allGoals.filter(g => g.employeeId === emp.id);
              const q1Done   = empGoals.filter(g => g.checkInStatuses?.["Q1 (July)"]).length;
              const q2Done   = empGoals.filter(g => g.checkInStatuses?.["Q2 (October)"]).length;
              const appLen   = empGoals.filter(g => g.status === "approved").length;
              return (
                <tr key={emp.id} style={{ borderTop: `1px solid ${T.border}`, background: i % 2 === 0 ? "transparent" : "rgba(255,245,230,0.01)" }}>
                  <td style={{ padding: "10px 16px", fontWeight: 500, color: T.text }}>{emp.name}</td>
                  <td style={{ padding: "10px 16px", color: T.textMuted }}>{emp.department}</td>
                  <td style={{ padding: "10px 16px", color: T.textMuted }}>{empGoals.length}</td>
                  <td style={{ padding: "10px 16px", color: T.green }}>{empGoals.filter(g => g.status === "approved").length}</td>
                  <td style={{ padding: "10px 16px", color: T.amber }}>{empGoals.filter(g => g.status === "pending").length}</td>
                  <td style={{ padding: "10px 16px" }}><Badge label={`${q1Done}/${appLen}`} color={q1Done > 0 ? T.green : T.textDim} /></td>
                  <td style={{ padding: "10px 16px" }}><Badge label={`${q2Done}/${appLen}`} color={q2Done > 0 ? T.green : T.textDim} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Admin: Reports ────────────────────────────────────────────────────────────
function AdminReports({ goals, users }) {
  const approved = Object.values(goals).filter(g => g.status === "approved");

  function downloadCSV() {
    const rows = [["Employee","Goal Title","Thrust Area","UoM","Target","Q1 Actual","Q1 Score","Q2 Actual","Q2 Score","Weightage"]];
    approved.forEach(g => {
      const emp = users[g.employeeId];
      rows.push([emp?.name, g.title, g.thrustArea, g.uom, g.target, g.achievements["Q1 (July)"] ?? "", computeScore(g,"Q1 (July)") ?? "", g.achievements["Q2 (October)"] ?? "", computeScore(g,"Q2 (October)") ?? "", g.weightage+"%"]);
    });
    const csv  = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "achievement_report.csv"; a.click();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, fontFamily: FONT_SERIF }}>Achievement Report</h2>
        <Btn label="Export CSV" onClick={downloadCSV} variant="green" icon="↓" />
      </div>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT_SANS, fontSize: 12 }}>
          <thead>
            <tr style={{ background: T.surfaceAlt }}>
              {["Employee","Goal","Thrust Area","UoM","Target","Q1 Actual","Q1 %","Q2 Actual","Q2 %","Weight"].map(h => (
                <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: T.textDim, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.6px", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {approved.map((g, i) => {
              const emp = users[g.employeeId];
              return (
                <tr key={g.id} style={{ borderTop: `1px solid ${T.border}`, background: i % 2 === 0 ? "transparent" : "rgba(255,245,230,0.01)" }}>
                  <td style={{ padding: "8px 12px", fontWeight: 500, color: T.text }}>{emp?.name}</td>
                  <td style={{ padding: "8px 12px", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: T.textMuted }}>{g.title}</td>
                  <td style={{ padding: "8px 12px", color: T.textDim }}>{g.thrustArea}</td>
                  <td style={{ padding: "8px 12px", color: T.textDim }}>{g.uom}</td>
                  <td style={{ padding: "8px 12px", color: T.textMuted }}>{g.target}</td>
                  <td style={{ padding: "8px 12px", color: T.textMuted }}>{g.achievements["Q1 (July)"] ?? "—"}</td>
                  <td style={{ padding: "8px 12px", color: T.green }}>{computeScore(g,"Q1 (July)") ? computeScore(g,"Q1 (July)")+"%" : "—"}</td>
                  <td style={{ padding: "8px 12px", color: T.textMuted }}>{g.achievements["Q2 (October)"] ?? "—"}</td>
                  <td style={{ padding: "8px 12px", color: T.green }}>{computeScore(g,"Q2 (October)") ? computeScore(g,"Q2 (October)")+"%" : "—"}</td>
                  <td style={{ padding: "8px 12px", color: T.amber }}>{g.weightage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Admin: Audit ──────────────────────────────────────────────────────────────
function AdminAudit({ auditLog }) {
  const roleAcc = { employee: T.blue, manager: T.purple, admin: T.green };
  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 600, fontFamily: FONT_SERIF }}>Audit Trail</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {auditLog.map(e => (
          <div key={e.id} style={{ ...card, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: roleAcc[e.role] || T.textDim, flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: 500, fontSize: 13, fontFamily: FONT_SERIF, color: T.text }}>{e.action}</span>
                <span style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_SANS, marginLeft: 6 }}>on "{e.goalTitle}"</span>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 20 }}>
              <div style={{ fontSize: 12, fontFamily: FONT_SANS, color: T.textMuted }}>{e.by} <span style={{ color: roleAcc[e.role] || T.textDim }}>({e.role})</span></div>
              <div style={{ fontSize: 10, color: T.textDim, fontFamily: FONT_MONO, marginTop: 2 }}>{e.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin: Cycles ─────────────────────────────────────────────────────────────
function AdminCycles() {
  const cycles = [
    { period: "Phase 1 — Goal Setting", opens: "1 May 2025",      action: "Goal Creation, Submission & Approval", active: false, done: true  },
    { period: "Q1 Check-in",            opens: "July 2025",        action: "Progress Update — Planned vs. Actual",  active: true,  done: false },
    { period: "Q2 Check-in",            opens: "October 2025",     action: "Progress Update — Planned vs. Actual",  active: false, done: false },
    { period: "Q3 Check-in",            opens: "January 2026",     action: "Progress Update — Planned vs. Actual",  active: false, done: false },
    { period: "Q4 / Annual",            opens: "March / April 2026", action: "Final Achievement Capture",           active: false, done: false },
  ];

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 600, fontFamily: FONT_SERIF }}>Check-in Schedule</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cycles.map((c, i) => {
          const accent = c.active ? T.green : c.done ? T.blue : T.textDim;
          return (
            <div key={i} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `2px solid ${accent}` }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13, fontFamily: FONT_SERIF, color: T.text }}>{c.period}</div>
                <div style={{ fontSize: 11, color: T.textDim, fontFamily: FONT_SANS, marginTop: 3 }}>{c.action}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: T.textDim, fontFamily: FONT_SANS, marginBottom: 4 }}>{c.opens}</div>
                <Badge label={c.active ? "Active" : c.done ? "Completed" : "Upcoming"} color={accent} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]       = useState(null);
  const [goals, setGoals]     = useState(INITIAL_GOALS);
  const [auditLog, setAuditLog] = useState(AUDIT_INITIAL);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (user) {
      const defaults = { employee:"goals", manager:"team", admin:"overview" };
      setActiveTab(defaults[user.role]);
    }
  }, [user]);

  if (!user) return <LoginScreen onLogin={setUser} />;

  function renderContent() {
    if (user.role === "employee") {
      if (activeTab === "goals")        return <EmployeeGoals     user={user} goals={goals} setGoals={setGoals} auditLog={auditLog} setAuditLog={setAuditLog} />;
      if (activeTab === "achievements") return <EmployeeCheckins  user={user} goals={goals} setGoals={setGoals} auditLog={auditLog} setAuditLog={setAuditLog} />;
    }
    if (user.role === "manager") {
      if (activeTab === "team")      return <ManagerTeam      user={user} goals={goals} users={INITIAL_USERS} />;
      if (activeTab === "approvals") return <ManagerApprovals user={user} goals={goals} setGoals={setGoals} users={INITIAL_USERS} auditLog={auditLog} setAuditLog={setAuditLog} />;
      if (activeTab === "checkins")  return <ManagerCheckins  user={user} goals={goals} setGoals={setGoals} users={INITIAL_USERS} auditLog={auditLog} setAuditLog={setAuditLog} />;
    }
    if (user.role === "admin") {
      if (activeTab === "overview") return <AdminOverview goals={goals} users={INITIAL_USERS} />;
      if (activeTab === "cycles")   return <AdminCycles />;
      if (activeTab === "reports")  return <AdminReports goals={goals} users={INITIAL_USERS} />;
      if (activeTab === "audit")    return <AdminAudit auditLog={auditLog} />;
    }
    return null;
  }

  return (
    <Shell user={user} onLogout={() => setUser(null)} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Shell>
  );
}
