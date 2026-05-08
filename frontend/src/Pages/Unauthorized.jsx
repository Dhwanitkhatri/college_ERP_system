import React from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    const role = getUserRole();

    const pathMap = {
      Admin: "/admin/dashboard",
      Faculty: "/faculty/dashboard",
      Student: "/student/dashboard",
    };

    navigate(pathMap[role] || "/LoginPage");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="w-full text-center h-full bg-inherit">
        <div className="flex flex-col items-center justify-center gap-5 py-16 px-8">
          
          {/* Icon */}
          <div
            className="p-4 rounded-full"
            style={{ backgroundColor: "var(--bg-error-hover)" }}
          >
            <ShieldAlert
              size={48}
              style={{ color: "var(--error-text)" }}
            />
          </div>

          {/* Title */}
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            403 — Access Denied
          </h1>

          {/* Description */}
          <p className="max-w-md" style={{ color: "var(--text-muted)" }}>
            You do not have permission to access this page. Please return to your
            dashboard or contact the administrator if you believe this is an error.
          </p>

          {/* Action */}
          <button
            onClick={handleRedirect}
            className="mt-3 flex items-center gap-2 px-5 py-2 transition rounded-md"
            style={{
              backgroundColor: "var(--Submit-Btn-General)",
              color: "var(--btn-primary-text)",
            }}
          >
            <ArrowLeft size={18} />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;