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
import "./App.css";
import AdminPanelDashboard from "./Pages/Admin/AdminPanelDashboard";
import FacultyPanelDashboard from "./Pages/Faculty/FacultyPanelDashboard";
import StudentPanelDashboard from "./Pages/Student/StudentPanelDashboard";

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
        index: true,
        element: <AdminPanelDashboard />,
      },
      {
        path: "AddFacultyAdmin",
        element: <AddFacultyAdmin />,
      },
    ],
  },
  {
    path: "faculty/dashboard",
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <FacultyPanelDashboard />
      }
    ]
  },
  {
    path: "student/dashboard",
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <StudentPanelDashboard />
      }
    ]
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
]);
function App() {
  return (
    <>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
