import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import api from "../../api/axios";

const ChangeCredentials = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const newPassword = watch("newPassword");

  const token = localStorage.getItem("token");

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await api.put(
        "/api/profile/change-password",
        {
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

    
      localStorage.removeItem("token");
      window.location.href = "/login";

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

  return (
    <DashboardChildPageTemplate
      title="Change Credentials"
      desc="Update your password to keep your account secure"
      width="max-w-4xl"
    >
      <DashboardChildPageCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Current Password */}
          <div className="form-field">
            <label className="custom-label">Current Password</label>
            <input
              type="password"
              className="custom-input bg-[var(--bg-primary)] theme-transition"
              placeholder="Enter current password"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
            />
            {errors.currentPassword && (
              <p className="custom-error">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="form-field">
            <label className="custom-label">New Password</label>
            <input
              type="password"
              className="custom-input bg-[var(--bg-primary)] theme-transition"
              placeholder="Enter new password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.newPassword && (
              <p className="custom-error">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-field">
            <label className="custom-label">Confirm New Password</label>
            <input
              type="password"
              className="custom-input bg-[var(--bg-primary)] theme-transition"
              placeholder="Re-enter new password"
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="custom-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 mt-3 text-sm">{serverError}</p>
          )}

          {/* Buttons */}
          <div className="form-actions mt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-lg hover:opacity-90 transition-opacity font-medium text-sm disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            <CancelButton />
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default ChangeCredentials;
