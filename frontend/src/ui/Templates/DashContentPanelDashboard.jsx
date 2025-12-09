import React from "react";

const DashContentPanelDashboard = ({ children }) => {
  return (
    <div className="DashContentDiv grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 auto-rows-max">
      {children}
    </div>
  );
};

export default DashContentPanelDashboard;
