import React from "react";

const AddButton = ({ text = "Add", disabled = false }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`theme-transition 
      bg-[var(--btn-primary-bg)] dark:bg-[var(--btn-primary-bg)] 
      text-[var(--btn-primary-text)] dark:text-[var(--btn-primary-text)]
      overflow-hidden px-8 py-2.5 rounded-lg text-sm font-medium 
      transition-colors shadow-sm flex items-center justify-center gap-2
      
      ${
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:bg-[var(--btn-primary-hover)] dark:hover:bg-[var(--btn-primary-hover)]"
      }
      `}
    >
      {disabled ? (
        <>
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Adding...
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default AddButton;