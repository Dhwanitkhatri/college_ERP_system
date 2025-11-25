import React from "react";

const PanelTemplateDashboard = ({ user, desc, children }) => {
  return (
    <div className="mainDashContentDiv bg-[var(--mainPanel-bg-color)] dark:bg-[var(--mainPanel-bg-color)] w-full p-3 border-none">

      {/* HEADER */}
      <div className="DashHeaderDiv p-3">
        <h1 className="text-xl font-medium mb-2 text-black dark:text-white">
          Welcome Back, {user}
        </h1>

        <p className="text-gray-600 dark:text-gray-400">{desc}</p>
      </div>

      {/* CONTENT */}
      <div className="dashContentHolder p-3 flex flex-col gap-6">
        {children} 
      </div>
    </div>
  );
};

export default PanelTemplateDashboard;
