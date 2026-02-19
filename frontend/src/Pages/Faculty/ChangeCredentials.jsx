import React from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";

const ChangeCredentials = () => {
  {
    /* this is the react hook form part */
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    // main desinging part start from here
    <DashboardChildPageTemplate
      title="Change Credentials"
      desc="Update your password to keep your account secure"
      width="max-w-4xl"
    >
      <DashboardChildPageCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* this is the current password part */}
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

          {/* this is the new password part */}
          <div className="form-field">
            <label className="custom-label">New Password</label>
            <input
              type="password"
              className="custom-input bg-[var(--bg-primary)] theme-transition"
              placeholder="Enter new password"
              {...register("newPassword", {
                required: "New password is required",
              })}
            />
            {errors.newPassword && (
              <p className="custom-error">{errors.newPassword.message}</p>
            )}
          </div>

          {/* this is the confirm new password part */}
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

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
            >
              Update Password
            </button>
            <CancelButton />
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default ChangeCredentials;
