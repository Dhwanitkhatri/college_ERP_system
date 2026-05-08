import { lazy, Suspense } from "react";

import NavbarDashboard from "./Components/NavbarDashboard";
import SideBarDashboard from "./Components/SideBarDashboard";
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import "./index.css";
import { ConfirmProvider } from "./context/ConfirmContext";
import { ToastProvider } from "./context/ToastContext";

// Public Pages
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const HomePage = lazy(() => import("./Pages/HomePage"));
const KnowMore = lazy(() => import("./Pages/KnowMore"));
const AboutUs = lazy(() => import("./Pages/AboutUs"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const Unauthorized = lazy(() => import("./Pages/Unauthorized"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound"));

// Dashboard & Common Pages
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Classroom = lazy(() => import("./Pages/Classroom"));
const NotificationPage = lazy(() => import("./Pages/NotificationPage"));
const Events = lazy(() => import("./Pages/Events"));
const NotAvailablePage = lazy(() => import("./Pages/NotAvailablePage"));

// Admin Pages
const AdminPanelDashboard = lazy(
  () => import("./Pages/Admin/AdminPanelDashboard"),
);
const AddFacultyAdmin = lazy(() => import("./Pages/Admin/AddFacultyAdmin"));
const AddStudentAdmin = lazy(() => import("./Pages/Admin/AddStudentAdmin"));
const AddSubjectAdmin = lazy(() => import("./Pages/Admin/AddSubjectAdmin"));
const AddCourseAdmin = lazy(() => import("./Pages/Admin/AddCourseAdmin"));
const AddClassAdmin = lazy(() => import("./Pages/Admin/AddClassAdmin"));
const AddTimeTableAdmin = lazy(() => import("./Pages/Admin/AddTimeTableAdmin"));
const ManageFacultyAdmin = lazy(
  () => import("./Pages/Admin/ManageFacultyAdmin"),
);
const ManageStudentAdmin = lazy(
  () => import("./Pages/Admin/ManageStudentAdmin"),
);
const SendNotificationAdmin = lazy(
  () => import("./Pages/Admin/SendNotificationAdmin"),
);
const ManageProfileAdmin = lazy(
  () => import("./Pages/Admin/ManageProfileAdmin"),
);
const ManageSettingsAdmin = lazy(
  () => import("./Pages/Admin/ManageSettingsAdmin"),
);
const StudentReportAdmin = lazy(
  () => import("./Pages/Admin/StudentReportAdmin"),
);
const DatewiseReportAdmin = lazy(
  () => import("./Pages/Admin/DatewiseReportAdmin"),
);
const ClasswiseReportAdmin = lazy(
  () => import("./Pages/Admin/ClasswiseReportAdmin"),
);
const CheckFeeStatusAdmin = lazy(
  () => import("./Pages/Admin/CheckFeeStatusAdmin"),
);
const OverallClassReportAdmin = lazy(
  () => import("./Pages/Admin/OverallClassReportAdmin"),
);
const EditFacultyAdmin = lazy(() => import("./Pages/Admin/EditFacultyAdmin"));
const CreateFeeStructureAdmin = lazy(
  () => import("./Pages/Admin/CreateFeeStructureAdmin"),
);
const CreateEventAdmin = lazy(() => import("./Pages/Admin/CreateEventAdmin"));
const PayFeeAdmin = lazy(() => import("./Pages/Admin/PayFeeAdmin"));
const EditClassroomAdmin = lazy(
  () => import("./Pages/Admin/EditClassroomAdmin"),
);
const EditStudentAdmin = lazy(() => import("./Pages/Admin/EditStudentAdmin"));
const ViewTimetable = lazy(() => import("./Pages/ViewTimeTable"));
const EditEventAdmin = lazy(() => import("./Pages/Admin/EditEventAdmin"));
const ManageNotificationsAdmin = lazy(
  () => import("./Pages/Admin/ManageNotificationsAdmin"),
);
const EditNotificationAdmin = lazy(
  () => import("./Pages/Admin/EditNotificationAdmin"),
);
const FeedbackEvaluationAdmin = lazy(
  () => import("./Pages/Admin/FeedbackEvaluationAdmin"),
);
const ManageSubjectsAdmin = lazy(
  () => import("./Pages/Admin/ManageSubjectsAdmin"),
);
const EditSubjectAdmin = lazy(() => import("./Pages/Admin/EditSubjectAdmin"));
const CreateSubjectComponentAdmin = lazy(
  () => import("./Pages/Admin/CreateSubjectComponentAdmin"),
);
const CreateExamAdmin = lazy(() => import("./Pages/Admin/CreateExamAdmin"));
const AddExamTimeTableAdmin = lazy(
  () => import("./Pages/Admin/AddExamTimeTableAdmin"),
);
const GenerateExamResultAdmin = lazy(
  () => import("./Pages/Admin/GenerateExamResultAdmin"),
);
const ViewFeeStructureAdmin = lazy(
  () => import("./Pages/Admin/ViewFeeStructureAdmin"),
);

// Faculty Pages
const FacultyPanelDashboard = lazy(
  () => import("./Pages/Faculty/FacultyPanelDashboard"),
);
const TakeAttendanceFaculty = lazy(
  () => import("./Pages/Faculty/TakeAttendanceFaculty"),
);
const SessionPlanningFaculty = lazy(
  () => import("./Pages/Faculty/SessionPlanningFaculty"),
);
const ChangeCredentials = lazy(
  () => import("./Pages/Faculty/ChangeCredentials"),
);
const UpdateAttendanceFaculty = lazy(
  () => import("./Pages/Faculty/UpdateAttendanceFaculty"),
);
const ViewFeedbackFaculty = lazy(
  () => import("./Pages/Faculty/ViewFeedbackFaculty"),
);
const EnterExamMarksFaculty = lazy(
  () => import("./Pages/Faculty/EnterExamMarksFaculty"),
);
const UploadLearningMaterialFaculty = lazy(
  () => import("./Pages/Faculty/UploadLearningMaterialFaculty"),
);
const UpdateSessionPlanningFaculty = lazy(
  () => import("./Pages/Faculty/UpdateSessionPlanningFaculty"),
);
const ViewSessionPlanFaculty = lazy(
  () => import("./Pages/Faculty/ViewSessionPlanFaculty"),
);

// Student Pages
const StudentPanelDashboard = lazy(
  () => import("./Pages/Student/StudentPanelDashboard"),
);
const FacultyFeedbackStudent = lazy(
  () => import("./Pages/Student/FacultyFeedbackStudent"),
);
const ViewTimeTableStudent = lazy(
  () => import("./Pages/Student/ViewTimeTableStudent"),
);
const ViewAttendanceReportStudent = lazy(
  () => import("./Pages/Student/ViewAttendanceReportStudent"),
);
const LearningMaterialStudent = lazy(
  () => import("./Pages/Student/LearningMaterialStudent"),
);
const GenerateHallTicketStudent = lazy(
  () => import("./Pages/Student/GenerateHallTicketStudent"),
);
const ViewExamResultStudent = lazy(
  () => import("./Pages/Student/ViewExamResultStudent"),
);
const PrintFeeReceiptStudent = lazy(
  () => import("./Pages/Student/PrintFeeReceiptStudent"),
);
const ManageProfileStudent = lazy(
  () => import("./Pages/Student/ManageProfileStudent"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "admin/Dashboard",
    element: (
      <ProtectedRoute allowedRole="Admin">
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminPanelDashboard />,
      },
      {
        path: "AddFacultyAdmin",
        element: <AddFacultyAdmin />,
      },
      {
        path: "AddStudentAdmin",
        element: <AddStudentAdmin />,
      },
      {
        path: "AddSubjectAdmin",
        element: <AddSubjectAdmin />,
      },
      {
        path: "AddCourseAdmin",
        element: <AddCourseAdmin />,
      },
      {
        path: "AddClassAdmin",
        element: <AddClassAdmin />,
      },
      {
        path: "AddTimeTableAdmin",
        element: <AddTimeTableAdmin />,
      },
      {
        path: "ManageFacultyAdmin",
        element: <ManageFacultyAdmin />,
      },
      {
        path: "ManageStudentAdmin",
        element: <ManageStudentAdmin />,
      },
      {
        path: "SendNotificationAdmin",
        element: <SendNotificationAdmin />,
      },
      {
        path: "ManageProfileAdmin",
        element: <ManageProfileAdmin />,
      },
      {
        path: "ManageSettingsAdmin",
        element: <ManageSettingsAdmin />,
      },
      {
        path: "StudentReportAdmin",
        element: <StudentReportAdmin />,
      },
      {
        path: "Classroom",
        element: <Classroom />,
      },
      {
        path: "Events",
        element: <Events />,
      },
      {
        path: "notifications",
        element: <NotificationPage />,
      },
      {
        path: "DatewiseReportAdmin",
        element: <DatewiseReportAdmin />,
      },
      {
        path: "ClasswiseReportAdmin",
        element: <ClasswiseReportAdmin />,
      },
      {
        path: "CheckFeeStatusAdmin",
        element: <CheckFeeStatusAdmin />,
      },
      {
        path: "OverallClassReportAdmin",
        element: <OverallClassReportAdmin />,
      },
      {
        path: "EditFacultyAdmin/:facultyId",
        element: <EditFacultyAdmin />,
      },
      {
        path: "NotAvailablePage",
        element: <NotAvailablePage />,
      },
      {
        path: "CreateFeeStructureAdmin",
        element: <CreateFeeStructureAdmin />,
      },
      {
        path: "CreateEventAdmin",
        element: <CreateEventAdmin />,
      },
      {
        path: "PayFeeAdmin",
        element: <PayFeeAdmin />,
      },
      {
        path: "EditClassroomAdmin/:id",
        element: <EditClassroomAdmin />,
      },
      {
        path: "EditStudentAdmin/:studentId",
        element: <EditStudentAdmin />,
      },
      {
        path: "ViewTimetable",
        element: <ViewTimetable />,
      },
      {
        path: "EditEventAdmin/:id",
        element: <EditEventAdmin />,
      },
      {
        path: "ManageNotificationsAdmin",
        element: <ManageNotificationsAdmin />,
      },
      {
        path: "EditNotificationAdmin/:id",
        element: <EditNotificationAdmin />,
      },
      {
        path: "ChangeCredentials",
        element: <ChangeCredentials />,
      },
      {
        path: "FeedbackEvaluationAdmin",
        element: <FeedbackEvaluationAdmin />,
      },
      {
        path: "ManageSubjectsAdmin",
        element: <ManageSubjectsAdmin />,
      },
      {
        path: "EditSubjectAdmin/:subject_id",
        element: <EditSubjectAdmin />,
      },
      {
        path: "CreateSubjectComponentAdmin",
        element: <CreateSubjectComponentAdmin />,
      },
      {
        path: "CreateExamAdmin",
        element: <CreateExamAdmin />,
      },
      {
        path: "AddExamTimeTableAdmin",
        element: <AddExamTimeTableAdmin />,
      },
      {
        path: "GenerateExamResultAdmin",
        element: <GenerateExamResultAdmin />,
      },
      {
        path: "EnterExamMarksFaculty",
        element: <EnterExamMarksFaculty />,
      },
      {
        path: "NotificationPage",
        element: <NotificationPage />,
      },
      {
        path: "ViewFeeStructureAdmin",
        element: <ViewFeeStructureAdmin />,
      },
    ],
  },
  {
    path: "faculty/dashboard",
    element: (
      <ProtectedRoute allowedRole="Faculty">
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <FacultyPanelDashboard />,
      },
      {
        path: "notifications",
        element: <NotificationPage />,
      },
      {
        path: "Classroom",
        element: <Classroom />,
      },
      {
        path: "TakeAttendanceFaculty",
        element: <TakeAttendanceFaculty />,
      },
      {
        path: "SessionPlanningFaculty",
        element: <SessionPlanningFaculty />,
      },
      {
        path: "SendNotification",
        element: <SendNotificationAdmin />,
      },
      {
        path: "ManageProfileAdmin",
        element: <ManageProfileAdmin />,
      },
      {
        path: "Events",
        element: <Events />,
      },
      {
        path: "NotAvailablePage",
        element: <NotAvailablePage />,
      },
      {
        path: "DatewiseReportAdmin",
        element: <DatewiseReportAdmin />,
      },
      {
        path: "ClasswiseReportAdmin",
        element: <ClasswiseReportAdmin />,
      },
      {
        path: "OverallClassReportAdmin",
        element: <OverallClassReportAdmin />,
      },
      {
        path: "ChangeCredentials",
        element: <ChangeCredentials />,
      },
      {
        path: "UpdateAttendanceFaculty",
        element: <UpdateAttendanceFaculty />,
      },
      {
        path: "ViewFeedbackFaculty",
        element: <ViewFeedbackFaculty />,
      },
      {
        path: "ManageNotificationsAdmin",
        element: <ManageNotificationsAdmin />,
      },
      {
        path: "EditNotificationAdmin/:id",
        element: <EditNotificationAdmin />,
      },
      {
        path: "ViewTimetable",
        element: <ViewTimeTableStudent />,
      },
      {
        path: "UploadLearningMaterialFaculty",
        element: <UploadLearningMaterialFaculty />,
      },
      {
        path: "UpdateSessionPlanningFaculty",
        element: <UpdateSessionPlanningFaculty />,
      },
      {
        path: "ViewSessionPlanFaculty",
        element: <ViewSessionPlanFaculty />,
      },
    ],
  },
  {
    path: "student/dashboard",
    element: (
      <ProtectedRoute allowedRole="Student">
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <StudentPanelDashboard />,
      },
      {
        path: "notifications",
        element: <NotificationPage />,
      },
      {
        path: "Classroom",
        element: <Classroom />,
      },
      {
        path: "Events",
        element: <Events />,
      },
      {
        path: "NotAvailablePage",
        element: <NotAvailablePage />,
      },
      {
        path: "ChangeCredentials",
        element: <ChangeCredentials />,
      },
      {
        path: "FacultyFeedbackStudent",
        element: <FacultyFeedbackStudent />,
      },
      {
        path: "ViewTimetable",
        element: <ViewTimeTableStudent />,
      },
      {
        path: "ViewAttendanceReportStudent",
        element: <ViewAttendanceReportStudent />,
      },
      {
        path: "LearningMaterialStudent",
        element: <LearningMaterialStudent />,
      },
      {
        path: "GenerateHallTicketStudent",
        element: <GenerateHallTicketStudent />,
      },
      {
        path: "ViewExamResultStudent",
        element: <ViewExamResultStudent />,
      },
      {
        path: "PrintFeeReceiptStudent",
        element: <PrintFeeReceiptStudent />,
      },
      {
        path: "ViewSessionPlanFaculty",
        element: <ViewSessionPlanFaculty />,
      },
      {
        path: "ManageProfileStudent",
        element: <ManageProfileStudent />,
      }
    ],
  },
  {
    path: "/LoginPage",
    element: <LoginPage />,
  },
  {
    path: "/ForgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/AboutUs",
    element: <AboutUs />,
  },
  {
    path: "/KnowMore",
    element: <KnowMore />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <ConfirmProvider>
          <ToastProvider>
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-screen bg-[var(--bg-secondary)]">
                  <div className="flex flex-col items-center gap-4">
                    {/* Spinner */}
                    <div className="w-12 h-12 border-4 border-[var(--border-medium)] border-t-[var(--text-primary)] rounded-full animate-spin"></div>

                    {/* Text */}
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                      Loading ERP...
                    </h2>

                    {/* Subtext */}
                    <p className="text-sm text-[var(--text-muted)]">
                      Getting things ready for you...
                    </p>
                  </div>
                </div>
              }
            >
              <RouterProvider router={router} />
            </Suspense>
          </ToastProvider>
        </ConfirmProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
