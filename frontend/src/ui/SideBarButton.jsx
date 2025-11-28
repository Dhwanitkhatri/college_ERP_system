import React from "react";
import { NavLink } from "react-router-dom";

const SideBarButton = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        sidebarBtn rounded-md transition-colors duration-200
        ${isActive 
          ? "bg-black text-white dark:bg-gray-700 dark:text-white" 
          : "bg-white text-black dark:bg-gray-800 dark:text-gray-200"}
        `
      }
    >
      <div
        className="
          sideBarButtonDiv flex items-center gap-3 p-[5%] my-[3%] rounded-md
          transition-colors duration-200

          /* Hover Styles */
          hover:bg-gray-100 dark:hover:bg-gray-700

          /* Active Styles Match Parent */
          [&.active]:bg-black [&.active]:text-white
          dark:[&.active]:bg-gray-700 dark:[&.active]:text-white
        "
      >
        <div className="sidebarIcon">{Icon && <Icon size={22} />}</div>

        <div className="sidebarText text-sm font-medium">{label}</div>
      </div>
    </NavLink>
  );
};

export default SideBarButton;
