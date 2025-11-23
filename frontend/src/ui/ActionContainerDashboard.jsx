import React from "react";
import ActionButtonDashboard from "./ActionButtonDashboard";

const ActionContainerDashboard = () => {
  return (
    <div className="actionContainer border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm p-5 m-3 flex-1 min-w-[280px] sm:min-w-[300px] lg:min-w-[420px]">
      
      <div className="actionTitle mb-3">
        <h3 className="font-semibold text-lg text-black dark:text-white">[Action Tile]</h3>
      </div>

      <div className="actionButtonHolder grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ActionButtonDashboard label="Action 1" />
        <ActionButtonDashboard label="Action 2" />
        <ActionButtonDashboard label="Action 3" />
        <ActionButtonDashboard label="Action 4" />
        <ActionButtonDashboard label="Action 5" />
        <ActionButtonDashboard label="Action 6" />
      </div>

    </div>
  );
};

export default ActionContainerDashboard;
