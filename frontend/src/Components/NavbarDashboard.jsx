import React from "react";
import { X, Bell, CircleUserRound, Menu } from "lucide-react";
import ThemeButton from "../ui/Buttons/ThemeButton";
import { useSidebar } from "../context/SidebarContext";

const NavbarDashboard = ({user,userName}) => {
  const {sidebarOpen, toggleSidebar} = useSidebar();
  return (
    <div className="navMainDiv bg-white dark:bg-gray-900 flex justify-between items-center border-b-[0.8px] border-b-[var(--light-border)] dark:border-b-[0.8px] dark:border-b-[var(--light-border)] py-[0.8%] px-4">
      {/* LEFT SECTION */}
      <div className="navLeftDiv flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition" onClick={toggleSidebar}>
          {sidebarOpen?<X className="text-black dark:text-white" />:<Menu className="text-black dark:text-white" />}
        </button>

        <h2 className="font-semibold text-black dark:text-white">
          College ERP - {user} Dashboard
        </h2>
      </div>

      {/* RIGHT SECTION */}
      <div className="navRightDiv flex items-center gap-5">
        {/* Notification Button */}
        <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <Bell className="text-black dark:text-white" />
        </button>

        {/* Theme Button */}
        <ThemeButton />

        {/* User Info */}
        <div className="navUserInfoDiv border-l-[0.8px] dark:border-gray-700 flex items-center gap-4 pl-4">
          <div>
            <p className="text-right font-medium text-black dark:text-white">
              {userName}
            </p>
            <p className="text-right text-gray-600 dark:text-gray-300">
              {user}
            </p>
          </div>
          <CircleUserRound className="text-black dark:text-white" />
        </div>
      </div>
    </div>
  );
};

export default NavbarDashboard;
