import React from "react";

const ActionButtonDashboard = ({ label }) => {
  return (
    <div
      className="
        actionButton 
        flex items-center gap-2 w-full px-3 py-1.5 rounded-lg
        bg-black text-white       /* Light mode */
        dark:bg-white dark:text-black  /* Dark mode */
        hover:bg-gray-800 dark:hover:bg-gray-200  /* Hover effect */
        transition
      "
    >
      <button>{label}</button>
    </div>
  );
};

export default ActionButtonDashboard;
