import React from "react";

const ActionContainerDashboard = ({ title, children }) => {
  return (
    <div
      className="
        border border-gray-200 dark:border-gray-700 rounded-xl
        bg-white dark:bg-gray-800 shadow-sm p-5
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
