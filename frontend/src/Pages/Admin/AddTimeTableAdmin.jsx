import React from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import NavigateBackButton from "../../ui/Buttons/NavigateBackButton";

const AddTimetableAdmin = () => {
  return (
    <div className="mainDiv h-full bg-white dark:bg-gray-950 p-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="headerDiv max-w-3xl mx-auto mb-8 flex items-start gap-4">
        <NavigateBackButton />
        <div className="titleDiv">
          <h1 className="text-xl font-bold dark:text-white">
            Add Timetable Entry
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Schedule a lecture for a specific class
          </p>
        </div>
      </div>
      <div className="formDiv max-w-3xl mx-auto border border-gray-200 dark:border-gray-800 rounded-xl p-8 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200">
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="wrapperDiv">
            <h2 className="text-base font-medium mb-4 dark:text-gray-200">
              Select Class
            </h2>
            <div className="classDiv">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Class <span className="text-red-500">*</span>
              </label>
              <div className="selectClassDiv relative">
                <select
                  defaultValue=""
                  className="w-full appearance-none border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950 outline-none 
                  focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                  dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
                >
                  <option value="" disabled>
                    Select class
                  </option>
                  <option value="classa">Class A</option>
                  <option value="classb">Class B</option>
                  <option value="classc">Class C</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-3 pointer-events-none text-gray-500 dark:text-gray-400"
                />
              </div>
            </div>
          </div>
          <div className="wrapperDiv2">
            <h2 className="text-base font-medium mb-4 mt-2 dark:text-gray-200">
              Lecture Details
            </h2>
            <div className="subjectDiv space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="selectSubjectDiv relative">
                  <select
                    defaultValue=""
                    className="w-full appearance-none border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950 outline-none 
                    focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                    dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
                  >
                    <option value="" disabled>
                      Select subject
                    </option>
                    <option value="stqa">STQA</option>
                    <option value="cc">CC</option>
                    <option value="iot">IOT</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-3 pointer-events-none text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>
              <div className="wrapperDiv3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Faculty <span className="text-red-500">*</span>
                </label>
                <div className="selectFacultyDiv relative">
                  <select
                    defaultValue=""
                    className="w-full appearance-none border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950 outline-none 
                    focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                    dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
                  >
                    <option value="" disabled>
                      Select faculty
                    </option>
                    <option value="aayush">Aayush</option>
                    <option value="jiken">Jiken</option>
                    <option value="dhwanit">Dhwanit</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-3 pointer-events-none text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>
              <div className="gridDiv grid grid-cols-2 gap-4">
                <div className="startTimeDiv">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950 outline-none 
                    focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                    dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
                  />
                </div>
                <div className="endTimeDiv">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950 outline-none 
                    focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                    dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
                  />
                </div>
              </div>
              <div className="dayDiv">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Day <span className="text-red-500">*</span>
                </label>
                <div className="selectDayDiv relative">
                  <select
                    defaultValue=""
                    className="w-full appearance-none border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950 outline-none 
                    focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                    dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
                  >
                    <option value="" disabled>
                      Select day
                    </option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-3 pointer-events-none text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="buttonDiv flex items-center gap-3 pt-4">
            <AddButton />
            <CancelButton />
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddTimetableAdmin;
