import React from "react";
import NavbarDashboard from "../Components/NavbarDashboard";
import SideBarDashboard from "../Components/SideBarDashboard";
import MainPanelDashboard from "../Components/MainPanelDashboard";
import { Outlet } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const Dashboard = () => {
  const { sidebarOpen } = useSidebar();

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarDashboard />

      <div className="flex flex-1 overflow-hidden">
        <SideBarDashboard />

        <main
          className={`flex-1 transition-all duration-300`}
        >
          <MainPanelDashboard>
            <Outlet />
          </MainPanelDashboard>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
