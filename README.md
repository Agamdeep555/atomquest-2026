# ⚡ AtomQuest Goal Setting & Tracking Portal

A modern web-based performance management system built for **AtomQuest Hackathon 1.0** to streamline employee goal setting, approvals, quarterly check-ins, reporting, and audit governance.

---

## 🌐 Live Demo

### 🔗 Demo URL

[https://atomquest-2026-chi.vercel.app](https://atomquest-2026-chi.vercel.app)

### 🔗 GitHub Repository

[https://github.com/Agamdeep555/atomquest-2026](https://github.com/Agamdeep555/atomquest-2026)

---

# 📌 Overview

The **AtomQuest Goal Setting & Tracking Portal** is a complete goal lifecycle management platform designed to eliminate fragmented spreadsheets, email-based tracking, and manual review cycles.

The platform enables:

* Goal creation & approval workflows
* Quarterly performance tracking
* Automated progress calculations
* Audit logging & governance
* Real-time dashboards & reporting
* Role-based access management

The system is designed with a scalable, cloud-native, and cost-optimized architecture using modern web technologies.

---

# 🚀 Features

## ✅ Phase 1 — Goal Creation & Approval

* Employee goal creation workflow
* Thrust Area & Goal Definition
* Multiple UoM support:

  * Numeric
  * Percentage
  * Timeline
  * Zero-based
* Goal weightage assignment
* Validation rule enforcement
* Manager approval workflow
* Inline goal editing during approval
* Goal locking after approval
* Shared department goals support

---

## ✅ Phase 2 — Achievement Tracking & Check-ins

* Quarterly achievement updates
* Planned vs Actual tracking
* Status updates:

  * Not Started
  * On Track
  * Completed
* Automated score calculations
* Manager check-in comments
* Team visibility dashboards
* Check-in schedule enforcement

---

## ✅ Reporting & Governance

* Achievement Report generation
* CSV export support
* Completion dashboards
* Audit trail logging
* Real-time tracking
* Organization-wide visibility

---

# 👥 User Roles

| Role         | Responsibilities                                    |
| ------------ | --------------------------------------------------- |
| Employee     | Create goals, submit goals, update achievements     |
| Manager (L1) | Review, approve, edit, and monitor team goals       |
| Admin / HR   | Governance, reporting, audit logs, cycle management |

---

# 🔐 Demo Credentials

| Role                       | User ID | Password |
| -------------------------- | ------- | -------- |
| Employee — Priya Sharma    | emp1    | emp123   |
| Employee — Arjun Mehta     | emp2    | emp123   |
| Employee — Neha Patel      | emp3    | emp123   |
| Manager (L1) — Vikram Nair | mgr1    | mgr123   |
| Manager (L1) — Sunita Rao  | mgr2    | mgr123   |
| Admin / HR                 | admin   | admin123 |

---

# 🧠 Validation Rules Implemented

| Rule                        | Implementation                   |
| --------------------------- | -------------------------------- |
| Total weightage = 100%      | Checked during submission        |
| Minimum 10% per goal        | Validated on save                |
| Maximum 8 goals             | Add Goal disabled after limit    |
| Goal locking after approval | Editing restricted post approval |
| Shared goal restrictions    | Title & target locked            |

---

# 🏗️ Architecture Overview

## Frontend

* React 18
* Next.js 14
* Tailwind CSS
* Role-based routing
* Responsive dashboards
* PWA-ready UI

## Backend

* Next.js API Routes
* Node.js Runtime
* REST APIs
* Serverless Functions

## Database

* PostgreSQL
* Supabase Managed Database
* Prisma ORM

## Authentication

* NextAuth.js
* JWT Session Tokens
* Credentials Authentication
* Microsoft Entra ID / Azure AD SSO

## Reporting

* Achievement Reports
* CSV Export
* Audit Logging
* Completion Dashboard

## Hosting

* Vercel
* Supabase Cloud
* GitHub CI/CD

---

# ⚙️ Technology Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Frontend       | React 18, Next.js 14, Tailwind CSS |
| Backend        | Next.js API Routes, Node.js        |
| Database       | PostgreSQL via Supabase            |
| ORM            | Prisma                             |
| Authentication | NextAuth.js + Azure AD             |
| Hosting        | Vercel                             |
| Reporting      | csv-writer                         |

---

# 🔄 Core Workflow

```text
Employee
   ↓
Goal Creation
   ↓
Validation Engine
   ↓
Manager Approval
   ↓
Goal Locking
   ↓
Quarterly Check-ins
   ↓
Score Calculation
   ↓
Achievement Reports
   ↓
Audit Logging
```

---

# 📊 Implemented Modules

## Employee Module

* Goal creation
* Goal submission
* Quarterly updates
* Progress tracking

## Manager Module

* Goal approvals
* Inline editing
* Team dashboards
* Check-in comments

## Admin / HR Module

* Completion monitoring
* Audit logs
* Reports & exports
* Cycle management

---

# 📈 Score Calculation Logic

| UoM Type               | Formula                     |
| ---------------------- | --------------------------- |
| Min (Higher is better) | Achievement ÷ Target        |
| Max (Lower is better)  | Target ÷ Achievement        |
| Timeline               | Completion Date vs Deadline |
| Zero-based             | If 0 → 100%, else 0%        |

---

# ☁️ Cloud Infrastructure

The platform uses a cost-optimized cloud-native architecture:

* Vercel for frontend & serverless APIs
* Supabase for PostgreSQL database hosting
* Prisma ORM with connection pooling
* Global CDN support
* Zero idle infrastructure cost

Estimated Cost:

* Hackathon Scale: ~$0/month
* Production Scale (1000 employees): ~$20/month

---

# 🔒 Security Features

* JWT-based authentication
* Role-based authorization
* Secure session handling
* Audit trail logging
* Row-level security support
* Protected API routes

---

# 📁 Project Structure

```bash
src/
 ├── app/
 ├── components/
 ├── lib/
 ├── prisma/
 ├── api/
 ├── auth/
 ├── dashboard/
 └── utils/
```

---

# 🚀 Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/Agamdeep555/atomquest-2026.git
```

## 2. Navigate to Project

```bash
cd atomquest-2026
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## 5. Run Development Server

```bash
npm run dev
```

---

# 📌 BRD Compliance Status

| Requirement               | Status        |
| ------------------------- | ------------- |
| Goal Creation             | ✅ Implemented |
| Goal Validation Rules     | ✅ Implemented |
| Manager Approval Workflow | ✅ Implemented |
| Goal Locking              | ✅ Implemented |
| Shared Goals              | ✅ Implemented |
| Quarterly Check-ins       | ✅ Implemented |
| Score Computation         | ✅ Implemented |
| Manager Comments          | ✅ Implemented |
| Audit Trail               | ✅ Implemented |
| Achievement Reports       | ✅ Implemented |
| Azure AD Integration      | ✅ Integrated  |
| Analytics Dashboard       | ⚠️ Partial    |

---

# 🎯 Key Highlights

* Enterprise-style architecture
* Fully role-based system
* Scalable cloud-native deployment
* Cost-optimized infrastructure
* Production-ready authentication
* Real-time reporting dashboards
* Modular and maintainable codebase
* Serverless deployment model

---

# 🏆 Hackathon Submission

Built for:

## ⚡ AtomQuest Hackathon 1.0

Team Project — Goal Setting & Tracking Portal

---

# 📜 License

This project was developed for hackathon demonstration and educational purposes.
