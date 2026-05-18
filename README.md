# ⚡ AtomQuest — Goal Setting & Tracking Portal

> A full-featured, role-based performance management portal built for the **AtomQuest Hackathon 1.0**. Covers the complete goal lifecycle — from creation and approval, through quarterly check-ins, to year-end achievement reporting.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Live Demo](#2-live-demo)
3. [Demo Credentials](#3-demo-credentials)
4. [Features](#4-features)
   - [Employee Features](#41-employee-features)
   - [Manager Features](#42-manager-features)
   - [Admin / HR Features](#43-admin--hr-features)
5. [User Journeys](#5-user-journeys)
6. [Business Rules & Validations](#6-business-rules--validations)
7. [Score Computation Logic](#7-score-computation-logic)
8. [Tech Stack](#8-tech-stack)
9. [Project Structure](#9-project-structure)
10. [Getting Started](#10-getting-started)
    - [Prerequisites](#101-prerequisites)
    - [Installation](#102-installation)
    - [Running Locally](#103-running-locally)
    - [Deploying to Vercel](#104-deploying-to-vercel)
11. [Data Model](#11-data-model)
12. [Component Architecture](#12-component-architecture)
13. [Check-in Schedule](#13-check-in-schedule)
14. [BRD Compliance Checklist](#14-brd-compliance-checklist)
15. [Known Limitations & Future Enhancements](#15-known-limitations--future-enhancements)
16. [Contributing](#16-contributing)
17. [License](#17-license)

---

## 1. Project Overview

The **AtomQuest Goal Setting & Tracking Portal** is a web-based performance management system designed to replace manual, spreadsheet-driven goal-setting processes within an organisation. It supports three distinct user roles — **Employee**, **Manager (L1)**, and **Admin / HR** — each with their own tailored interface and workflow.

The system enforces a structured, two-phase annual cycle aligned to the organisation's fiscal year (FY 2025–26):

- **Phase 1 (May)** — Employees set goals, managers review and approve or return them for rework. Goals are locked on approval.
- **Phase 2 (Quarterly)** — Employees log actual achievements each quarter. Managers review progress and add structured check-in notes. Scores are computed automatically.

The portal was built as a single-file React application (`App.jsx`) for ease of portability and demo deployment, while the architecture is designed to plug into a full Next.js + PostgreSQL + Vercel backend for production use.

---

## 2. Live Demo

| Resource | Link |
|---|---|
| Live Portal | https://atomquest-goal-portal.vercel.app |
| Source Code | https://github.com/atomquest-team/goal-tracking-portal |
| Architecture Diagram | https://atomquest-goal-portal.vercel.app/architecture.pdf |

> **Note:** The demo runs entirely in-memory. All data resets on page refresh. No backend or database is required to run or evaluate the demo.

---

## 3. Demo Credentials

The portal ships with six pre-seeded demo accounts. You can either type the credentials manually or click any row in the **"View demo credentials"** panel on the login screen to sign in instantly.

| Role | User ID | Password | Name |
|---|---|---|---|
| Employee | `emp1` | `emp123` | Priya Sharma |
| Employee | `emp2` | `emp123` | Arjun Mehta |
| Employee | `emp3` | `emp123` | Neha Patel |
| Manager (L1) | `mgr1` | `mgr123` | Vikram Nair |
| Manager (L1) | `mgr2` | `mgr123` | Sunita Rao |
| Admin / HR | `admin` | `admin123` | HR Admin |

**Reporting structure:**
- Priya Sharma and Arjun Mehta report to Vikram Nair (Sales)
- Neha Patel reports to Sunita Rao (Technology)

---

## 4. Features

### 4.1 Employee Features

#### Goal Sheet (`My Goals` tab)
- Create up to **8 goals** per fiscal year
- Each goal includes:
  - **Thrust Area** — one of 7 strategic pillars (Revenue Growth, Cost Optimisation, Customer Experience, People & Culture, Innovation & Digital, Operational Excellence, Compliance & Risk)
  - **Goal Title** — free-text, required
  - **Description** — optional narrative
  - **Unit of Measurement (UoM)** — one of 6 types (see [Score Computation](#7-score-computation-logic))
  - **Target** — numeric value aligned to the chosen UoM
  - **Weightage (%)** — minimum 10%, total across all goals must equal exactly 100%
- **Live weightage bar** — shows running total; turns green at exactly 100%, amber below, red above
- **Draft → Submit → Locked** goal lifecycle:
  - Goals are saved as `draft` until the employee submits them
  - Submission requires total weightage = 100%
  - Submitted goals move to `pending` and await manager review
  - Approved goals are locked — no further edits by the employee
- **Inline editing** of draft goals
- **Submit All** shortcut — submits all draft goals in one action when weightage is complete

#### Check-ins (`Check-ins` tab)
- Available only for `approved` goals
- Quarter selector: Q1 (July), Q2 (October), Q3 (January), Q4 / Annual (March)
- Log **actual achievement** against each goal per quarter
- **Auto-computed score** based on UoM type — updates instantly on save
- Set check-in **status** per goal per quarter: `Not Started`, `On Track`, `Completed`
- View **manager's check-in notes** inline, directly below the relevant goal

---

### 4.2 Manager Features

#### Team Dashboard (`Team` tab)
- Card view of all direct reports
- Per-employee stats: total goals, approved, pending review
- **Weightage progress bar** per employee — shows whether their goal sheet is complete

#### Approvals (`Approvals` tab)
- List of all `pending` goals from direct reports, with employee name, thrust area, description
- **Inline editing** of Target and Weightage before approving — no separate edit flow needed
- **Approve & Lock** — moves goal to `approved`, stamps a lock date, prevents further employee edits
- **Return for Rework** — moves goal back to `rejected`; employee can re-edit and resubmit
- Pending count badge on the tab label

#### Check-ins (`Check-ins` tab)
- Quarter selector (same as employee view)
- View each team member's actual achievement vs. target, computed score, and check-in status
- **Post a check-in note** per goal per quarter — visible to the employee in their check-ins view
- Editable comment field with Enter-key submission

---

### 4.3 Admin / HR Features

#### Overview (`Overview` tab)
- Org-wide stat cards: total employees, goals created, approved, pending review
- **Completion Dashboard table** — all employees, with goal counts, approval status, and Q1/Q2 check-in completion ratios

#### Cycles (`Cycles` tab)
- Visual timeline of the BRD-mandated check-in schedule
- Shows which phase is currently active (highlighted in green), completed phases (blue), and upcoming phases (gray)

#### Reports (`Reports` tab)
- Full **Achievement Report** table — all approved goals across the organisation
- Columns: Employee, Goal Title, Thrust Area, UoM, Target, Q1 Actual, Q1 Score, Q2 Actual, Q2 Score, Weightage
- **Export CSV** button — generates and downloads a complete `.csv` file for offline analysis or payroll integration

#### Audit Log (`Audit Log` tab)
- Chronological log of every state change across the system
- Each entry records: action type, goal title, actor name, role, and precise timestamp
- Events logged: goal submitted, goal approved, goal returned, achievement logged, check-in comment added

---

## 5. User Journeys

### Journey 1 — Employee (Goal Setting Phase)

```
Login as emp1 (Priya Sharma)
  ↓
My Goals → click "+ New goal"
  ↓
Fill in: Thrust Area, Title, Description, UoM, Target, Weightage
  ↓
Save → goal appears as "draft"
  ↓
Repeat until all goals are added and total weightage = 100%
  ↓
Click "Submit all" → goals move to "pending"
  ↓
Wait for manager approval
  ↓
Once approved, Check-ins tab becomes active
```

### Journey 2 — Employee (Check-in Phase)

```
Login as emp1
  ↓
Check-ins tab → select quarter (e.g. Q1 July)
  ↓
Enter actual achievement value for each goal → click Save
  ↓
System computes score automatically based on UoM
  ↓
Set status: On Track / Completed / Not Started
  ↓
View manager's check-in note (if posted)
```

### Journey 3 — Manager (Approval)

```
Login as mgr1 (Vikram Nair)
  ↓
Approvals tab → see pending goals from direct reports
  ↓
Review goal details inline
  ↓
Optionally edit Target or Weightage directly in the card
  ↓
Click "Approve & lock" → goal is locked, audit event created
  OR
Click "Return for rework" → goal goes back to employee as "rejected"
```

### Journey 4 — Manager (Check-ins)

```
Login as mgr1
  ↓
Check-ins tab → select quarter
  ↓
Review each team member's actual vs. target and score
  ↓
Type a check-in note → press Enter or click "Post"
  ↓
Note appears on employee's check-in view immediately
```

### Journey 5 — Admin / HR

```
Login as admin
  ↓
Overview → see org-wide completion dashboard
  ↓
Cycles → confirm which check-in window is active
  ↓
Reports → review full achievement table
  ↓
Click "Export CSV" → download for payroll / appraisal use
  ↓
Audit Log → review complete change history
```

---

## 6. Business Rules & Validations

All of the following are enforced in the UI with real-time feedback — no silent failures.

| Rule | Details |
|---|---|
| **Minimum weightage per goal** | Each goal must carry at least 10% weightage |
| **Maximum weightage per goal** | Cannot exceed 100% (meaningless to have a single 100% goal is allowed but discouraged) |
| **Total weightage = 100%** | The goal sheet cannot be submitted until the sum of all active goal weightages equals exactly 100% |
| **Maximum goals per employee** | Hard cap of 8 goals per employee per fiscal year |
| **Goal locking on approval** | Once a manager approves a goal, the employee cannot edit any field — including title, target, description, or weightage |
| **Shared goal constraints** | For goals pushed from manager/org level, the employee may only adjust weightage; title and target are read-only |
| **Check-in gating** | The Check-ins tab only shows goals with `approved` status — draft and pending goals are excluded |
| **Submission prerequisite** | "Submit all" is only enabled when total weightage equals 100% and at least one goal is in draft status |

---

## 7. Score Computation Logic

Scores are computed in real-time when an actual achievement is entered. The formula depends on the **Unit of Measurement (UoM)** selected for each goal.

| UoM Type | Formula | Use Case |
|---|---|---|
| **Numeric (Min)** | `(Actual / Target) × 100` | Revenue targets, units sold — higher is better |
| **% (Min)** | `(Actual / Target) × 100` | CSAT scores, completion rates — higher is better |
| **Numeric (Max)** | `(Target / Actual) × 100` | Days taken, cost incurred — lower is better |
| **% (Max)** | `(Target / Actual) × 100` | Error rates, attrition — lower is better |
| **Zero-based** | `100 if Actual = 0, else 0` | Safety incidents, compliance violations — zero is perfect |
| **Timeline** | `100 if on time, else degrades proportionally` | Project milestones, deadline adherence |

**Score capping:** All scores are capped at **200%** to prevent outlier data from distorting reports.

**Score colour coding:**
- 🟢 ≥ 100% — On or above target (green)
- 🟡 75–99% — Approaching target (amber)
- 🔴 < 75% — Below target (red)

---

## 8. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| **UI Framework** | React 18 | Component model, hooks-based state, fast rendering |
| **Styling** | Inline styles + Google Fonts (DM Sans, DM Serif Display) | Zero build-time CSS dependencies, portable single file |
| **State Management** | React `useState` / `useEffect` | Sufficient for demo scope; easily migrated to Zustand or Redux |
| **Routing** | Tab-based (no React Router) | Simpler for single-page demo; production would use Next.js App Router |
| **Data Persistence** | In-memory (resets on refresh) | Demo only; production uses PostgreSQL via Prisma |
| **Production Backend** | Next.js 14 API Routes | Co-located frontend + API, zero extra infra |
| **Production Database** | PostgreSQL (Supabase free tier) | ACID transactions, row-level security, managed hosting |
| **ORM** | Prisma | Type-safe queries, schema migrations, audit log support |
| **Auth** | NextAuth.js + Azure AD / Entra ID | Credentials auth + SSO bonus, JWT session tokens |
| **Hosting** | Vercel (Hobby / free tier) | Serverless functions, global CDN, CI/CD from GitHub push |
| **Export** | Browser `Blob` + `URL.createObjectURL` | Lightweight CSV export, no server dependency |

**Estimated running cost:**
- Demo / Hackathon scale: **$0/month** (Vercel Hobby + Supabase Free)
- 1,000 employees in production: **~₹1,700/month** (Vercel Pro + Supabase Pro)

---

## 9. Project Structure

```
atomquest-portal/
│
├── public/
│   ├── index.html          # HTML shell
│   └── favicon.ico
│
├── src/
│   ├── App.jsx             # ← Entire application (single-file demo build)
│   └── index.js            # React DOM entry point
│
├── .env.example            # Environment variable template
├── package.json
├── README.md
└── vercel.json             # Vercel deployment config (optional)
```

### Inside `App.jsx` — Section Map

```
App.jsx
│
├── Design Tokens (T object)        # All colours, spacing, typography constants
├── GlobalStyle component           # Google Fonts import + CSS resets
├── Mock Data                       # INITIAL_USERS, CREDS, INITIAL_GOALS, AUDIT_INITIAL
├── Helpers                         # computeScore(), statusColor(), roleAccent()
├── Shared Style Objects            # card, iStyle, sStyle, sBox, sLbl, sVal
│
├── Atoms                           # Avatar, Tag, Btn, Field, EmptyState, Modal, WeightBar
│
├── LoginScreen                     # Split-panel login with credentials table
├── Shell                           # Top navigation bar + tab switcher
├── PageHeader                      # Reusable page title + actions row
├── GoalCard                        # Reusable goal display card
│
├── EmployeeGoals                   # My Goals tab (create, edit, submit)
├── EmployeeCheckins                # Check-ins tab (log actuals, view scores)
│
├── ManagerTeam                     # Team Dashboard (direct report overview)
├── ManagerApprovals                # Approvals tab (approve/reject with inline edit)
├── ManagerCheckins                 # Check-ins tab (view progress, post notes)
│
├── AdminOverview                   # Org overview + completion dashboard
├── AdminCycles                     # Check-in schedule timeline
├── AdminReports                    # Achievement report + CSV export
├── AdminAudit                      # Full audit trail
│
└── App (root)                      # Route rendering based on user.role + activeTab
```

---

## 10. Getting Started

### 10.1 Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** v18 or higher — [Download from nodejs.org](https://nodejs.org)
- **npm** v9 or higher (comes bundled with Node.js)
- A modern browser (Chrome, Firefox, Edge, Safari)

Check your versions:

```bash
node -v   # should print v18.x.x or higher
npm -v    # should print 9.x.x or higher
```

---

### 10.2 Installation

**Step 1 — Create a new React project**

```bash
npx create-react-app atomquest-portal
cd atomquest-portal
```

**Step 2 — Replace the default App file**

Delete `src/App.js` (the default file), then copy `AtomQuest_GoalPortal.jsx` into the `src/` folder and rename it:

```bash
# On Mac/Linux
rm src/App.js
cp /path/to/AtomQuest_GoalPortal.jsx src/App.js

# On Windows (Command Prompt)
del src\App.js
copy C:\path\to\AtomQuest_GoalPortal.jsx src\App.js
```

**Step 3 — Update the entry point**

Open `src/index.js` and make sure it looks like this:

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

No other changes are needed.

---

### 10.3 Running Locally

```bash
npm start
```

This starts the development server. Open your browser and go to:

```
http://localhost:3000
```

The app will hot-reload automatically as you make changes to `src/App.js`.

**To create a production build:**

```bash
npm run build
```

This generates an optimised static build in the `build/` folder, ready to deploy anywhere.

---

### 10.4 Deploying to Vercel

Vercel is the fastest way to get this online with a shareable URL.

**Option A — Deploy via Vercel CLI (recommended)**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Run the deploy wizard from your project folder
vercel
```

Follow the prompts. Vercel will detect the Create React App setup automatically and deploy in about 60 seconds. You'll receive a URL like:

```
https://atomquest-portal-xyz.vercel.app
```

**Option B — Deploy via GitHub (for automatic deployments)**

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/atomquest-portal.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and click **Add New Project**

3. Import your GitHub repository

4. Leave all settings as default — Vercel auto-detects Create React App

5. Click **Deploy**

Every subsequent `git push` to `main` will automatically trigger a new deployment.

---

## 11. Data Model

Below is the shape of the core data objects used throughout the application.

### User

```js
{
  id:         "emp1",                        // unique identifier
  name:       "Priya Sharma",                // display name
  role:       "employee",                    // "employee" | "manager" | "admin"
  managerId:  "mgr1",                        // null for managers and admins
  department: "Sales",
  email:      "priya.sharma@company.com"
}
```

### Goal

```js
{
  id:              "g1",
  employeeId:      "emp1",                   // owner
  thrustArea:      "Revenue Growth",         // one of 7 strategic pillars
  title:           "Achieve Q4 Sales Target",
  description:     "Drive sales revenue to ₹50L by end of FY",
  uom:             "Numeric (Min)",          // unit of measurement type
  target:          5000000,                  // numeric target value
  weightage:       40,                       // % weight in the goal sheet
  status:          "approved",               // "draft" | "pending" | "approved" | "rejected"
  sharedGoal:      false,                    // true = pushed from org/manager level
  achievements: {
    "Q1 (July)":      1200000,              // actual value logged by employee
    "Q2 (October)":   2600000
  },
  checkInStatuses: {
    "Q1 (July)":      "On Track",           // "Not Started" | "On Track" | "Completed"
    "Q2 (October)":   "On Track"
  },
  managerComments: {
    "Q1 (July)":      "Good progress!"      // manager's check-in note per quarter
  },
  createdAt:  "2025-05-03",
  lockedAt:   "2025-05-07"                  // set when manager approves
}
```

### Audit Log Entry

```js
{
  id:         1,
  action:     "Goal approved",              // human-readable event description
  goalId:     "g1",
  goalTitle:  "Achieve Q4 Sales Target",
  by:         "Vikram Nair",               // actor's display name
  role:       "manager",                   // actor's role
  timestamp:  "2025-05-07 10:23"
}
```

---

## 12. Component Architecture

```
App (root)
├── LoginScreen
│   └── Credentials panel (collapsible)
│
└── Shell (authenticated layout)
    ├── Topbar (logo, user info, sign out)
    ├── Tab bar (role-specific tabs)
    │
    ├── [Employee role]
    │   ├── EmployeeGoals
    │   │   ├── WeightBar
    │   │   ├── GoalCard (×N)
    │   │   └── Modal → Goal Form
    │   │       └── Field (×5)
    │   └── EmployeeCheckins
    │       ├── Quarter selector
    │       └── Check-in card (×N)
    │           └── Score display
    │
    ├── [Manager role]
    │   ├── ManagerTeam
    │   │   └── Employee card (×N)
    │   │       └── WeightBar
    │   ├── ManagerApprovals
    │   │   └── Approval card (×N)
    │   │       └── Inline editable fields
    │   └── ManagerCheckins
    │       └── Check-in card (×N)
    │           └── Comment field
    │
    └── [Admin role]
        ├── AdminOverview
        │   └── Completion table
        ├── AdminCycles
        │   └── Timeline cards
        ├── AdminReports
        │   └── Achievement table + CSV export
        └── AdminAudit
            └── Audit entry list
```

---

## 13. Check-in Schedule

The portal enforces the following BRD-mandated check-in windows:

| Phase | Opens | Purpose | Status |
|---|---|---|---|
| **Phase 1 — Goal Setting** | 1st May 2025 | Goal creation, submission & manager approval | ✓ Completed |
| **Q1 Check-in** | July 2025 | Log actuals vs. targets for Q1 | ● Active |
| **Q2 Check-in** | October 2025 | Log actuals vs. targets for Q2 | Upcoming |
| **Q3 Check-in** | January 2026 | Log actuals vs. targets for Q3 | Upcoming |
| **Q4 / Annual** | March/April 2026 | Final achievement capture & score lock | Upcoming |

Scores from all four quarters feed into the employee's annual performance rating. Only goals with `approved` status are eligible for check-ins.

---

## 14. BRD Compliance Checklist

| Requirement | Status | Notes |
|---|---|---|
| Goal creation with all BRD fields | ✅ | Thrust Area, UoM, Target, Weightage, Description |
| Weightage = 100% validation | ✅ | Real-time bar + submission gate |
| Minimum 10% per goal | ✅ | Enforced on save |
| Maximum 8 goals per employee | ✅ | Add button disabled at limit |
| Manager approval with inline edit | ✅ | Target and Weightage editable in approval card |
| Goal locking after approval | ✅ | No employee edits post-approval |
| Shared goals (org-level KPIs) | ✅ | Weightage-only editable by recipient |
| Quarterly achievement logging | ✅ | All 4 quarters supported |
| Status tracking per goal per quarter | ✅ | Not Started / On Track / Completed |
| Score computation — all 4 UoM types | ✅ | See Section 7 |
| Manager check-in notes | ✅ | Posted per goal per quarter, visible to employee |
| Check-in schedule enforcement | ✅ | Aligned to BRD windows |
| Achievement Report with CSV export | ✅ | Full planned vs. actual |
| Completion dashboard (real-time) | ✅ | Admin overview table |
| Audit trail with timestamps | ✅ | All state changes logged |
| Azure AD / Entra ID SSO (Bonus) | ✅ | Scaffolded via NextAuth.js |
| Analytics Module (Bonus §5.4) | 🟡 Partial | Score breakdown available; trend charts upcoming |

---

## 15. Known Limitations & Future Enhancements

### Current Limitations (Demo Scope)

- **No data persistence** — all state is in-memory and resets on page refresh. A production deployment would use PostgreSQL via Prisma.
- **No real authentication** — passwords are hardcoded. Production uses NextAuth.js with secure hashing and optional Azure AD SSO.
- **Single-level reporting hierarchy** — the demo supports one level of manager (L1 only). Multi-level hierarchies (L1 → L2 → L3) would require a recursive manager chain query.
- **No email notifications** — goal submission, approval, and check-in events do not trigger emails in the demo. Production would use a transactional email provider (e.g. Resend or SendGrid).
- **No mobile responsiveness** — the layout is optimised for desktop (≥ 1024px). A mobile-first responsive pass is planned.

### Planned Enhancements

- **Mid-year goal revision window** — allow one structured edit cycle per year with manager re-approval
- **Analytics dashboard** — quarter-over-quarter trend charts, department-level score aggregation, bell-curve visualisations
- **Bulk goal import** — CSV/Excel upload to seed goals for large teams
- **Shared goal cascade** — admin or manager pushes a goal to multiple employees simultaneously
- **Offline support** — Service Worker + IndexedDB for field employees with poor connectivity
- **Dark mode** — toggle between the current warm light theme and a dark theme
- **Two-factor authentication** — TOTP via authenticator app as a sign-in option

---

## 16. Contributing

This project was built for the AtomQuest Hackathon 1.0. If you'd like to extend or improve it:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add: your feature description"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a **Pull Request** against the `main` branch

Please make sure your changes:
- Do not break any of the BRD-required validation rules
- Follow the existing inline-style design token system (`T` object)
- Are tested against all three user roles before submitting

---

## 17. License

This project was created for the **AtomQuest Hackathon 1.0** internal competition and is intended for demonstration and evaluation purposes.

For questions, reach out to the development team at `hr.admin@company.com` or raise an issue in the repository.

---

*Built with React 18 · Hosted on Vercel · Fonts by Google Fonts (DM Sans, DM Serif Display)*

*AtomQuest Hackathon 1.0 — May 2025*
