import React from "react";
import { NavLink } from "react-router-dom";

const SideBarButton = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "sidebarBtn bg-black text-white dark:bg-gray-700 dark:text-white rounded-md"
          : "sidebarBtn bg-white text-black dark:bg-gray-800 dark:text-gray-200 rounded-md"
      }
    >
      <div className="sideBarButtonDiv flex items-center gap-3 p-[5%] rounded-xl
        hover:bg-gray-100 dark:hover:bg-gray-700">

        <div className="sidebarIcon">{Icon && <Icon size={25} />}</div>

        <div className="sidebarText text-sm font-medium">{label}</div>
      </div>
    </NavLink>
  );
};

export default SideBarButton;
