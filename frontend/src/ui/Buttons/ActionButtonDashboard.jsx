import React from "react";

const ActionButtonDashboard = ({ title }) => {
  return (
    <div
      className="
        actionButton 
        flex items-center gap-2 w-full px-3 py-1.5 rounded-lg
        overflow-hidden
        bg-black text-white
        dark:bg-white dark:text-black
        hover:bg-gray-800 dark:hover:bg-gray-200
        transition
      "
    >
      <button>{title}</button>
    </div>
  );
};

export default ActionButtonDashboard;
