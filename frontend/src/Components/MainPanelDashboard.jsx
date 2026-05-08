import React from "react";

const MainPanelDashboard = ({ children }) => {
  return (
    <div
      className="
        mainPanelDiv 
        theme-transition
        bg-[var(--bg-secondary)] 
        dark:bg-[var(--bg-secondary)]
        w-full h-full overflow-auto 
        p-4
      "
    >
      {children}
    </div>
  );
};

export default MainPanelDashboard;
