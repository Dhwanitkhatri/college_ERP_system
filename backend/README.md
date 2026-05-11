<div align="center">

<img src="https://img.icons8.com/fluency/96/graduation-cap.png" width="80" alt="College ERP"/>

# 🎓 College ERP System — Backend

### A Robust, Secure & Scalable REST API for Academic Institution Management

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-v6-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

<br/>

> *A production-ready backend API that powers a complete college management ecosystem — handling everything from student enrollment and exam results to fee payments, session planning, and real-time notifications, all under a strict role-based access system.*

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Core Modules](#-core-modules)
- [Database Models](#-database-models)
- [API Request Flow](#-api-request-flow)
- [Security Features](#-security-features)
- [Middleware Stack](#️-middleware-stack)
- [Services Layer](#-services-layer)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Server](#-running-the-server)
- [API Modules Reference](#-api-modules-reference)
- [Future Roadmap](#-future-roadmap)
- [Important Notes](#-important-notes)
- [License](#-license)

---

## 🌟 Overview

The **College ERP System Backend** is a fully structured REST API built with **Node.js** and **Express.js**, designed to automate and digitize every major process in a college institution.

It serves **three distinct user roles**, each with isolated access and a dedicated set of operations:

<br/>

| 🛡️ Role | 📋 Responsibilities |
|---------|-------------------|
| **Admin** | Manages students, faculty, classes, fees, exams, results, notifications, and system settings |
| **Faculty** | Takes attendance, enters marks, creates session plans, uploads learning materials |
| **Student** | Views attendance, results, timetable, downloads hall tickets and fee receipts |

<br/>

Every API call passes through **authentication middleware**, **role guards**, **rate limiters**, and **feature flag checks** before reaching the business logic layer — ensuring a secure and extensible architecture.

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v18+ | JavaScript runtime |
| **Express.js** | v5.1 | Web framework & routing |
| **Sequelize ORM** | v6 | Database abstraction & model management |
| **MySQL** | v8.0+ | Relational database |
| **JSON Web Tokens** | v9 | Stateless authentication via HTTP-only cookies |
| **bcrypt** | v6 | Secure password hashing |
| **Multer** | v2 | File upload handling (profile pics, materials) |
| **PDFKit** | v0.17 | Server-side PDF generation for fee receipts |
| **Nodemailer** | v8 | Password reset email delivery |
| **Helmet** | v8 | HTTP security headers |
| **express-rate-limit** | v8 | API rate limiting & brute-force protection |
| **Zod** | v4 | Runtime input schema validation |
| **Morgan** | v1.10 | HTTP request logging |
| **dotenv** | v17 | Environment variable management |
| **compression** | v1.8 | Gzip response compression |
| **uuid** | v13 | Unique ID generation |
| **Sequelize CLI** | v6.6 | Database migrations management |
| **Nodemon** | v3 | Development auto-reload |

---

## 📁 Project Structure

```bash
backend/
│
├── app.js                        # 🚀 Entry point — boots server, registers all routes & middleware
├── package.json                  # Dependencies & scripts
├── .sequelizerc                  # Sequelize CLI path configuration
├── .env                          # 🔒 Environment variables (never commit this)
│
├── database/
│   └── College_ERP_System.sql           # 🗃️ Full database dump — import directly into MySQL
│
├── uploads/                      # 📂 Static file storage
│   └── learning-materials/       # Faculty-uploaded study resources
│
└── src/
    │
    ├── config/
    │   ├── db.js                 # Sequelize instance + DB connection boot
    │   └── config.cjs            # Sequelize CLI environment config (dev/prod)
    │
    ├── middleware/
    │   ├── authMiddleware.js     # 🔐 JWT verification + role-based guards
    │   ├── featureFlagMiddleware.js # 🚩 Dynamic feature toggle enforcement
    │   ├── profileUpload.js      # 📸 Multer configuration for profile pictures
    │   ├── rateLimiter.js        # 🚦 Request rate limiting per IP
    │   └── responseTimeLogger.js # ⏱️ Logs response times for performance monitoring
    │
    ├── model/                    # 🗃️ Sequelize model definitions (32 models)
    │   ├── index.js              # Model loader + all association definitions
    │   ├── User.js               # Base user account model
    │   ├── Role.js               # Role definitions (Admin/Faculty/Student)
    │   ├── Admin.js
    │   ├── Faculty.js
    │   ├── Student.js
    │   ├── Department.js
    │   ├── Course.js
    │   ├── Class.js
    │   ├── Subject.js
    │   ├── SubjectComponent.js   # Marks components (Internal, External, etc.)
    │   ├── Timetable.js
    │   ├── Attendance.js
    │   ├── Exam.js
    │   ├── ExamTimetable.js
    │   ├── StudentMarks.js
    │   ├── Result.js
    │   ├── SemesterResult.js     # SGPA / CGPA records
    │   ├── SubjectResult.js
    │   ├── Backlog.js
    │   ├── BacklogAttempts.js
    │   ├── FeeStructure.js
    │   ├── StudentFees.js
    │   ├── FeePayment.js
    │   ├── Notification.js
    │   ├── Event.js
    │   ├── Feedback.js
    │   ├── SessionPlanning.js
    │   ├── LearningMaterial.js
    │   ├── FeatureFlag.js
    │   ├── StudentPersonalDetails.js
    │   └── EmployeePersonalDetails.js
    │
    ├── migrations/               # 📜 Sequelize migration files (32 migrations)
    │   ├── 20240101T000000-create-roles.cjs
    │   ├── 20240101T000100-create-users.cjs
    │   ├── 20240101T000200-create-departments.cjs
    │   ├── ... (28 more migrations)
    │   └── 20240101T100000-add-associations.cjs
    │
    ├── controllers/              # 🧠 Business logic for every module
    │   ├── authControllers.js
    │   ├── studentController.js
    │   ├── facultyController.js
    │   ├── attendanceController.js
    │   ├── classController.js
    │   ├── subjectControllers.js
    │   ├── subjectComponentController.js
    │   ├── timetableController.js
    │   ├── sessionPlanningController.js
    │   ├── examController.js
    │   ├── examTimetableController.js
    │   ├── marksController.js
    │   ├── resultController.js
    │   ├── studentResultController.js
    │   ├── backlogController.js
    │   ├── feeStatusController.js
    │   ├── printFeeController.js
    │   ├── notificationController.js
    │   ├── eventControllers.js
    │   ├── feedbackController.js
    │   ├── learningMaterialController.js
    │   ├── hallticketController.js
    │   ├── rankingcontroller.js
    │   ├── studentReportController.js
    │   ├── profilePictureController.js
    │   ├── dashboardController.js
    │   ├── featureFlagController.js
    │   └── passwordResetController.js
    │
    ├── routes/                   # 🛣️ Express route definitions (one file per module)
    │   ├── authRoutes.js
    │   ├── studentRoutes.js
    │   ├── facultyRoutes.js
    │   ├── attendanceRoutes.js
    │   ├── classRoutes.js
    │   ├── subjectRoutes.js
    │   ├── subjectComponentRoutes.js
    │   ├── timetableRoutes.js
    │   ├── sessionPlanningRoutes.js
    │   ├── examRoutes.js
    │   ├── examTimetableRoutes.js
    │   ├── marksRoutes.js
    │   ├── resultRoutes.js
    │   ├── studentResultRoutes.js
    │   ├── backlogRoutes.js
    │   ├── feeStatusRoutes.js
    │   ├── printFeeRoutes.js
    │   ├── notificationRoutes.js
    │   ├── eventsRouts.js
    │   ├── feedbackRoutes.js
    │   ├── learningMaterialRoutes.js
    │   ├── hallticketRoutes.js
    │   ├── rankingRoutes.js
    │   ├── studentReportRoutes.js
    │   ├── profilePictureRoutes.js
    │   ├── dashboardRoutes.js
    │   ├── featureFlagRoutes.js
    │   └── passwordResetRoutes.js
    │
    └── services/                 # ⚙️ Reusable business logic utilities
        ├── academicYear.js
        ├── assignStudentFeesService.js
        ├── generateClasses.js
        ├── generateEnrollmentId.js
        ├── generateFacultyId.js
        ├── generateTimeTable.js
        └── sendEmail.js
```

---

## ✨ Core Modules

### 🔐 Authentication & Authorization
- **JWT Authentication** stored in **HTTP-only cookies** (XSS-resistant)
- Unified login for all three roles with role payload encoded inside the token
- **Forgot Password** flow — sends a secure, time-limited reset link via email
- **Account Activation/Deactivation** — Admin can lock any user account instantly
- Role guards at the middleware level (`authMiddleware` + `adminMiddleware`)

---

### 👤 Student Management
- Add new students with auto-generated **Enrollment IDs**
- Full CRUD — Create, Read, Update, Delete student records
- Manage **Student Personal Details** as a separate linked profile
- Generate detailed **Student Reports** (academic + attendance combined)
- Profile picture upload and management via Multer

---

### 👨‍🏫 Faculty Management
- Add faculty members with auto-generated **Faculty IDs**
- Full CRUD on faculty records with department and course linkage
- Manage **Employee Personal Details** as a separate linked profile
- Profile picture upload and management

---

### ✅ Attendance Management
- Faculty marks attendance per class, per subject, per date
- Update/correct previously submitted attendance records
- Generate **Class-wise**, **Date-wise**, and **Student-wise** attendance reports
- Attendance percentage calculation with low-attendance flagging

---

### 📅 Timetable Management
- Manual timetable creation per class and semester
- **Auto-generation service** — conflict-free timetable scheduling across faculty and rooms
- Lecture conflict detection before timetable finalization
- Faculty and Student timetable views

---

### 📝 Session Planning
- Faculty creates topic-wise **Session Plans** (lesson plans) per subject
- Track teaching progress — mark topics as Completed or Pending
- View full session plan history per subject

---

### 🎓 Examination & Results
- Admin schedules **Exams** and creates **Exam Timetables**
- Faculty enters **Student Marks** component-wise (Internal, External, Practical, Viva)
- Admin **generates results** — SGPA, CGPA, pass/fail calculated automatically
- **Backlog Management** — tracks pending subjects and re-attempt history
- Auto-generate **Hall Tickets** as downloadable PDFs
- **Student Rankings** — class and subject level leaderboards

---

### 💰 Fee Management
- Admin creates **Fee Structures** per course, per semester (multiple fee heads)
- Bulk **assign fee structures** to students using the fee assignment service
- Record and track **Fee Payments** per student with payment mode
- Generate and **print Fee Receipts** as PDFs (server-side via PDFKit)
- View comprehensive **Fee Status Dashboard** — paid, pending, partial

---

### 📚 Learning Materials
- Faculty uploads study materials (PDFs, images) per subject
- Files stored in `uploads/learning-materials/` and served as static assets
- Students can browse and download resources by subject

---

### 🔔 Notifications
- Admin sends notifications — broadcast to all, by role, or to a specific class
- Full CRUD on notifications (edit and delete old ones)
- Students and Faculty view their relevant notifications in-app

---

### 💬 Feedback System
- Students submit **Faculty Feedback** per subject — rating + comments
- Faculty can view their own feedback summary
- Admin reviews all feedback for performance evaluation

---

### 📊 Dashboard & Analytics
- **Admin Dashboard** — total students, faculty, classes, pending fees, recent activity
- **Faculty Dashboard** — today's classes, attendance summary, pending marks
- **Student Dashboard** — attendance %, upcoming exams, recent results

---

### 🚩 Feature Flags
- Admin can **enable or disable features** at runtime without redeployment
- Enforced by `featureFlagMiddleware` on applicable routes
- Useful for rolling out features gradually or disabling during maintenance

---

## 🗃 Database Models

The system uses **32 database tables** with full relational integrity managed by Sequelize ORM.

```
┌─────────────────────────────────────────────────────────────────┐
│                    32 DATABASE MODELS AT A GLANCE               │
├──────────────────┬──────────────────┬───────────────────────────┤
│  IDENTITY        │  ACADEMIC        │  FINANCIAL & MISC         │
├──────────────────┼──────────────────┼───────────────────────────┤
│  Users           │  Courses         │  FeeStructures            │
│  Roles           │  Departments     │  StudentFees              │
│  Admins          │  Classes         │  FeePayments              │
│  Faculties       │  Subjects        │  Notifications            │
│  Students        │  SubjectComponents│  Events                  │
│  StudentPersonal │  Timetables      │  Feedback                 │
│  EmployeePersonal│  Attendance      │  SessionPlannings         │
│                  │  Exams           │  LearningMaterials        │
│                  │  ExamTimetables  │  FeatureFlags             │
│                  │  StudentMarks    │                           │
│                  │  Results         │                           │
│                  │  SemesterResults │                           │
│                  │  SubjectResults  │                           │
│                  │  Backlogs        │                           │
│                  │  BacklogAttempts │                           │
└──────────────────┴──────────────────┴───────────────────────────┘
```

All associations (one-to-many, many-to-many, has-one, belongs-to) are defined centrally in `src/model/index.js` and applied via the `add-associations` migration.

---

## 🔄 API Request Flow

Every incoming API request travels through the following pipeline:

```
  📲 Client Request
        │
        ▼
  ┌─────────────────────┐
  │   Express Router    │  ← Matches the correct route handler
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │   Rate Limiter      │  ← Blocks excessive requests per IP
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  Auth Middleware    │  ← Verifies JWT from HTTP-only cookie
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  Role Middleware    │  ← Checks Admin / Faculty access rights
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  Feature Flag Check │  ← Confirms feature is currently enabled
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │    Controller       │  ← Validates input (Zod), runs business logic
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │     Services        │  ← Reusable logic (ID gen, email, timetable)
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │  Sequelize Models   │  ← Executes parameterized SQL query on MySQL
  └──────────┬──────────┘
             │
             ▼
  📤 JSON Response (+ Response Time Logged)
```

---

## 🛡 Security Features

| 🔒 Feature | ⚙️ Implementation |
|------------|------------------|
| **Password Hashing** | bcrypt with configurable salt rounds |
| **Token Storage** | HTTP-only cookies — inaccessible to JavaScript (XSS-safe) |
| **CORS Policy** | Restricted to the configured frontend origin only |
| **API Rate Limiting** | `express-rate-limit` on all `/api/*` routes |
| **HTTP Security Headers** | `helmet` — sets CSP, HSTS, X-Frame-Options, and more |
| **Input Validation** | `zod` schema validation in every controller |
| **SQL Injection Prevention** | Sequelize ORM uses fully parameterized queries |
| **Role Enforcement** | Middleware-level guards on every sensitive endpoint |
| **Feature Flags** | Admin can disable any feature without touching code |
| **Environment Secrets** | All credentials stored in `.env`, never in source code |

---

## 🏗️ Middleware Stack

| Middleware | File | Purpose |
|------------|------|---------|
| `authMiddleware` | `authMiddleware.js` | Validates JWT token from HTTP-only cookie |
| `adminMiddleware` | `authMiddleware.js` | Restricts access to Admin-only routes |
| `featureFlagMiddleware` | `featureFlagMiddleware.js` | Checks if a feature flag is active before proceeding |
| `profileUpload` | `profileUpload.js` | Multer config — handles profile picture uploads with file type filtering |
| `apiLimiter` | `rateLimiter.js` | Limits requests per IP on all `/api/*` routes to prevent abuse |
| `responseTimeLogger` | `responseTimeLogger.js` | Logs request method, path, and response time on every request |

---

## ⚙️ Services Layer

Reusable, testable utility services decoupled from controllers:

| Service File | What It Does |
|-------------|-------------|
| `academicYear.js` | Calculates and returns the current academic year string |
| `assignStudentFeesService.js` | Bulk-assigns a fee structure to all students in a class |
| `generateClasses.js` | Auto-generates semester-wise class records for a new course |
| `generateEnrollmentId.js` | Generates unique, formatted student enrollment IDs |
| `generateFacultyId.js` | Generates unique, formatted faculty employee IDs |
| `generateTimeTable.js` | Conflict-free timetable scheduling algorithm across subjects and faculty |
| `sendEmail.js` | Nodemailer wrapper — sends templated emails for password resets |

---

## 🚀 Installation & Setup

### Prerequisites

Make sure the following are installed on your system:

- ✅ **Node.js** v18 or higher — [nodejs.org](https://nodejs.org/)
- ✅ **npm** v9 or higher *(bundled with Node.js)*
- ✅ **MySQL** v8.0 or higher — [mysql.com](https://www.mysql.com/downloads/)
- ✅ **Git** — [git-scm.com](https://git-scm.com/)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/college_ERP_system.git
cd college_ERP_system/backend
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Configure Environment Variables

```bash
cp .env.example .env
# Fill in your DB credentials, JWT secret, and email settings
```

> See the [Environment Variables](#-environment-variables) section below for all required fields.

### Step 4 — Set Up the Database

> 💡 You have **two options** — pick whichever suits you:

**✅ Option A — Import SQL File (Recommended · Fastest)**

No migration steps needed. One command sets up all 32 tables instantly.

```bash
# 1. Create the database
mysql -u root -p -e "CREATE DATABASE college_erp_db;"

# 2. Import the SQL dump
mysql -u root -p college_erp_db < database/college_erp.sql
```

**⚙️ Option B — Run Sequelize Migrations (For Developers)**

Use this if you want version-controlled, incremental schema management.

```bash
# 1. Create the database
mysql -u root -p -e "CREATE DATABASE college_erp_db;"

# 2. Run all migrations
npx sequelize-cli db:migrate
```

### Step 5 — Start the Server

```bash
# Development (with auto-reload)
npx nodemon app.js

# Production
node app.js
```

✅ The API server will be live at: `http://localhost:5000`

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` root directory:

```env
# ─── Server ────────────────────────────────────────────────────
PORT=5000
SERVER_IP=localhost            # IP or hostname of your server

# ─── MySQL Database ────────────────────────────────────────────
DB_HOST=localhost
DB_PORT=3306
DB_NAME=college_erp_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DIALECT=mysql

# ─── Authentication ─────────────────────────────────────────────
JWT_SECRET=your_super_strong_secret_key_here
JWT_EXPIRES_IN=1d

# ─── Email (Nodemailer) ─────────────────────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password   # Use App Password, NOT account password
EMAIL_FROM="College ERP <your_email@gmail.com>"

# ─── Frontend ───────────────────────────────────────────────────
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Security Rule:** Never commit your `.env` file. It is already listed in `.gitignore`.
>
> 💡 **Gmail Tip:** Use a [Gmail App Password](https://myaccount.google.com/apppasswords) — not your regular login password — for Nodemailer to work.

---

## 🗄 Database Setup

### ✅ Option A — SQL Import (Recommended)

The `database/college_erp.sql` file is a **complete database dump** containing all 32 table schemas, constraints, indexes, and foreign keys. Importing it is the fastest way to get the database ready.

```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE college_erp_db;"

# Import the full schema
mysql -u root -p college_erp_db < database/college_erp.sql

# Verify tables were created
mysql -u root -p -e "USE college_erp_db; SHOW TABLES;"
```

---

### ⚙️ Option B — Sequelize Migrations

```bash
# Run all pending migrations
npx sequelize-cli db:migrate

# Undo the most recent migration
npx sequelize-cli db:migrate:undo

# Undo ALL migrations (full reset)
npx sequelize-cli db:migrate:undo:all

# Run seeders (if available)
npx sequelize-cli db:seed:all

# Undo all seeders
npx sequelize-cli db:seed:undo:all

# Check migration status
npx sequelize-cli db:migrate:status
```

---

## ▶️ Running the Server

```bash
# Development mode with auto-reload on file changes
npx nodemon app.js

# Standard production start
node app.js
```

**Verify the server is running:**

```
✅ Database connected successfully!
✅ Server is running on port 5000
```

Open `http://localhost:5000` — you should see:
> `College ERP System Backend is running`

---

## 📡 API Modules Reference

All API routes are prefixed with `/api`. Protected routes require a valid JWT in the `token` HTTP-only cookie.

| Module | Base Route | Operations |
|--------|-----------|------------|
| **Authentication** | `/api/auth` | Login, Logout |
| **Password Reset** | `/reset-password` | Request reset, Confirm reset |
| **Dashboard** | `/api/dashboard` | Get stats summary |
| **Students** | `/api/students` | Full CRUD + profile |
| **Faculties** | `/api/faculties` | Full CRUD + profile |
| **Classes** | `/api/classes` | Create, List, Edit, Delete |
| **Subjects** | `/api/subjects` | Full CRUD |
| **Subject Components** | `/api/components` | Create marks components per subject |
| **Timetables** | `/api/timetables` | Create, Auto-generate, View, Edit |
| **Attendance** | `/api/attendance` | Mark, Update, Reports |
| **Session Planning** | `/api/session` | Create, Update, View plans |
| **Exams** | `/api/exams` | Schedule, Edit, Delete |
| **Exam Timetable** | `/api/exam-timetable` | Create, View |
| **Marks** | `/api/marks` | Enter, Update student marks |
| **Results** | `/api/results` | Generate exam results |
| **Student Results** | `/api/student-results` | View results (student-facing) |
| **Backlogs** | `/api/backlogs` | Track & manage backlogs |
| **Fee Management** | `/api/fee` | Fee structure, assignment, status |
| **Fee Receipts** | `/api/fee-receipts` | Generate & print PDF receipts |
| **Notifications** | `/api/notifications` | Send, Edit, Delete, View |
| **Events** | `/api/event` | Create, Edit, Delete, View |
| **Feedback** | `/api/feedback` | Submit & view faculty feedback |
| **Learning Materials** | `/api/learning-materials` | Upload, List, Delete |
| **Hall Tickets** | `/api/hall-tickets` | Generate hall ticket data |
| **Rankings** | `/api/rankings` | Class & subject leaderboards |
| **Reports** | `/api/reports` | Class-wise, Date-wise, Student-wise |
| **Profile Pictures** | `/api/profile` | Upload & retrieve photos |
| **Feature Flags** | `/api/feature` | View & toggle features |

---

## 🔮 Future Roadmap

| 🔧 Feature | 📋 Description |
|-----------|---------------|
| 🤖 **AI Timetable Generator** | ML-based conflict-free scheduling considering faculty preferences |
| 📱 **Mobile App Support** | React Native or Flutter app consuming existing APIs |
| 💬 **Real-time Chat** | Socket.io-powered messaging between faculty and students |
| 🖥️ **Online Examination Module** | Timed online tests with auto-evaluation |
| 💳 **Payment Gateway Integration** | Razorpay / Stripe for online fee collection |
| 📈 **Advanced Analytics Dashboard** | Charts and insights on academic performance trends |
| 🧪 **Unit & Integration Testing** | Jest + Supertest for full API test coverage |
| 🐳 **Docker Support** | Containerized deployment with `docker-compose` |

---

## ⚠️ Important Notes

> 🔴 **Database First** — Always ensure your MySQL server is running before starting the backend. The app will crash on boot if the DB connection fails.

> 🟡 **SQL File vs Migrations** — If you used Option A (SQL import), do **not** also run `db:migrate`. Pick one method only to avoid schema conflicts.

> 🟠 **Secrets Stay Local** — Never push your `.env` file or any credentials to GitHub. Double-check your `.gitignore` before every commit.

> 🟢 **Environment Matters** — Set `NODE_ENV=production` in production deployments to disable debug logs and enable security-hardened defaults.

> 🔵 **CORS Configuration** — The `SERVER_IP` in `.env` must match the host where the frontend is served, otherwise all API calls will be blocked.

---

## 📄 License

This project is licensed under the **ISC License**.
It was developed for **educational and academic purposes**.

---

<div align="center">

**Made with ❤️ for smarter college administration**

⭐ *If this project helped you, please give it a star on GitHub!*

</div>