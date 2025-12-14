import React from "react";

const ActionButtonDashboard = ({ title }) => {
  return (
    <div
      className="
        actionButton theme-transition
        flex items-center gap-2 w-full px-3 py-1.5 rounded-lg
        overflow-hidden
        bg-[var(--btn-primary-bg)] dark:bg-[var(--btn-primary-bg)] 
        text-[var(--btn-primary-text)] dark:text-[var(--btn-primary-text)]
        hover-[var(--btn-primary-hover)] dark:hover-[var(--btn-primary-hover)]
        transition
      "
    >
      <button>{title}</button>
    </div>
  );
};

export default ActionButtonDashboard;
