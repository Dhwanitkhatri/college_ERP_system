import React from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import AddFacultyButton from "../../ui/AddButton";
import CancelButton from "../../ui/CancelButton";
import NavigateBackButton from "../../ui/NavigateBackButton";

const AddClassAdmin = () => {
  return (
    <div className="mainDiv h-full bg-white dark:bg-gray-950 p-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="headerDiv max-w-3xl mx-auto mb-8 flex items-start gap-4">
        <NavigateBackButton />
        <div className="titleDiv">
          <h1 className="text-xl font-bold dark:text-white">Add New Class</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Enter class details to add it to the system
          </p>
        </div>
      </div>
      <div className="formDiv max-w-3xl mx-auto border border-gray-200 dark:border-gray-800 rounded-xl p-8 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200">
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="classYearDiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Class Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter class year (1-6)"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm outline-none 
                focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                dark:bg-gray-950 dark:text-white dark:placeholder-gray-500 
                dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
            />
          </div>
          <div className="sectionDiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Class Section <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter class section (e.g., A, B, C)"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm outline-none 
                focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                dark:bg-gray-950 dark:text-white dark:placeholder-gray-500 
                dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
            />
          </div>
          <div className="courseDiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Course <span className="text-red-500">*</span>
            </label>
            <div className="selectDiv relative">
              <select
                defaultValue=""
                className="w-full appearance-none border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950 outline-none 
                  focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                  dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
              >
                <option value="" disabled>
                  Select course
                </option>
                <option value="cs">Computer Science</option>
                <option value="business">Business Administration</option>
                <option value="engineering">Engineering</option>
              </select>
              <div className="dropDiv absolute right-3 top-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="buttonsDiv flex items-center gap-3 pt-4">
            <AddFacultyButton />
            <CancelButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassAdmin;
