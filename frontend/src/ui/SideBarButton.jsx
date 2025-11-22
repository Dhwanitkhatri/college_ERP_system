import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

const SideBarButton = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to="{to}"
      className={({ isActive }) =>
        isActive
          ? "sidebarBtn bg-black text-white rounded-md"
          : "sidebarBtn bg-white text-black rounded-md"
      }
    >
      <div className="sideBarButtonDiv flex items-center gap-3 hover:bg-gray-100 p-[5%] rounded-xl">
        <div className="sidebarIcon">{Icon && <Icon size={25} />}</div>
        <div className="sidebarText text-sm font-medium">{label}</div>
      </div>
    </NavLink>
  );
};

export default SideBarButton;
