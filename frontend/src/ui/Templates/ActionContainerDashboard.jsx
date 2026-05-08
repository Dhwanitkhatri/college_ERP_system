import React from "react";

const ActionContainerDashboard = ({ title, children }) => {
  return (
    <div
      className=" theme-transition
        border-[0.8px] border-[var(--border-light)] dark:border-[var(--border-light)] rounded-xl
        bg-[var(--card-bg)] dark:bg-[var(--card-bg)] shadow-sm p-5
        w-full 
      "
    >
      <h3 className="font-semibold text-lg text-black dark:text-white mb-4">
        {title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
};

export default ActionContainerDashboard;
