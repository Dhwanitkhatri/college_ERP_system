import React from "react";
import AddFacultyButton from "./AddButton";
import NavigateBackButton from "./NavigateBackButton";

const ManageUserTemplateAdmin = ({ user, desc, searchDesc, children }) => {

  return (
    <div className="wrapperDiv w-full py-2 dark:bg-gray-950 flex justify-center font-sans text-gray-900 dark:text-white">
      <div className="mainContainer p-6 gap-y-5 w-full max-w-full sm:max-w-[90%] lg:max-w-[70%] flex flex-col">
        <div className="headerDiv flex gap-x-3 items-center">
          <div className="navigationDiv">
            <NavigateBackButton />
          </div>
          <div className="pageInfo">
            <h1 className="pageTitle text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Manage {user}
            </h1>
            <p className="pageDesc text-gray-500 dark:text-gray-400 text-sm mt-1">
              {desc}
            </p>
          </div>
        </div>
        <div className="mainContentDiv flex flex-col w-full border-2 p-6 rounded-xl gap-y-4">
            <div className="searchAddDiv flex w-full items-center gap-3">
                <input type="text" placeholder={searchDesc} className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"></input>
                <AddFacultyButton />
            </div>
            <div className="userListTableDiv w-full">
                {children}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUserTemplateAdmin;
