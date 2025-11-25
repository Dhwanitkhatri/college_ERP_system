import React from "react";

const MainPanelDashboard = ({ children }) => {
  return (
    <div className="mainPanelDiv bg-[var(--mainPanel-bg-color)] dark:bg-[var(--mainPanel-bg-color)] w-full p-3 border-none">
      {children}
    </div>
  );
};

export default MainPanelDashboard;
