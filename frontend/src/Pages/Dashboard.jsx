import React from "react";
import NavbarDashboard from "../Components/NavbarDashboard";
import SideBarDashboard from "../Components/SideBarDashboard";
import MainPanelDashboard from "../Components/MainPanelDashboard";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboardContainer h-screen w-full flex flex-col overflow-hidden divide-y">
      <NavbarDashboard user="Admin" userName="Prof. Steve"/>  {/*added temporarily */}

      <div className="sideBarMainContent flex flex-1 overflow-hidden divide-x border-none">
        <SideBarDashboard />
        <MainPanelDashboard>
          <Outlet />
        </MainPanelDashboard>
      </div>
    </div>
  );
};

export default Dashboard;
