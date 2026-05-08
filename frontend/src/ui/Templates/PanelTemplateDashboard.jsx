import React from "react";

const PanelTemplateDashboard = ({ username, children }) => {
  return (
    <div className="mainDashContentDiv ">

      {/* HEADER */}
      <div className="DashHeaderDiv p-3 pb-0">
        <h1 className="text-xl font-medium mb-2 text-black dark:text-white">
          Welcome Back, {username}
        </h1>
      </div>

      {/* CONTENT */}
      <div className="dashContentHolder p-3 flex flex-col gap-6">
        {children} 
      </div>
    </div>
  );
};

export default PanelTemplateDashboard;
