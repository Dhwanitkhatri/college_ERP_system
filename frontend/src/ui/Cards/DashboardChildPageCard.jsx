import React from 'react'

const DashboardChildPageCard = ({ children, className = "" }) => {
  return (
    <div
      className={`
        theme-transition
        border border-gray-200 dark:border-gray-800
        rounded-xl
        p-8
        bg-white dark:bg-gray-900
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
};


export default DashboardChildPageCard