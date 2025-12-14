import React from "react";
import SideBarButton from "../ui/Buttons/SideBarButton";
import { LayoutDashboard } from "lucide-react";
import SideBarLogoutButton from "../ui/Buttons/SideBarLogoutButton";
import { useSidebar } from "../context/SidebarContext";

const SideBarDashboard = ({onLogoutClick}) => {
  const { sidebarOpen } = useSidebar();

  return (
    <aside
  className={`
    ${sidebarOpen ? "w-64" : "w-0"}
    shrink-0
    bg-[var(--sidebar-bg)] dark:bg-[var(--sidebar-bg)]
    border-r-[0.8px]
    border-r-[var(--border-light)] dark:border-r-[var(--border-light)]
    theme-transition duration-300 overflow-hidden
  `}
>
  <div className="p-4 space-y-3">
    <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard} />
    <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard} />
    <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard} />
    <SideBarButton to="/Dashboard" label="Dashboard" icon={LayoutDashboard} />

    <div className="pt-4 border-t dark:border-gray-700">
      <SideBarLogoutButton onClick={onLogoutClick} />
    </div>
  </div>
</aside>

  );
};

export default SideBarDashboard;
