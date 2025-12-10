import React from "react";

const MainPanelDashboard = ({ children }) => {
  return (
    <div
      className="
        mainPanelDiv 
        bg-[var(--mainPanel-bg-color)] 
        w-full h-full overflow-auto 
        border-l-[0.8px] 
        border-l-[var(--light-border)]
      "
    >
      {children}
    </div>
  );
};

export default MainPanelDashboard;
