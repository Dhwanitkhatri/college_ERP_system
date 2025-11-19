import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import KnowMore from "./Pages/KnowMore";
import AboutUs from "./Pages/AboutUs";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
  }
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
