import React from "react";

const CancelButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cancelButton 
      bg-[var(--card-bg)] dark:bg-[var(--card-bg)] 
      border-2 border-[var(--border-light)] dark:border-[var(--border-light)] 
      text-[var(--text-secondary)] dark:text-[var(--text-secondary)] 
      px-8 py-2.5 rounded-lg text-sm font-medium
      hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
    >
      Cancel
    </button>
  );
};

export default CancelButton;