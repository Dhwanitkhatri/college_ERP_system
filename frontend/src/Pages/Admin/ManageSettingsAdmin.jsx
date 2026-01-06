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
          {/* ================= USER PERMISSIONS ================= */}
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

          {/* ================= ADD SETTINGS ================= */}
          <div className="addSettingsDiv">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Add Settings
            </h2>

            <div className="divide-y divide-[var(--border-light)]">
              <ToggleButtonSettings
                title="Allow Add Student"
                desc="Admin can add new students"
                defaultChecked={false}
              />
              <ToggleButtonSettings
                title="Allow Add Faculty"
                desc="Admin can add new faculty members"
                defaultChecked={false}
              />
              <ToggleButtonSettings
                title="Allow Add Subject"
                desc="Admin can add subjects"
                defaultChecked={false}
              />
              <ToggleButtonSettings
                title="Allow Add Timetable"
                desc="Admin can create class timetables"
                defaultChecked={false}
              />
              <ToggleButtonSettings
                title="Allow Add Event"
                desc="Admin can add college events"
                defaultChecked={false}
              />
              <ToggleButtonSettings
                title="Allow Add Class"
                desc="Admin can add new classes"
                defaultChecked={false}
              />
            </div>
          </div>

          <div className="wrapperDiv w-full h-px bg-[var(--border-light)] my-8" />

          {/* ================= MANAGE SETTINGS ================= */}
          <div className="manageSettingsDiv">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Manage Settings
            </h2>

            <div className="divide-y divide-[var(--border-light)]">
              <ToggleButtonSettings
                title="Allow Edit Faculty"
                desc="Admin can edit faculty details"
                defaultChecked={false}
              />
              <ToggleButtonSettings
                title="Allow Edit Student"
                desc="Admin can edit student details"
                defaultChecked={false}
              />
            </div>
          </div>

          <div className="wrapperDiv w-full h-px bg-[var(--border-light)] my-8" />

          {/* ================= SYSTEM SETTINGS ================= */}
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
