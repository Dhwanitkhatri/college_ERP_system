<div align="center">

<img src="https://img.icons8.com/fluency/96/graduation-cap.png" width="90" alt="College ERP"/>

# 🎓 College ERP System

### Enterprise Resource Planning System for Modern Academic Institutions

<br/>

[![React](https://img.shields.io/badge/React-v19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-v7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Sequelize](https://img.shields.io/badge/Sequelize-v6-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

<br/>

> *A complete, production-ready full-stack ERP platform that digitizes and automates every academic and administrative operation of a college — from student enrollment to result generation, fee payments to hall tickets — all under a secure, role-based system.*

<br/>

**🏫 Sardar Vallabhbhai Global University**

</div>

---

## 📑 Table of Contents

- [What is this Project?](#-what-is-this-project)
- [System Highlights](#-system-highlights)
- [Full System Architecture](#-full-system-architecture)
- [Who Uses This System?](#-who-uses-this-system)
- [Module Overview](#-module-overview)
- [Role vs Feature Matrix](#-role-vs-feature-matrix)
- [Repository Structure](#-repository-structure)
- [Quick Start](#-quick-start)
- [Detailed Documentation](#-detailed-documentation)
- [Default Credentials](#-default-credentials)
- [Meet the Team](#-meet-the-team)
- [License](#-license)

---

## 🌟 What is this Project?

The **College ERP System** is a full-stack web application built to replace manual, paper-based college management with a unified digital platform. Every operation — from marking attendance to printing hall tickets — happens inside one system.

It is built as a **monorepo** with two independent, well-structured applications:

| | Application | Technology | Purpose |
|-|-------------|-----------|---------|
| ⚙️ | **Backend** | Node.js + Express + MySQL | REST API, business logic, database, security |
| 🖥️ | **Frontend** | React 19 + Vite + Tailwind CSS | Role-based UI, dashboards, PDF generation |

The two applications communicate entirely through REST APIs, with JWT authentication stored in HTTP-only cookies for maximum security.

---

## ✨ System Highlights

<br/>

```
  🔐 Secure               📊 Complete              🚀 Fast
  ──────────────          ─────────────────        ─────────────────
  JWT + HTTP-only         32 database tables       React 19 + Vite 7
  cookies (XSS-safe)      across 15+ modules       with lazy loading

  🎨 Responsive           📄 PDF Ready             🚩 Flexible
  ──────────────          ─────────────────        ─────────────────
  Tailwind + dark mode    Hall tickets &            Admin-controlled
  on every screen         fee receipts as PDF       feature flags
```

<br/>

- **3 Roles** — Admin, Faculty, Student — each with fully isolated dashboards and routes
- **15+ Academic Modules** — attendance, timetable, exams, results, backlogs, fee, feedback, and more
- **32 Database Tables** — fully relational schema with Sequelize ORM migrations
- **PDF Generation** — hall tickets (client-side) and fee receipts (server-side)
- **Auto-Generation Services** — enrollment IDs, faculty IDs, class timetables, exam results
- **Security-First** — bcrypt, helmet, rate limiting, Zod validation, CORS, parameterized queries
- **Dark / Light Mode** — full theme support across every screen
- **Feature Flags** — Admin toggles features on/off at runtime without redeployment

---

## 🏗 Full System Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║                    COLLEGE ERP SYSTEM                            ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║   ┌─────────────────────────────────────────────────────────┐   ║
║   │               FRONTEND  (React 19 + Vite)               │   ║
║   │                                                          │   ║
║   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   ║
║   │  │    ADMIN    │  │   FACULTY   │  │    STUDENT      │  │   ║
║   │  │   PANEL     │  │    PANEL    │  │     PANEL       │  │   ║
║   │  │  30+ pages  │  │  10+ pages  │  │   9+ pages      │  │   ║
║   │  └─────────────┘  └─────────────┘  └─────────────────┘  │   ║
║   │                                                          │   ║
║   │   Protected Routes │ Context API │ Axios │ jsPDF         │   ║
║   └───────────────────────────┬──────────────────────────────┘   ║
║                               │  HTTPS + HTTP-only JWT Cookie    ║
║   ┌───────────────────────────▼──────────────────────────────┐   ║
║   │               BACKEND  (Node.js + Express.js)            │   ║
║   │                                                          │   ║
║   │   Helmet │ CORS │ Rate Limiter │ Morgan │ Compression     │   ║
║   │                                                          │   ║
║   │   ┌─────────────────────────────────────────────────┐   │   ║
║   │   │  Auth MW → Role MW → Feature Flag MW → Zod      │   │   ║
║   │   └────────────────────────┬────────────────────────┘   │   ║
║   │                            │                            │   ║
║   │   ┌────────────┐  ┌────────▼────────┐  ┌────────────┐  │   ║
║   │   │  Routes    │→ │  Controllers    │→ │  Services  │  │   ║
║   │   │ (28 files) │  │  (27 files)     │  │ (7 utils)  │  │   ║
║   │   └────────────┘  └─────────────────┘  └────────────┘  │   ║
║   │                                                          │   ║
║   │   Multer (uploads) │ PDFKit (receipts) │ Nodemailer      │   ║
║   └───────────────────────────┬──────────────────────────────┘   ║
║                               │  Sequelize ORM                   ║
║   ┌───────────────────────────▼──────────────────────────────┐   ║
║   │                   MySQL DATABASE                          │   ║
║   │                  32 Tables / Models                       │   ║
║   │   Identity │ Academic │ Exams │ Results │ Fee │ Misc      │   ║
║   └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 👥 Who Uses This System?

| 🛡️ Admin | 👨‍🏫 Faculty | 🎓 Student |
|---------|-----------|---------|
| The super-user of the entire system | Subject-level academic manager | Read-access to personal academic data |
| Manages students, faculty, classes, courses, subjects | Takes & updates attendance daily | Views attendance, timetable, results |
| Creates fee structures & collects payments | Creates topic-wise session plans | Downloads hall tickets as PDF |
| Schedules exams & publishes results | Enters exam marks per component | Prints fee receipts as PDF |
| Sends broadcast or targeted notifications | Uploads learning resources for students | Browses learning materials by subject |
| Evaluates student feedback on faculty | Views their own student feedback | Submits ratings and comments for faculty |
| Toggles feature flags at runtime | Views date-wise and class-wise reports | Tracks backlog subjects & attempts |
| Generates class & student reports | Changes login credentials securely | Manages personal profile & photo |

---

## 📦 Module Overview

| # | Module | Admin | Faculty | Student |
|---|--------|:-----:|:-------:|:-------:|
| 1 | 🔐 **Authentication & Password Reset** | ✅ | ✅ | ✅ |
| 2 | 👤 **Student Management** | ✅ | — | — |
| 3 | 👨‍🏫 **Faculty Management** | ✅ | — | — |
| 4 | 🏫 **Class & Course Management** | ✅ | — | — |
| 5 | 📚 **Subject & Components Management** | ✅ | — | — |
| 6 | 📅 **Timetable (Manual + Auto-Generate)** | ✅ | 👁️ View | 👁️ View |
| 7 | ✅ **Attendance (Mark / Update / Report)** | 📊 Reports | ✅ Mark | 👁️ Own |
| 8 | 📝 **Session Planning** | — | ✅ | 👁️ View |
| 9 | 🎓 **Exam Scheduling & Timetable** | ✅ | — | — |
| 10 | 📊 **Marks Entry & Result Generation** | ✅ Generate | ✅ Enter | 👁️ View |
| 11 | 🏆 **Rankings & Backlogs** | ✅ | — | 👁️ View |
| 12 | 🎟️ **Hall Ticket (PDF)** | — | — | ✅ |
| 13 | 💰 **Fee Structure & Payment** | ✅ | — | — |
| 14 | 🧾 **Fee Receipt (PDF)** | ✅ | — | ✅ |
| 15 | 🔔 **Notifications** | ✅ Send | 👁️ View | 👁️ View |
| 16 | 🎉 **Events** | ✅ Manage | 👁️ View | 👁️ View |
| 17 | 💬 **Faculty Feedback** | 📊 Evaluate | 👁️ View | ✅ Submit |
| 18 | 📂 **Learning Materials** | — | ✅ Upload | 👁️ View |
| 19 | 📈 **Reports & Analytics** | ✅ | 📊 Class | — |
| 20 | 🚩 **Feature Flags** | ✅ Toggle | — | — |

---

## 📁 Repository Structure

```bash
college_ERP_system/
│
├── 📂 frontend/                  # React 19 + Vite frontend application
│   ├── src/
│   │   ├── api/                  # Axios instance
│   │   ├── context/              # ThemeContext, SidebarContext, ToastContext, ConfirmContext
│   │   ├── routes/               # ProtectedRoute component
│   │   ├── Components/           # Shared layout (Navbar, Sidebar, Panels)
│   │   ├── ui/                   # Button, Card, Template UI primitives
│   │   ├── Pages/                # 70+ screens (Admin / Faculty / Student / Public)
│   │   └── utils/                # auth.js, pdfGenerator.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── 📄 README.md              # ← Detailed Frontend Documentation
│
├── 📂 backend/                   # Node.js + Express REST API
│   ├── src/
│   │   ├── config/               # DB connection + Sequelize CLI config
│   │   ├── middleware/           # Auth, RateLimiter, FeatureFlag, Upload, Logger
│   │   ├── model/                # 32 Sequelize models + associations
│   │   ├── migrations/           # 32 versioned DB migration files
│   │   ├── controllers/          # 27 controller files (business logic)
│   │   ├── routes/               # 28 route files (one per module)
│   │   └── services/             # 7 reusable utility services
│   ├── uploads/                  # Stored uploaded files
│   ├── app.js                    # Server entry point
│   └── 📄 README.md              # ← Detailed Backend Documentation
│
├── 📄 README.md                  # ← You are here (Project Overview)
└── .gitignore
```

---

## ⚡ Quick Start

> **Prerequisites:** Node.js v18+, MySQL 8.0+, npm v9+, Git

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/college_ERP_system.git
cd college_ERP_system
```

### Step 2 — Start the Backend

```bash
cd backend
npm install
cp .env.example .env          # Fill in your DB, JWT, and Email credentials
mysql -u root -p -e "CREATE DATABASE college_erp_db;"
npx sequelize-cli db:migrate
npx nodemon app.js            # Starts at http://localhost:5000
```

### Step 3 — Start the Frontend

```bash
cd ../frontend
npm install
cp .env.example .env          # Set VITE_API_BASE_URL=http://localhost:5000/api
npm run dev                   # Starts at http://localhost:5173
```

### Step 4 — Open the App

```
🌐  http://localhost:5173
```

> ✅ Ensure both servers are running. The frontend will call the backend at port `5000`.

---

## 📖 Detailed Documentation

For in-depth technical documentation of each part of the system, refer to the dedicated READMEs inside each folder:

| Documentation | Location | Covers |
|---------------|----------|--------|
| 📄 **Backend README** | [`backend/README.md`](./backend/README.md) | Node.js API, all 27 controllers, 32 models, 28 routes, middleware stack, services layer, DB commands, env variables, API reference table |
| 📄 **Frontend README** | [`frontend/README.md`](./frontend/README.md) | React 19 pages (70+), routing architecture, context system, component/UI library, PDF generation, Axios setup, all screen references, Tailwind theming |

---

## 🔑 Default Credentials

> Use these to log in after running migrations. **Change passwords immediately in any real deployment.**

| Role | Username | Password | Portal Path |
|------|----------|----------|-------------|
| 🛡️ **Admin** | `admin` | `admin@123` | `/admin/Dashboard` |
| 👨‍🏫 **Faculty** | `FAC001` | `faculty@123` | `/faculty/dashboard` |
| 🎓 **Student** | `STU001` | `student@123` | `/student/dashboard` |

---

## 👨‍💻 Meet the Team

This project was built as part of academic coursework at **Sardar Vallabhbhai Global University**.

<br/>

<div align="center">

| 👤 | Name | Role |
|:--:|------|------|
| 🧑‍💻 | **Dhwanit Khatri** | Full Stack Developer |
| 🧑‍💻 | **Aayush Bhavsar** | Full Stack Developer |
| 🧑‍💻 | **Yug Panchal** | Full Stack Developer |
| 🧑‍💻 | **Jiken Patel** | Full Stack Developer |

<br/>

**🏫 Sardar Vallabhbhai Global University, Surat, Gujarat**

</div>

---

## 📄 License

This project is licensed under the **ISC License** and was developed for **educational and academic purposes** at Sardar Vallabhbhai Global University.

---

<div align="center">

Built with ❤️ by the SVGU Team

⭐ *Found this useful? Give it a star on GitHub!*

</div>