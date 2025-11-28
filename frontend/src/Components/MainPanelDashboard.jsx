import React from "react";

const MainPanelDashboard = ({ children }) => {
  return (
    <div className="mainPanelDiv bg-[var(--mainPanel-bg-color)] dark:bg-[var(--mainPanel-bg-color)] w-full h-full p-3 overflow-auto 
    border-l-[0.8px] border-l-[var(--light-border)] dark:border-gray-700">
      {children}
    </div>
  );
};

export default MainPanelDashboard;
