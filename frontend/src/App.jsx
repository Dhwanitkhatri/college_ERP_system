import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import { Routes, Route, createBrowserRouter } from "react-router-dom";
import { BrowserRouter, RouterProvider } from "react-router-dom";
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
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
