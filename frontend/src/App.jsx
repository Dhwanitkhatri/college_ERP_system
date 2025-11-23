import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import KnowMore from "./Pages/KnowMore";
import AboutUs from "./Pages/AboutUs";
import NavbarDashboard from "./Components/NavbarDashboard";
import SideBarDashboard from "./Components/SideBarDashboard";
import Dashboard from "./Pages/Dashboard";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

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
    path: "/Dashboard", //Temporary Route
    element: <Dashboard />,
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
