import React from "react";

const SaveButton = ({ onClick, type = "submit" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="theme-transition 
      bg-[var(--btn-primary-bg)] 
      text-[var(--btn-primary-text)]
      px-8 py-2.5 rounded-lg text-sm font-medium 
      transition-colors shadow-sm"
    >
      Save Changes
    </button>
  );
};

export default SaveButton;
