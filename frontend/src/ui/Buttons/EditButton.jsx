import React from "react";

const EditButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded 
      bg-[var(--btn-primary-bg)] dark:bg-[var(--btn-primary-bg)] 
      text-[var(--btn-primary-text)] dark:text-[var(--btn-primary-text)]
      hover:bg-[var(--btn-primary-hover)] dark:hover:bg-[var(--btn-primary-hover)]"
    >
      Edit
    </button>
  );
};

export default EditButton;
