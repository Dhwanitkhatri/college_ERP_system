// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRole }) => {
  const role = getUserRole();
  console.log(role);

  // Not logged in
  if (!role) {
    return <Navigate to="/LoginPage" />;
  }

  // Role mismatch
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;