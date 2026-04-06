import React from "react";
import AddButton from "../../ui/Buttons/AddButton";
import NavigateBackButton from "../../ui/Buttons/NavigateBackButton";
import { Link } from "react-router-dom";

const ManageUserTemplateAdmin = ({
  user,
  desc,
  searchDesc,
  children,
  addLink,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="wrapperDiv w-full py-2 bg-inherit dark:bg-inherit flex justify-center font-sans text-gray-900 dark:text-white">
      <div className="mainContainer p-6 gap-y-5 w-full max-w-full flex flex-col">
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
        <div
          className="mainContentDiv theme-transition flex flex-col w-full bg-[var(--card-bg)] dark:bg-[var(--card-bg)]
        border-[0.8px] border-[var(--border-light)] dark:border-[var(--border-light)] p-6 rounded-xl gap-y-4"
        >
          <div className="searchAddDiv flex w-full items-center gap-3 flex-wrap overflow-hidden">
            <input
              type="text"
              placeholder={searchDesc}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="custom-input flex-1 px-4 py-2 rounded-xl 
    border-[0.8px] border-[var(--border-light)] 
    focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            />
            <Link to={addLink}>
              <AddButton />
            </Link>
          </div>
          <div className="userListTableDiv w-full overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUserTemplateAdmin;
