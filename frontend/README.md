# 🎓 College ERP System (Frontend)

A fully modular and scalable **College ERP (Enterprise Resource Planning) System** designed to streamline academic and administrative processes in educational institutions.

Built with a **modern React architecture**, this project focuses on clean UI, reusable components, and role-based workflows.

---

## 🌟 Key Highlights

- 🔐 Role-Based Authentication System (Admin / Faculty / Student)
- 🧩 Component-Based Scalable Architecture
- ⚡ Fast Development using Vite
- 🎨 Clean UI with reusable design system
- 🔄 Dynamic data handling with API layer abstraction
- 📱 Responsive design (desktop-first)

---

## 🚀 Core Features (Detailed)

### 👨‍💼 Admin Dashboard
- ➤ Manage Students (Add / Update / Delete)
- ➤ Manage Faculty Records
- ➤ Course & Subject Management
- ➤ Timetable Scheduling System
- ➤ Assign subjects to faculty
- ➤ Centralized control over entire ERP

---

### 👨‍🏫 Faculty Dashboard
- ➤ View assigned subjects and classes
- ➤ Session Planning Module
- ➤ Attendance Management System
- ➤ Track class schedules
- ➤ Manage academic activities efficiently

---

### 👨‍🎓 Student Dashboard
- ➤ View personal profile
- ➤ Check attendance records
- ➤ Access academic results
- ➤ View timetable and subject details

---

## 🧠 Advanced Functional Features

- 🔒 **Protected Routing**
  - Prevents unauthorized access
  - Role-based route rendering

- 🌐 **API Layer Separation**
  - All backend calls handled in `/api`
  - Clean separation of logic & UI

- 🧩 **Reusable UI System**
  - Buttons, Cards, Templates
  - Consistent design across application

- 📦 **Context-Based State Management**
  - Global state handled using React Context API
  - Separate contexts for theme and sidebar

- ⚡ **Lazy Loading**
  - Improves performance
  - Loads components only when needed

- 🧭 **Dynamic Navigation**
  - Sidebar adapts based on user role

---

## 🛠️ Tech Stack

| Category            | Technology Used |
|--------------------|----------------|
| Frontend Framework | React (Vite)   |
| Styling            | Tailwind CSS   |
| Routing            | React Router DOM |
| State Management   | Context API    |
| API Handling       | Axios          |
| Form Handling      | React Hook Form |
| Icons              | Lucide React   |

---

## 📁 Folder Structure Explained

### 🔹 `/api`
- Handles all API calls
- Central place for backend communication

### 🔹 `/Components`
- Reusable components used across multiple pages

### 🔹 `/Pages`
- Main application screens divided by roles:
  - Admin
  - Faculty
  - Student

### 🔹 `/context`
- Global state management
- Theme & sidebar control

### 🔹 `/routes`
- Route definitions
- Protected routes logic

### 🔹 `/ui`
Reusable UI design system:
- Buttons → Common button components
- Cards → Layout cards
- Templates → Page layouts

### 🔹 `/utils`
- Helper functions
- Common logic utilities

### 🔹 `/assets`
- Images, icons, static files

---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/Dhwanitkhatri/college_ERP_system.git
cd your-repo-name
npm install
npm run dev
