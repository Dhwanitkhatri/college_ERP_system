import React from "react";
import { LogOut } from "lucide-react";
const SideBarLogoutButton = () => {
  return (
    <div className="SidebarLogoutButtonDiv flex items-center justify-center px-[5%] py-[3%] rounded-xl border-[2px] hover:bg-gray-100 hover:border-red-300 hover:text-red-500">
      <div className="LogoutIconDiv px-1">
        <LogOut size={20} />
      </div>
      <span className="LogoutText px-2 font-medium">Logout</span>
    </div>
  );
};

export default SideBarLogoutButton;
