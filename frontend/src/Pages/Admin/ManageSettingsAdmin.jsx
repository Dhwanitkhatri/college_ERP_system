import React from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import { Save } from "lucide-react";
import ToggleButtonSettings from "../../ui/Buttons/ToggleButtonSettings";

export default function ManageSettingsAdmin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Valid Form Data Submitted:", data);
  };

  return (
    <DashboardChildPageTemplate
      title="Manage Settings"
      desc="Configure college information and system settings"
      width="max-w-7xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="pb-10">
        <DashboardChildPageCard className="mb-6">
          <div className="mainDiv">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
              College Information
            </h2>
            <div className="gridDiv grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="collegeNameDiv flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  College Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter college name"
                  {...register("collegeName", {
                    required: "College name is required",
                  })}
                  className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-1 transition-colors theme-transition"
                />
                {errors.collegeName && (
                  <span className="text-xs text-red-500">
                    {errors.collegeName.message}
                  </span>
                )}
              </div>
              <div className="locationDiv flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="enter location"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-1 transition-colors theme-transition"
                />
                {errors.location && (
                  <span className="text-xs text-red-500">
                    {errors.location.message}
                  </span>
                )}
              </div>
              <div className="emailDiv flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="enter email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-1 transition-colors theme-transition"
                />
                {errors.email && (
                  <span className="text-xs text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="phoneDiv flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="enter phone number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value:
                        /^[+]?[9][1]?[6-9]\d{9}$|^[6-9]\d{9}$|^[0]?[6-9]\d{10}$/,
                      message: "Invalid phone number",
                    },
                  })}
                  className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-1 transition-colors theme-transition"
                />
                {errors.phone && (
                  <span className="text-xs text-red-500">
                    {errors.phone.message}
                  </span>
                )}
              </div>
              <div className="websiteDiv flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Website <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="enter website"
                  {...register("website", { required: "Website is required" })}
                  className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-1 transition-colors theme-transition"
                />
                {errors.website && (
                  <span className="text-xs text-red-500">
                    {errors.website.message}
                  </span>
                )}
              </div>
              <div className="establishedYearDiv flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Established Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="enter established year"
                  {...register("establishedYear", {
                    required: "Year is required",
                    pattern: {
                      value: /^(19|20)\d{2}$|^\d{4}$/,
                      message: "Enter a valid 4-digit year",
                    },
                  })}
                  className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-1 transition-colors theme-transition"
                />
                {errors.establishedYear && (
                  <span className="text-xs text-red-500">
                    {errors.establishedYear.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="wrapperDiv w-full h-px bg-[var(--border-light)] my-8" />
          <div className="userPermissionsDiv">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              User Permissions
            </h2>
            <div className="divide-y divide-[var(--border-light)]">
              <ToggleButtonSettings
                title="Allow Students to Update Profile"
                desc="Students can edit their personal information"
                defaultChecked={false}
              />
              <ToggleButtonSettings
                title="Allow Faculty to Update Profile"
                desc="Faculty members can edit their personal information"
                defaultChecked={false}
              />
              <ToggleButtonSettings
                title="Students Can View Fee Details"
                desc="Allow students to view their fee payment status"
                defaultChecked={false}
              />
            </div>
          </div>

          <div className="wrapperDiv w-full h-px bg-[var(--border-light)] my-8" />
          <div className="systemSettingsDiv">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              System Settings
            </h2>
            <div className="divide-y divide-[var(--border-light)]">
              <ToggleButtonSettings
                title="Maintenance Mode"
                desc="Enable to restrict system access for maintenance"
                defaultChecked={false}
              />
              <ToggleButtonSettings
                title="Registration Open"
                desc="Allow new student registration"
                defaultChecked={false}
              />
              <ToggleButtonSettings
                title="Exam Mode"
                desc="Activate during examination periods"
                defaultChecked={false}
              />
            </div>
          </div>
        </DashboardChildPageCard>

        <div className="buttonsDiv flex justify-end gap-4">
          <CancelButton />

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] transition-colors"
          >
            <Save size={16} />
            Save Settings
          </button>
        </div>
      </form>
    </DashboardChildPageTemplate>
  );
}
