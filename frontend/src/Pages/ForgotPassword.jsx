import React, { useState } from "react";
import { useForm } from "react-hook-form";
import NavigateBackButton from "../ui/Buttons/NavigateBackButton";
import ThemeButton from "../ui/Buttons/ThemeButton";
import EyeIconButton from "../ui/Buttons/EyeIconButton";
import api from "../api/axios.js";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [otpSent, setOtpSent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [token, setToken] = useState(null);

  const newPassword = watch("newPassword");

  /* ---------------- SEND OTP ---------------- */

  const handleSendOtp = async (data) => {
    try {
      console.log("OTP sent to:", data.username);

      // API call later
      const res = await api.post("/reset-password/send-otp", {
        username: data.username,
      });

      setToken(res.data.token);
      setOtpSent(true);

      alert("OTP sent to your registered email");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to send OTP");
    }
  };

  /* ---------------- VERIFY OTP + CHANGE PASSWORD ---------------- */

  const handleResetPassword = async (data) => {
    try {
      console.log("Reset Password Data:", data);

      // API call later
      await api.post("/reset-password/verify-otp", {
        token: token,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      alert("Password changed successfully!");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[var(--bg-tertiary)] px-4">
      {/* Top Buttons */}
      <div className="absolute top-5 left-5">
        <NavigateBackButton />
      </div>

      <div className="absolute top-5 right-5">
        <ThemeButton />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-light)] rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Forgot Password
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Reset your password using OTP verification
          </p>
        </div>

        <form
          onSubmit={handleSubmit(otpSent ? handleResetPassword : handleSendOtp)}
        >
          {/* USERNAME */}
          <div className="form-field">
            <label className="custom-label">Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              className="custom-input"
              {...register("username", {
                required: "Username is required",
              })}
            />

            {errors.username && (
              <p className="custom-error">{errors.username.message}</p>
            )}
          </div>

          {/* SEND OTP BUTTON */}

          {!otpSent && (
            <div className="form-actions mt-4">
              <button
                type="submit"
                className="px-4 py-2 rounded-md transition
                bg-[var(--btn-primary-bg)]
                text-[var(--btn-primary-text)]
                hover:bg-[var(--btn-primary-hover)]"
              >
                Send OTP
              </button>
            </div>
          )}

          {/* STEP 2 */}

          {otpSent && (
            <>
              {/* OTP */}

              <div className="form-field">
                <label className="custom-label">OTP</label>

                <input
                  type="text"
                  placeholder="Enter 4 digit OTP"
                  maxLength={6}
                  className="custom-input"
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "OTP must be 6 digits",
                    },
                  })}
                />

                {errors.otp && (
                  <p className="custom-error">{errors.otp.message}</p>
                )}
              </div>

              {/* NEW PASSWORD */}

              <div className="form-field relative">
                <label className="custom-label">New Password</label>

                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    className="custom-input pr-10"
                    placeholder="Enter new password"
                    {...register("newPassword", {
                      required: "New password is required",
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                        message:
                          "Password must be 8+ chars with uppercase, lowercase & special character",
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

              {/* CONFIRM PASSWORD */}

              <div className="form-field relative">
                <label className="custom-label">Confirm Password</label>

                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="custom-input pr-10"
                    placeholder="Confirm new password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
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
                  <p className="custom-error">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* VERIFY BUTTON */}

              <div className="form-actions mt-5">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md transition
                  bg-[var(--btn-primary-bg)]
                  text-[var(--btn-primary-text)]
                  hover:bg-[var(--btn-primary-hover)]"
                >
                  Verify & Change Password
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
