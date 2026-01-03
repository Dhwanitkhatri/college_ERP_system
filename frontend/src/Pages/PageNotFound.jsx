import React from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div
        className="w-full text-center h-full bg-inherit"
      >
        <div className="flex flex-col items-center justify-center gap-5 py-16 px-8">
          {/* Icon */}
          <div
            className="p-4 rounded-full"
            style={{ backgroundColor: "var(--bg-error-hover)" }}
          >
            <AlertTriangle size={48} style={{ color: "var(--error-text)" }} />
          </div>

          {/* Title */}
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            404 — Page Not Found
          </h1>

          {/* Description */}
          <p className="max-w-md" style={{ color: "var(--text-muted)" }}>
            The page you are trying to access does not exist, may have been
            removed, or the URL might be incorrect.
          </p>

          {/* Action */}
          <button
            onClick={() => navigate(-1)}
            className="mt-3 flex items-center gap-2 px-5 py-2 transition rounded-md"
            style={{
              backgroundColor: "var(--Submit-Btn-General)",
              color: "var(--btn-primary-text)",
            }}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
