import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import EyeIconButton from "../../ui/Buttons/EyeIconButton"; // 👈 Import Eye Component
import api from "../../api/axios";

const ChangeCredentials = () => {
  // ---------------------------
  // React Hook Form Setup
  // ---------------------------
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // ---------------------------
  // Local Component States
  // ---------------------------
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // 👁 Password visibility states (3 inputs = 3 states)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const newPassword = watch("newPassword");

  

  // ---------------------------
  // Form Submit Handler
  // ---------------------------
  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await api.put(
        "/api/profile/change-password",
        {
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
        }
      );

      alert(response.data.message);

      // Logout after successful password change
      localStorage.removeItem("token");
      window.location.href = "/LoginPage";
    } catch (error) {
      if (error.response) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Something went wrong");
      }
    } finally {
      setLoading(false);
      reset();
    }
  };
  // ---------------------------
  // Cancel Handler
  // ---------------------------
  const handleCancel = () => {
    reset(); // clears all react-hook-form fields
    setServerError(""); // clears server error
    setShowCurrent(false); // reset visibility states
    setShowNew(false);
    setShowConfirm(false);
  };
  return (
    <DashboardChildPageTemplate
      title="Change Credentials"
      desc="Update your password to keep your account secure"
      width="max-w-4xl"
    >
      <DashboardChildPageCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ================= Current Password ================= */}
          <div className="form-field relative">
            <label className="custom-label">Current Password</label>

            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                className="custom-input pr-10 bg-[var(--bg-primary)] theme-transition"
                placeholder="Enter current password"
                {...register("currentPassword", {
                  required: "Current password is required",
                })}
              />

              {/* Eye Icon */}
              <EyeIconButton
                visible={showCurrent}
                onClick={() => setShowCurrent((prev) => !prev)}
              />
            </div>

            {errors.currentPassword && (
              <p className="custom-error">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* ================= New Password ================= */}
          <div className="form-field relative">
            <label className="custom-label">New Password</label>

            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                className="custom-input pr-10 bg-[var(--bg-primary)] theme-transition"
                placeholder="Enter new password"
                {...register("newPassword", {
                  required: "New password is required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                    message:
                      "Password must be at least 8 characters, include uppercase, lowercase and a special character",
                  },
                })}
              />

              <EyeIconButton
                visible={showNew}
                onClick={() => setShowNew((prev) => !prev)}
              />
            </div>

            {errors.newPassword && (
              <p className="custom-error">{errors.newPassword.message}</p>
            )}
          </div>

          {/* ================= Confirm Password ================= */}
          <div className="form-field relative">
            <label className="custom-label">Confirm New Password</label>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                className="custom-input pr-10 bg-[var(--bg-primary)] theme-transition"
                placeholder="Re-enter new password"
                {...register("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
              />

              <EyeIconButton
                visible={showConfirm}
                onClick={() => setShowConfirm((prev) => !prev)}
              />
            </div>

            {errors.confirmPassword && (
              <p className="custom-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* ================= Server Error ================= */}
          {serverError && (
            <p className="text-red-500 mt-3 text-sm">{serverError}</p>
          )}

          {/* ================= Buttons ================= */}
          <div className="form-actions mt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="
                px-6 py-2.5
                bg-[var(--btn-primary-bg)]
                text-[var(--btn-primary-text)]
                rounded-lg
                hover:opacity-90
                transition-opacity
                font-medium
                text-sm
                disabled:opacity-50
              "
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            <CancelButton onClick={handleCancel} />
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default ChangeCredentials;
