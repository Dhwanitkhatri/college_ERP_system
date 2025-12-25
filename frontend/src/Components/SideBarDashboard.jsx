import React from "react";
import SideBarButton from "../ui/Buttons/SideBarButton";
import { LayoutDashboard, CalendarDays, School, Bell } from "lucide-react";
import SideBarLogoutButton from "../ui/Buttons/SideBarLogoutButton";
import { useSidebar } from "../context/SidebarContext";

const SideBarDashboard = ({ onLogoutClick, role }) => {
  const { sidebarOpen } = useSidebar();
  console.log(role);

  const dashboardPath =
    role === "Admin"
      ? "/admin/Dashboard"
      : role === "Faculty"
      ? "/faculty/dashboard"
      : "/student/dashboard";

  return (
    <aside
      className={`
        ${sidebarOpen ? "w-64" : "w-0"}
        shrink-0
        bg-[var(--sidebar-bg)]
        border-r-[0.8px] border-r-[var(--border-light)]
        theme-transition duration-300 overflow-hidden
      `}
    >
      <div className="p-4 space-y-3">
        <SideBarButton
          to={dashboardPath}
          label="Dashboard"
          icon={LayoutDashboard}
        />

        <SideBarButton to="Classroom" label="Classes" icon={School} />
        <SideBarButton to="Events" label="Events" icon={CalendarDays} />
        <SideBarButton
          to="Notifications"
          label="Notifications"
          icon={Bell}
        />

        <div className="pt-4 border-t dark:border-gray-700">
          <SideBarLogoutButton onClick={onLogoutClick} />
        </div>
      </div>
    </aside>
  );
};

export default SideBarDashboard;
