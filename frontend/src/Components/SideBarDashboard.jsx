import React from "react";
import SideBarButton from "../ui/SideBarButton";
import { LayoutDashboard } from "lucide-react";
import SideBarLogoutButton from "../ui/SideBarLogoutButton";
import { useSidebar } from "../context/SidebarContext";

const SideBarDashboard = () => {
  const { sidebarOpen } = useSidebar();

  return (
    <aside
  className={`
    ${sidebarOpen ? "w-64" : "w-0"}
    shrink-0
    bg-white dark:bg-gray-900
    
    transition-all duration-300 overflow-hidden
  `}
>
  <div className="p-4 space-y-3">
    <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard} />
    <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard} />
    <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard} />
    <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard} />

    <div className="pt-4 border-t dark:border-gray-700">
      <SideBarLogoutButton />
    </div>
  </div>
</aside>

  );
};

export default SideBarDashboard;
