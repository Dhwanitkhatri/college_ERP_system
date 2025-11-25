import React from "react";

const DashContentPanelDashboard = ({ children }) => {
  return (
    <div className="DashContentDiv flex flex-wrap gap-3 w-full">
      {children}
    </div>
  );
};

export default DashContentPanelDashboard;
