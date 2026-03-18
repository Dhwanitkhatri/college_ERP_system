import React from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import { Save } from "lucide-react";

export default function ManageSettingsAdmin() {
  {
    /* this is the react hook form part managing our 4 master toggles */
  }
  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      addSettings: false,
      updateProfile: false,
      sendNotifications: false,
      maintenanceMode: false,
    },
  });

  {
    /* watching the values so the UI updates instantly when clicked */
  }
  const addSettings = watch("addSettings");
  const updateProfile = watch("updateProfile");
  const sendNotifications = watch("sendNotifications");
  const maintenanceMode = watch("maintenanceMode");

  {
    /* this is the submit function part */
  }
  const onSubmit = (data) => {
    // This proves react-hook-form is capturing the toggle states!
    console.log("Settings Saved Successfully:", data);
  };

  {
    /* the main designing part start from here */
  }
  return (
    <DashboardChildPageTemplate
      title="Manage Settings"
      desc="Configure college information and system settings"
      width="max-w-5xl"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="pb-10 flex flex-col gap-6"
      >
        <DashboardChildPageCard>
          {/* ================= ADD SETTINGS ================= */}
          <div className="flex justify-between items-center py-2">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Add Settings
            </h2>
            <div
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                addSettings
                  ? "bg-black dark:bg-white"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              onClick={() => setValue("addSettings", !addSettings)}
            >
              <div
                className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  addSettings
                    ? "translate-x-6 bg-white dark:bg-black"
                    : "translate-x-0 bg-white"
                }`}
              />
            </div>
          </div>

          <div className="w-full h-px bg-[var(--border-light)] my-6" />

          {/* ================= ALLOWS USERS TO UPDATE PROFILE ================= */}
          <div className="flex justify-between items-center py-2">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Allows Users to Update Profile
            </h2>
            <div
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                updateProfile
                  ? "bg-black dark:bg-white"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              onClick={() => setValue("updateProfile", !updateProfile)}
            >
              <div
                className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  updateProfile
                    ? "translate-x-6 bg-white dark:bg-black"
                    : "translate-x-0 bg-white"
                }`}
              />
            </div>
          </div>

          <div className="w-full h-px bg-[var(--border-light)] my-6" />

          {/* ================= ALLOW USERS TO SEND NOTIFICATIONS ================= */}
          <div className="flex justify-between items-center py-2">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Allow Users to Send Notifications
            </h2>
            <div
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                sendNotifications
                  ? "bg-black dark:bg-white"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              onClick={() => setValue("sendNotifications", !sendNotifications)}
            >
              <div
                className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  sendNotifications
                    ? "translate-x-6 bg-white dark:bg-black"
                    : "translate-x-0 bg-white"
                }`}
              />
            </div>
          </div>

          <div className="w-full h-px bg-[var(--border-light)] my-6" />

          {/* ================= MAINTENANCE MODE ================= */}
          <div className="flex justify-between items-center py-2">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Maintenance Mode
            </h2>
            <div
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                maintenanceMode
                  ? "bg-black dark:bg-white"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              onClick={() => setValue("maintenanceMode", !maintenanceMode)}
            >
              <div
                className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  maintenanceMode
                    ? "translate-x-6 bg-white dark:bg-black"
                    : "translate-x-0 bg-white"
                }`}
              />
            </div>
          </div>
        </DashboardChildPageCard>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="flex justify-end gap-4 mt-2">
          <CancelButton
            type="button"
            onClick={() => window.location.reload()}
          />

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-md text-white dark:text-black font-medium bg-black dark:bg-white hover:opacity-90 transition-opacity"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </form>
    </DashboardChildPageTemplate>
  );
}
