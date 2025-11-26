import React from "react";

const ActionContainerDashboard = ({ title, children }) => {
  return (
    <div className="actionContainer border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm p-5 m-2 flex-1 min-w-[280px] sm:min-w-[300px] lg:min-w-[420px]">

      <h3 className="font-semibold text-lg text-black dark:text-white mb-3">
        {title}
      </h3>

      <div className="actionButtonHolder grid grid-cols-1 sm:grid-cols-2 gap-3">
        {children}
      </div>

    </div>
  );
};

export default ActionContainerDashboard;
