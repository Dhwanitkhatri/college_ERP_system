import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import KnowMore from "./Pages/KnowMore";
import AboutUs from "./Pages/AboutUs";
import NavbarDashboard from "./Components/NavbarDashboard";
import SideBarDashboard from "./Components/SideBarDashboard";
import Dashboard from "./Pages/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import AddFacultyAdmin from "./Pages/Admin/AddFacultyAdmin";
import AddStudentAdmin from "./Pages/Admin/AddStudentAdmin";
import AddSubjectAdmin from "./Pages/Admin/AddSubjectAdmin";
import AddCourseAdmin from "./Pages/Admin/AddCourseAdmin";
import "./App.css";
import AdminPanelDashboard from "./Pages/Admin/AdminPanelDashboard";
import FacultyPanelDashboard from "./Pages/Faculty/FacultyPanelDashboard";
import StudentPanelDashboard from "./Pages/Student/StudentPanelDashboard";
import { SidebarProvider } from "./context/SidebarContext";
import ManageFacultyAdmin from "./Pages/Admin/ManageFacultyAdmin";
import ManageStudentAdmin from "./Pages/Admin/ManageStudentAdmin";
import AddClassAdmin from "./Pages/Admin/AddClassAdmin";
import AddTimeTableAdmin from "./Pages/Admin/AddTimeTableAdmin";
import SendNotificationAdmin from "./Pages/Admin/SendNotificationAdmin";
import ManageProfileAdmin from "./Pages/Admin/ManageProfileAdmin";
import StudentReportAdmin from "./Pages/Admin/StudentReportAdmin";
import DatewiseReportAdmin from "./Pages/Admin/DatewiseReportAdmin";
import ClasswiseReportAdmin from "./Pages/Admin/ClasswiseReportAdmin";
import CheckFeeStatusAdmin from "./Pages/Admin/CheckFeeStatusAdmin";
import EditFacultyAdmin from "./Pages/Admin/EditFacultyAdmin";
import NotAvailablePage from "./Pages/NotAvailablePage";
import Classroom from "./Pages/Classroom";
import NotificationPage from "./Pages/NotificationPage";
import ManageSettingsAdmin from "./Pages/Admin/ManageSettingsAdmin";
import Events from "./Pages/Events";
import OverallClassReportAdmin from "./Pages/Admin/OverallClassReportAdmin";
import PageNotFound from "./Pages/PageNotFound";
import CreateFeeStructureAdmin from "./Pages/Admin/CreateFeeStructureAdmin";
import TakeAttendanceFaculty from "./Pages/Faculty/TakeAttendanceFaculty";
import CreateEventAdmin from "./Pages/Admin/CreateEventAdmin";
import SessionPlanningFaculty from "./Pages/Faculty/SessionPlanningFaculty";
import PayFeeAdmin from "./Pages/Admin/PayFeeAdmin";
import EditClassroomAdmin from "./Pages/Admin/EditClassroomAdmin";
import EditStudentAdmin from "./Pages/Admin/EditStudentAdmin";
import ViewTimetable from "./Pages/ViewTimeTable";
import EditEventAdmin from "./Pages/Admin/EditEventAdmin";
import ChangeCredentials from "./Pages/Faculty/ChangeCredentials";
import UpdateAttendanceFaculty from "./Pages/Faculty/UpdateAttendanceFaculty";
import ManageNotificationsAdmin from "./Pages/Admin/ManageNotificationsAdmin";
import EditNotificationAdmin from "./Pages/Admin/EditNotificationAdmin";
import FacultyFeedbackStudent from "./Pages/Student/FacultyFeedbackStudent";
import FeedbackEvaluationAdmin from "./Pages/Admin/FeedbackEvaluationAdmin";
import ViewFeedbackFaculty from "./Pages/Faculty/ViewFeedbackFaculty";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/NavbarDashboard", //Temporary Route
    element: <NavbarDashboard />,
  },
  {
    path: "/SideBarDashboard", //Temporary Route
    element: <SideBarDashboard />,
  },
  {
    path: "admin/Dashboard", //Temporary Route
    element: <Dashboard />,
    children: [
      {
        index: true, //default admin dash page
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
    ],
  },
  {
    path: "faculty/dashboard",
    element: <Dashboard />,
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
    ],
  },
  {
    path: "student/dashboard",
    element: <Dashboard />,
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
        path: "ChangeCredentials",
        element: <ChangeCredentials />,
      },
      {
        path: "FacultyFeedbackStudent",
        element: <FacultyFeedbackStudent />,
      },
    ],
  },
  {
    path: "/AddFacultyAdmin", //Temporary Route
    element: <AddFacultyAdmin />,
  },
  {
    path: "/LoginPage",
    element: <LoginPage />,
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
]);
function App() {
  return (
    <>
      <ThemeProvider>
        <SidebarProvider>
          <RouterProvider router={router} />
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
