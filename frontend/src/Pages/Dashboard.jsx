import React, { useState } from "react";
import { useEffect } from "react";
import NavbarDashboard from "../Components/NavbarDashboard";
import SideBarDashboard from "../Components/SideBarDashboard";
import MainPanelDashboard from "../Components/MainPanelDashboard";
import { Outlet } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import api from "../api/axios.js";
import { useOutletContext } from "react-router-dom";
import { set } from "react-hook-form";

const Dashboard = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const { sidebarOpen } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [role, setRole] = useState(null);
  function handleSidebarLogout() {
    setShowLogoutModal(true);
  }
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/dashboard");
        console.log("Dashboard Data:", res.data);
        console.log(res.data.role);
        setDashboardData(res.data);
        setRole(res.data.role);
      } catch (err) {
        console.log("Dashboard API Error:", err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <div
        className={
          showLogoutModal
            ? "dashboardHolderDiv blur-sm pointer-events-none h-screen flex flex-col"
            : "h-screen flex flex-col"
        }
      >
        <NavbarDashboard
          userRole={dashboardData?.role}
          userName={dashboardData?.data?.name}
        />

        <div className="flex flex-1 overflow-hidden">
          <SideBarDashboard onLogoutClick={handleSidebarLogout} role={role} />

          <main
            className={`flex-1 h-full overflow-hidden transition-all duration-300`}
          >
            <MainPanelDashboard>
              <Outlet context={{ username: dashboardData?.data?.name }} />
            </MainPanelDashboard>
          </main>
        </div>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-3 dark:text-white">
              Are you sure you want to logout?
            </h2>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 dark:text-white"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
                onClick={async () => {
                  // Call logout API
                  try {
                    await api.post("/api/auth/logout");
                    localStorage.clear();
                    window.location.href = "/LoginPage";
                  } catch (error) {
                    console.error("Logout Error:", error);
                  }
                }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
