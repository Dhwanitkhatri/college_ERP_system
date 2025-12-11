import React from "react";
import NavigateBackButton from "../Buttons/NavigateBackButton";
const DashboardChildPageTemplate = ({title,desc,children}) => {
  return (
    <div
      className="mainDiv min-h-screen bg-white dark:bg-gray-950 p-8 font-sans text-gray-900
     dark:text-gray-100 transition-colors duration-200"
    >
      <div className="headerDiv max-w-3xl mx-auto mb-8 flex items-start gap-4">
        <NavigateBackButton />
        <div className="titleDiv">
          <h1 className="text-xl font-bold dark:text-white">{title}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {desc}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default DashboardChildPageTemplate;
