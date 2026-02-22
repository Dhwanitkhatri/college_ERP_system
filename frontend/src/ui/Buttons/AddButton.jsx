import React from 'react';

const AddButton = ({ text = "Add" }) => {
  return (
    <button 
      type="submit" 
      className="theme-transition 
      bg-[var(--btn-primary-bg)] dark:bg-[var(--btn-primary-bg)] 
      text-[var(--btn-primary-text)] dark:text-[var(--btn-primary-text)]
      hover:bg-[var(--btn-primary-hover)] dark:hover:bg-[var(--btn-primary-hover)]
      overflow-hidden px-8 py-2.5 rounded-lg text-sm font-medium 
      transition-colors shadow-sm"
    >
      {text}
    </button>
  );
};

export default AddButton;