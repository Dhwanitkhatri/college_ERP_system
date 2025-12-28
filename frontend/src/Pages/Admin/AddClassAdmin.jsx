import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import NavigateBackButton from "../../ui/Buttons/NavigateBackButton";


const AddClassAdmin = () => {

  const [selectedYear, setSelectedYear] = useState("");
  const semesterMap = {
    FY: ["1", "2"],
    SY: ["3", "4"],
    TY: ["5", "6"],
    LY: ["7", "8"],
  };
  const currentSemesters = semesterMap[selectedYear] || [];

  

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
              Select Year <span className="text-red-500">*</span>
            </label>
            <div className="selectDiv relative">
              <select
                defaultValue=""
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full appearance-none border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950 outline-none 
                  focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                  dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
              >
                <option value="" disabled>
                  Select course
                </option>
                <option value="FY">First Year</option>
                <option value="SY">Second Year</option>
                <option value="TY">Third Year</option>
                <option value="LY">Fourth Year</option>
              </select>
              <div className="dropDiv absolute right-3 top-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          <div className="sectionDiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Select Semester <span className="text-red-500">*</span>
            </label>
            <div className="selectDiv relative">
              <select
                defaultValue=""
                disabled={!selectedYear}
                className="w-full appearance-none border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950 outline-none 
                  focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                  dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {selectedYear ? "Select Semester" : "Select Year First"}
                </option>
                {currentSemesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
              <div className="dropDiv absolute right-3 top-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="courseDiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Section <span className="text-red-500">*</span>
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
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
              <div className="dropDiv absolute right-3 top-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="courseDiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Academic year <span className="text-red-500">*</span>
            </label>
            <div className="selectDiv relative">
              <select
                defaultValue=""
                className="w-full appearance-none border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950 outline-none 
                  focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                  dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
              >
                <option value="" disabled>
                  Select Academic Year
                </option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
                <option value="2027-28">2027-28</option>
                <option value="2028-29">2028-29</option>
                <option value="2029-30">2029-30</option>
                <option value="2030-31">2030-31</option>
                <option value="2031-32">2031-32</option>
                <option value="2032-33">2032-33</option>
                <option value="2033-34">2033-34</option>
                <option value="2034-35">2034-35</option>
                <option value="2035-36">2035-36</option>
              </select>
              <div className="dropDiv absolute right-3 top-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="buttonsDiv flex items-center gap-3 pt-4">
            <AddButton />
            <CancelButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassAdmin;
