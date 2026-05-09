<div align="center">

<img src="https://img.icons8.com/fluency/96/graduation-cap.png" width="80" alt="College ERP"/>

# 🎓 College ERP System — Frontend

### A Modern, Responsive & Role-Based UI for Academic Institution Management

<br/>

[![React](https://img.shields.io/badge/React-v19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-v1.13-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

<br/>

> *A production-ready frontend SPA that delivers a complete, role-aware college management experience — from student dashboards and exam results to faculty session planning and admin analytics, all wrapped in a responsive, dark-mode-ready UI.*

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Core Modules & Pages](#-core-modules--pages)
- [Routing Architecture](#-routing-architecture)
- [Component & UI System](#-component--ui-system)
- [State & Context Management](#-state--context-management)
- [API Integration](#-api-integration)
- [PDF Generation](#-pdf-generation)
- [Security & Access Control](#-security--access-control)
- [Theming & Styling](#-theming--styling)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the App](#-running-the-app)
- [Page Reference](#-page-reference)
- [Future Roadmap](#-future-roadmap)
- [Important Notes](#-important-notes)
- [License](#-license)

---

## 🌟 Overview

The **College ERP System Frontend** is a fully structured Single Page Application built with **React 19** and **Vite**, designed to provide an intuitive and role-specific interface for every user in a college institution.

It serves **three distinct user roles**, each with a dedicated dashboard, isolated routes, and a tailored set of UI screens:

<br/>

| 🛡️ Role | 📋 What They Can Do |
|---------|-------------------|
| **Admin** | Manage students, faculty, classes, fees, exams, results, notifications, events, and system feature flags |
| **Faculty** | Take and update attendance, enter exam marks, manage session plans, upload learning materials, view feedback |
| **Student** | View attendance, timetable, exam results, download hall tickets & fee receipts, submit feedback |

<br/>

Every protected route is guarded by a **ProtectedRoute** component that validates JWT role claims before rendering any page. Unauthorized access attempts are redirected to a dedicated error screen.

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | v19 | UI component library & rendering |
| **Vite** | v7 | Lightning-fast dev server & production bundler |
| **React Router DOM** | v7 | Client-side routing with nested & protected routes |
| **Tailwind CSS** | v3.4 | Utility-first CSS framework with dark mode support |
| **Axios** | v1.13 | HTTP client for all backend API communication |
| **React Hook Form** | v7.68 | Performant, flexible form state management |
| **Lucide React** | v0.554 | Consistent icon library throughout the UI |
| **jsPDF** | v4.2 | Client-side PDF generation for hall tickets & receipts |
| **html2canvas** | v1.4 | DOM-to-canvas capture for PDF rendering |
| **jwt-decode** | v4 | Decode JWT tokens for role extraction on the client |
| **PostCSS + Autoprefixer** | — | CSS processing pipeline for Tailwind |
| **ESLint** | v9 | Code quality linting with React-specific rules |

---

## 📁 Project Structure

```bash
frontend/
│
├── index.html                    # 🚀 SPA entry point — mounts the React root
├── vite.config.js                # Vite configuration (host, port, React plugin)
├── tailwind.config.js            # Tailwind setup with dark mode class strategy
├── eslint.config.js              # ESLint rules for React & hooks
├── package.json                  # Dependencies & npm scripts
├── .env                          # 🔒 Environment variables (never commit this)
│
└── src/
    │
    ├── main.jsx                  # React DOM root render
    ├── App.jsx                   # 🗺️ Router definition — all routes declared here
    ├── App.css                   # Global app-level CSS overrides
    ├── index.css                 # Tailwind base, components, utilities + CSS variables
    │
    ├── api/
    │   └── axios.js              # 🔌 Axios instance with base URL & credential config
    │
    ├── context/                  # 🧠 Global React Context providers
    │   ├── ThemeContext.jsx       # Dark / Light mode state & toggle
    │   ├── SidebarContext.jsx     # Sidebar open/collapsed state
    │   ├── ConfirmContext.jsx     # Global confirmation dialog state
    │   └── ToastContext.jsx       # Toast / snackbar notification system
    │
    ├── routes/
    │   └── ProtectedRoute.jsx    # 🔐 JWT-based route guard — validates role before render
    │
    ├── Components/               # 🧩 Shared layout components
    │   ├── NavbarDashboard.jsx   # Top navigation bar with user info & theme toggle
    │   ├── SideBarDashboard.jsx  # Collapsible role-aware sidebar navigation
    │   ├── MainPanelDashboard.jsx # Main content area wrapper
    │   ├── ConfirmDialog.jsx     # Reusable modal confirmation popup
    │   └── NotificationMessage.jsx # In-app toast/notification display component
    │
    ├── ui/                       # 🎨 Reusable UI primitives
    │   │
    │   ├── Buttons/              # Consistent, reusable button components
    │   │   ├── ActionButtonDashboard.jsx   # Primary action button for dashboards
    │   │   ├── ActivateDeactivateButton.jsx # Toggle button for user status
    │   │   ├── AddButton.jsx               # Styled add/create action button
    │   │   ├── CancelButton.jsx            # Form cancel action button
    │   │   ├── DeleteButton.jsx            # Destructive delete action button
    │   │   ├── EditButton.jsx              # Edit/pencil action button
    │   │   ├── EyeIconButton.jsx           # View/preview action button
    │   │   ├── NavigateBackButton.jsx      # Back navigation button
    │   │   ├── SaveButton.jsx              # Form save/submit button
    │   │   ├── SideBarButton.jsx           # Sidebar navigation item button
    │   │   ├── SideBarLogoutButton.jsx     # Sidebar logout button
    │   │   ├── ThemeButton.jsx             # Dark/Light mode toggle button
    │   │   └── ToggleButtonSettings.jsx    # Feature flag toggle button
    │   │
    │   ├── Cards/                # Card components for data display
    │   │   ├── ClassroomCard.jsx           # Classroom info display card
    │   │   ├── DashboardChildPageCard.jsx  # Child module card for dashboards
    │   │   └── EventCard.jsx              # Event listing card
    │   │
    │   └── Templates/            # Page layout template wrappers
    │       ├── ActionContainerDashboard.jsx    # Action toolbar container
    │       ├── DashboardChildPageTemplate.jsx  # Standard child page layout
    │       ├── DashContentPanelDashboard.jsx   # Dashboard content panel wrapper
    │       ├── ManageUserTemplateAdmin.jsx      # Admin manage-user page layout
    │       └── PanelTemplateDashboard.jsx      # Main panel template wrapper
    │
    ├── utils/                    # ⚙️ Utility functions
    │   ├── auth.js               # JWT decode + role extraction helpers
    │   └── pdfGenerator.js       # jsPDF + html2canvas PDF generation utilities
    │
    └── Pages/                    # 📄 All application pages (70+ screens)
        │
        ├── HomePage.jsx          # Public landing page
        ├── LoginPage.jsx         # Unified login for all roles
        ├── ForgotPassword.jsx    # Password reset request page
        ├── AboutUs.jsx           # About the institution page
        ├── KnowMore.jsx          # Feature overview public page
        ├── Dashboard.jsx         # Shared dashboard shell (sidebar + navbar + outlet)
        ├── Classroom.jsx         # Classroom listing page (shared across roles)
        ├── NotificationPage.jsx  # In-app notifications page
        ├── Events.jsx            # Events listing page
        ├── ViewTimeTable.jsx     # Timetable view page
        ├── Unauthorized.jsx      # 401 Unauthorized error page
        ├── PageNotFound.jsx      # 404 Not Found error page
        ├── NotAvailablePage.jsx  # Feature disabled / not available page
        │
        ├── Admin/                # 🛡️ Admin-only pages (30+ screens)
        │   └── ...               # See Page Reference section below
        │
        ├── Faculty/              # 👨‍🏫 Faculty-only pages (10 screens)
        │   └── ...               # See Page Reference section below
        │
        └── Student/              # 🎓 Student-only pages (9 screens)
            └── ...               # See Page Reference section below
```

---

## ✨ Core Modules & Pages

### 🔐 Authentication
- **Unified Login Page** — single login for Admin, Faculty, and Student, with role decoded from JWT
- **Forgot Password Page** — email-based reset flow connected to the backend Nodemailer service
- **ProtectedRoute** — wrapper that reads the JWT from cookie, decodes the role, and blocks unauthorized access
- **Change Credentials** — available to Faculty and Admin to update their own login details

---

### 🛡️ Admin Module
- **Admin Dashboard** — summary stats: total students, faculty, pending fees, recent activity
- **Student Management** — Add, Edit, Delete, and list all students with enrollment ID display
- **Faculty Management** — Add, Edit, Delete, and list all faculty with employee ID display
- **Class & Course Management** — Create courses, generate classes per semester, edit classrooms
- **Subject Management** — Add, Edit, Delete subjects; create marks components per subject
- **Timetable Management** — Manual creation and auto-generation with conflict detection; view and edit
- **Exam Management** — Schedule exams, create exam timetables, generate and publish results
- **Fee Management** — Create fee structures, record payments, view comprehensive fee status dashboard
- **Attendance Reports** — Date-wise, Class-wise, Overall class reports and per-student report views
- **Notifications** — Send, manage, edit, and delete notifications (broadcast or targeted)
- **Events** — Create, edit, delete, and view institutional events
- **Feedback Evaluation** — View and analyze student-submitted faculty feedback
- **Settings** — Toggle feature flags at runtime via the ManageSettings screen
- **Profile Management** — Admin can manage their own profile and upload a profile picture

---

### 👨‍🏫 Faculty Module
- **Faculty Dashboard** — today's schedule, pending attendance tasks, quick links
- **Take Attendance** — Mark students present/absent per class, per subject, per date
- **Update Attendance** — Correct previously submitted attendance records
- **Session Planning** — Create topic-wise lesson plans; mark topics as completed or pending
- **Update Session Plan** — Edit existing session plans with progress tracking
- **View Session Plan** — Review full session plan history per subject
- **Enter Exam Marks** — Submit student marks component-wise (Internal, External, Practical, Viva)
- **Upload Learning Materials** — Upload and manage study resources per subject
- **View Feedback** — Review student-submitted feedback ratings and comments
- **Attendance Reports** — Date-wise and class-wise attendance reports
- **Notifications** — Send and manage notifications for their class

---

### 🎓 Student Module
- **Student Dashboard** — attendance %, upcoming exams, recent results at a glance
- **View Timetable** — Visual weekly timetable for the student's class
- **View Attendance Report** — Detailed per-subject attendance breakdown with percentage
- **View Exam Result** — SGPA, CGPA, subject-wise marks, pass/fail status; backlog tracking
- **Generate Hall Ticket** — Download exam hall ticket as a PDF using jsPDF
- **Print Fee Receipt** — Download fee payment receipt as a PDF
- **Learning Materials** — Browse and download faculty-uploaded study resources by subject
- **Faculty Feedback** — Submit ratings and comments for faculty per subject
- **View Session Plan** — View faculty-uploaded lesson plans for reference
- **Manage Profile** — Update personal details and profile picture

---

## 🔄 Routing Architecture

All routes are declared centrally in `App.jsx` using `createBrowserRouter`. The structure uses **nested routes** so the `Dashboard` shell (sidebar + navbar) renders once while child pages swap in via `<Outlet />`.

```
  🌐 Public Routes
  ├── /                   → HomePage
  ├── /LoginPage          → LoginPage
  ├── /ForgotPassword     → ForgotPassword
  ├── /AboutUs            → AboutUs
  ├── /KnowMore           → KnowMore
  ├── /unauthorized       → Unauthorized
  └── *                   → PageNotFound

  🔐 Protected Routes (JWT + Role Guard)
  │
  ├── admin/Dashboard           ← ProtectedRoute (role: "Admin")
  │   ├── (index)               → AdminPanelDashboard
  │   ├── AddStudentAdmin       → AddStudentAdmin
  │   ├── ManageStudentAdmin    → ManageStudentAdmin
  │   ├── AddFacultyAdmin       → AddFacultyAdmin
  │   ├── ...                   → (30+ nested admin pages)
  │   └── ManageSettingsAdmin   → ManageSettingsAdmin
  │
  ├── faculty/dashboard         ← ProtectedRoute (role: "Faculty")
  │   ├── (index)               → FacultyPanelDashboard
  │   ├── TakeAttendanceFaculty → TakeAttendanceFaculty
  │   ├── SessionPlanningFaculty→ SessionPlanningFaculty
  │   └── ...                   → (10+ nested faculty pages)
  │
  └── student/dashboard         ← ProtectedRoute (role: "Student")
      ├── (index)               → StudentPanelDashboard
      ├── ViewAttendanceReport  → ViewAttendanceReportStudent
      ├── ViewExamResultStudent → ViewExamResultStudent
      └── ...                   → (9+ nested student pages)
```

---

## 🧩 Component & UI System

The project uses a layered component system for maximum reusability:

| Layer | What It Contains |
|-------|-----------------|
| **Layout Components** | `NavbarDashboard`, `SideBarDashboard`, `MainPanelDashboard` — the persistent shell |
| **Template Components** | `DashboardChildPageTemplate`, `PanelTemplateDashboard` — page layout wrappers with consistent padding and spacing |
| **UI Buttons** | 13 purpose-specific button components ensuring visual and behavioral consistency across all CRUD operations |
| **UI Cards** | `ClassroomCard`, `EventCard`, `DashboardChildPageCard` — structured data display cards |
| **Dialog Components** | `ConfirmDialog` — a globally-accessible modal triggered via `ConfirmContext` for destructive actions |
| **Notification Component** | `NotificationMessage` — renders toast/snackbar alerts triggered via `ToastContext` |

All interactive elements consistently follow the Tailwind CSS variable-based color system for automatic dark/light mode switching.

---

## 🧠 State & Context Management

Global state is managed entirely with React Context API — no external state library required:

| Context | File | Purpose |
|---------|------|---------|
| `ThemeContext` | `ThemeContext.jsx` | Stores and toggles dark/light mode; applies `dark` class to root |
| `SidebarContext` | `SidebarContext.jsx` | Tracks sidebar open/collapsed state across all dashboard pages |
| `ConfirmContext` | `ConfirmContext.jsx` | Provides a global `confirm()` function for triggering the confirmation modal |
| `ToastContext` | `ToastContext.jsx` | Provides a global `showToast()` function for rendering success/error messages |

All four providers are composed at the root level in `App.jsx`, wrapping the entire `RouterProvider`.

---

## 🔌 API Integration

All HTTP communication with the backend is handled through a **centralized Axios instance** configured in `src/api/axios.js`:

```javascript
// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,  // Required — sends HTTP-only cookie (JWT) with every request
});

export default api;
```

Key behaviors:
- `withCredentials: true` ensures the **HTTP-only JWT cookie** is automatically attached to every request, eliminating the need to manually manage tokens in JavaScript
- The `baseURL` is sourced from the `.env` file, keeping the API endpoint configurable per environment
- All page components import this instance rather than raw `axios`, ensuring consistent behavior

---

## 📄 PDF Generation

Two client-side PDF generation approaches are used, both handled by `src/utils/pdfGenerator.js`:

| Feature | Method | Library |
|---------|--------|---------|
| **Hall Tickets** | DOM capture → PDF | `html2canvas` + `jsPDF` |
| **Fee Receipts** | DOM capture → PDF | `html2canvas` + `jsPDF` |

The `pdfGenerator.js` utility renders the target DOM element to a canvas, converts it to an image, and embeds it into a jsPDF document for download — all without any server round-trip.

---

## 🛡 Security & Access Control

| 🔒 Feature | ⚙️ Implementation |
|------------|------------------|
| **Protected Routes** | `ProtectedRoute.jsx` decodes the JWT from the cookie and checks the `role` claim before rendering |
| **JWT Cookie Handling** | `withCredentials: true` on Axios — browser automatically sends the HTTP-only cookie; never stored in `localStorage` |
| **Role-Based Rendering** | Each role has its own dashboard root path; navigating to another role's path is blocked and redirected |
| **Unauthorized Page** | Any access violation redirects to `/unauthorized` with a clear error message |
| **404 Handling** | All unmatched routes fall through to the `PageNotFound` screen |
| **Feature Flag Awareness** | The `NotAvailablePage` gracefully handles disabled features without crashing |

---

## 🎨 Theming & Styling

The UI is built on **Tailwind CSS v3** with a custom CSS variable system for theming:

- **Dark mode** is implemented with Tailwind's `darkMode: "class"` strategy — toggled by adding/removing the `dark` class on the root element via `ThemeContext`
- **CSS custom properties** (e.g. `--bg-primary`, `--text-muted`, `--border-medium`) are defined in `index.css` for both light and dark themes, allowing components to use `bg-[var(--bg-primary)]` instead of hardcoded color classes
- **Lucide React** provides the icon system — consistent, tree-shakeable SVG icons across all screens
- **Responsive design** is built-in via Tailwind's breakpoint utilities, with the sidebar collapsing on smaller viewports via `SidebarContext`

---

## 🚀 Installation & Setup

### Prerequisites

Make sure the following are installed on your system:

- ✅ **Node.js** v18 or higher — [nodejs.org](https://nodejs.org/)
- ✅ **npm** v9 or higher *(bundled with Node.js)*
- ✅ **College ERP Backend** running at `http://localhost:5000` — see backend README

---

### Step 1 — Navigate to the Frontend Directory

```bash
cd college_ERP_system/frontend
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Configure Environment Variables

```bash
# Create your .env file
cp .env.example .env
```

> See the [Environment Variables](#-environment-variables) section below for all required fields.

### Step 4 — Start the Development Server

```bash
npm run dev
```

✅ The frontend will be live at: `http://localhost:5173`

---

## 🔧 Environment Variables

Create a `.env` file in the `frontend/` root directory:

```env
# ─── Backend API ───────────────────────────────────────────────
VITE_API_BASE_URL=http://localhost:5000/api
```

> ⚠️ **Vite Requirement:** All client-side environment variables **must** be prefixed with `VITE_` to be accessible in the browser bundle. Variables without this prefix are ignored.
>
> 🔒 **Security Rule:** Never put secrets (passwords, private keys) in frontend `.env` files — these are bundled into the client and visible to anyone who inspects the build.

---

## ▶️ Running the App

```bash
# Development mode with Hot Module Replacement (HMR)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview

# Run ESLint
npm run lint
```

**Verify the frontend is running:**

Open `http://localhost:5173` — you should see the College ERP landing page.

> ✅ Ensure the backend server is also running at `http://localhost:5000` for API calls to succeed.

---

## 📡 Page Reference

All pages live under `src/Pages/`. Protected pages require a valid JWT cookie with the appropriate role.

### 🌐 Public Pages

| Page | Path | Description |
|------|------|-------------|
| **HomePage** | `/` | Landing page with navigation to login and info pages |
| **LoginPage** | `/LoginPage` | Unified login for all roles |
| **ForgotPassword** | `/ForgotPassword` | Email-based password reset request |
| **AboutUs** | `/AboutUs` | Institution about page |
| **KnowMore** | `/KnowMore` | ERP feature overview page |
| **Unauthorized** | `/unauthorized` | 401 access denied error screen |
| **PageNotFound** | `*` | 404 not found error screen |

### 🛡️ Admin Pages (`admin/Dashboard/...`)

| Page | Sub-path | Description |
|------|----------|-------------|
| **AdminPanelDashboard** | *(index)* | Admin home with stats summary |
| **AddStudentAdmin** | `AddStudentAdmin` | Enroll a new student |
| **ManageStudentAdmin** | `ManageStudentAdmin` | List, search, activate/deactivate students |
| **EditStudentAdmin** | `EditStudentAdmin/:studentId` | Edit an existing student's details |
| **AddFacultyAdmin** | `AddFacultyAdmin` | Add a new faculty member |
| **ManageFacultyAdmin** | `ManageFacultyAdmin` | List, search, activate/deactivate faculty |
| **EditFacultyAdmin** | `EditFacultyAdmin/:facultyId` | Edit an existing faculty member |
| **AddCourseAdmin** | `AddCourseAdmin` | Create a new course |
| **AddClassAdmin** | `AddClassAdmin` | Generate semester-wise classes |
| **EditClassroomAdmin** | `EditClassroomAdmin/:id` | Edit an existing classroom |
| **AddSubjectAdmin** | `AddSubjectAdmin` | Add a new subject to a course |
| **ManageSubjectsAdmin** | `ManageSubjectsAdmin` | List and manage subjects |
| **EditSubjectAdmin** | `EditSubjectAdmin/:subject_id` | Edit an existing subject |
| **CreateSubjectComponentAdmin** | `CreateSubjectComponentAdmin` | Define marks components per subject |
| **AddTimeTableAdmin** | `AddTimeTableAdmin` | Create or auto-generate a timetable |
| **ViewTimetable** | `ViewTimetable` | View class timetable |
| **CreateExamAdmin** | `CreateExamAdmin` | Schedule a new exam |
| **AddExamTimeTableAdmin** | `AddExamTimeTableAdmin` | Create the exam timetable |
| **GenerateExamResultAdmin** | `GenerateExamResultAdmin` | Publish computed results (SGPA/CGPA) |
| **CreateFeeStructureAdmin** | `CreateFeeStructureAdmin` | Define fee structure per course/semester |
| **ViewFeeStructureAdmin** | `ViewFeeStructureAdmin` | View existing fee structures |
| **CheckFeeStatusAdmin** | `CheckFeeStatusAdmin` | Check and record fee payments |
| **PayFeeAdmin** | `PayFeeAdmin` | Process a student's fee payment |
| **SendNotificationAdmin** | `SendNotificationAdmin` | Broadcast or targeted notifications |
| **ManageNotificationsAdmin** | `ManageNotificationsAdmin` | List, edit, delete notifications |
| **EditNotificationAdmin** | `EditNotificationAdmin/:id` | Edit an existing notification |
| **CreateEventAdmin** | `CreateEventAdmin` | Create an institutional event |
| **EditEventAdmin** | `EditEventAdmin/:id` | Edit an existing event |
| **FeedbackEvaluationAdmin** | `FeedbackEvaluationAdmin` | Review student feedback on faculty |
| **DatewiseReportAdmin** | `DatewiseReportAdmin` | Attendance report by date |
| **ClasswiseReportAdmin** | `ClasswiseReportAdmin` | Attendance report by class |
| **OverallClassReportAdmin** | `OverallClassReportAdmin` | Combined attendance & academic overview |
| **StudentReportAdmin** | `StudentReportAdmin` | Individual student academic report |
| **ManageProfileAdmin** | `ManageProfileAdmin` | Admin profile management |
| **ManageSettingsAdmin** | `ManageSettingsAdmin` | Feature flag toggles |
| **EnterExamMarksFaculty** | `EnterExamMarksFaculty` | Admin can also enter marks |

### 👨‍🏫 Faculty Pages (`faculty/dashboard/...`)

| Page | Sub-path | Description |
|------|----------|-------------|
| **FacultyPanelDashboard** | *(index)* | Faculty home with quick-access links |
| **TakeAttendanceFaculty** | `TakeAttendanceFaculty` | Mark per-class attendance |
| **UpdateAttendanceFaculty** | `UpdateAttendanceFaculty` | Correct submitted attendance |
| **SessionPlanningFaculty** | `SessionPlanningFaculty` | Create new topic-wise session plans |
| **UpdateSessionPlanningFaculty** | `UpdateSessionPlanningFaculty` | Edit and update session plans |
| **ViewSessionPlanFaculty** | `ViewSessionPlanFaculty` | View full session plan history |
| **EnterExamMarksFaculty** | — *(via Admin route)* | Enter student marks component-wise |
| **UploadLearningMaterialFaculty** | `UploadLearningMaterialFaculty` | Upload study resources per subject |
| **ViewFeedbackFaculty** | `ViewFeedbackFaculty` | View student-submitted feedback |
| **ChangeCredentials** | `ChangeCredentials` | Update login credentials |
| **DatewiseReportAdmin** | `DatewiseReportAdmin` | View date-wise attendance reports |
| **ClasswiseReportAdmin** | `ClasswiseReportAdmin` | View class-wise attendance reports |

### 🎓 Student Pages (`student/dashboard/...`)

| Page | Sub-path | Description |
|------|----------|-------------|
| **StudentPanelDashboard** | *(index)* | Student home with key stats |
| **ViewAttendanceReportStudent** | `ViewAttendanceReportStudent` | Per-subject attendance with % |
| **ViewTimeTableStudent** | `ViewTimetable` | Weekly class timetable view |
| **ViewExamResultStudent** | `ViewExamResultStudent` | SGPA, CGPA, subject results |
| **GenerateHallTicketStudent** | `GenerateHallTicketStudent` | Download exam hall ticket as PDF |
| **PrintFeeReceiptStudent** | `PrintFeeReceiptStudent` | Download fee payment receipt as PDF |
| **LearningMaterialStudent** | `LearningMaterialStudent` | Browse & download study materials |
| **FacultyFeedbackStudent** | `FacultyFeedbackStudent` | Submit faculty rating & feedback |
| **ViewSessionPlanFaculty** | `ViewSessionPlanFaculty` | View faculty lesson plans |
| **ManageProfileStudent** | `ManageProfileStudent` | Update personal details & photo |
| **ChangeCredentials** | `ChangeCredentials` | Update login credentials |

---

## 🔮 Future Roadmap

| 🔧 Feature | 📋 Description |
|-----------|---------------|
| 📱 **Mobile App** | React Native or Flutter wrapper consuming the same REST API |
| 💬 **Real-time Chat** | Socket.io-powered messaging panel inside the dashboard |
| 🔔 **Push Notifications** | Browser push notifications for new results, events, and alerts |
| 📈 **Analytics Charts** | Recharts / Chart.js integration for visual academic performance insights |
| 🌐 **i18n Support** | Multi-language support via `react-i18next` |
| ♿ **Accessibility Audit** | Full WCAG 2.1 compliance pass with ARIA labels and keyboard navigation |
| 🧪 **Testing** | React Testing Library + Vitest for component and integration tests |
| 🐳 **Docker Support** | Nginx-served containerized build via `docker-compose` alongside the backend |
| 💳 **Payment Gateway UI** | Razorpay / Stripe payment flow for online fee collection |

---

## ⚠️ Important Notes

> 🔴 **Backend First** — Always ensure the backend server is running at `http://localhost:5000` before launching the frontend. API calls will fail silently or throw network errors otherwise.

> 🟡 **VITE_ Prefix Required** — Any environment variable the frontend code reads must be prefixed with `VITE_`. Variables without this prefix are stripped from the client bundle at build time.

> 🟠 **Secrets Stay Out** — Never put credentials, JWT secrets, or database passwords in the frontend `.env`. Frontend bundles are public; only safe, non-sensitive values belong here.

> 🟢 **HTTP-only Cookies** — The app deliberately avoids storing the JWT in `localStorage` or `sessionStorage`. The backend sets the token as an HTTP-only cookie, and Axios sends it automatically via `withCredentials: true`. Do not attempt to access or manage the token in JavaScript.

> 🔵 **Lazy Loading** — Every page component is imported with `React.lazy()` and wrapped in `<Suspense>`, so only the code for the current page loads initially. This keeps the initial bundle small and improves load performance.

> 🟣 **Dark Mode** — The theme is persisted via `ThemeContext` and applies the `dark` CSS class to the document root. All Tailwind classes and custom CSS variables automatically adapt. No extra configuration is needed per component.

---

## 📄 License

This project is licensed under the **ISC License**.
It was developed for **educational and academic purposes**.

---

<div align="center">

**Made with ❤️ for smarter college administration**

⭐ *If this project helped you, please give it a star on GitHub!*

</div>