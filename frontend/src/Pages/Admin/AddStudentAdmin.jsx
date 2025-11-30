import React from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import AddFacultyButton from "../../ui/AddButton";
import CancelButton from "../../ui/CancelButton";
import { useNavigate } from "react-router-dom";

const AddStudentAdmin = () => {
  const navigate = useNavigate();
  return (
    <div className="maindiv h-full bg-white dark:bg-gray-950 p-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="headerdiv max-w-3xl mx-auto mb-8 flex items-start gap-4">
        <button
          className="mt-1 -ml-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="titlediv">
          <h1 className="text-xl font-bold dark:text-white">Add New Student</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Fill in the details to add a student to the system.
          </p>
        </div>
      </div>
      <div className="formdiv max-w-3xl mx-auto border border-gray-200 dark:border-gray-800 rounded-xl p-8 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200">
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="fullnamediv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm
                        outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400
                        placeholder:text-gray-400 dark:placeholder-gray-500
                        dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
            />
          </div>
          <div className="dobdiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm
                        text-gray-500 dark:text-gray-300 outline-none focus:border-gray-400 focus:ring-1
                        focus:ring-gray-400 dark:bg-gray-950 dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
            />
          </div>
          <div className="genderdiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Gender <span className="text-red-500">*</span>
            </label>

            <div className="dropdowndiv relative">
              <select
                defaultValue=""
                className="w-full appearance-none border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5
                          text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950 outline-none focus:border-gray-400
                          focus:ring-1 focus:ring-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div className="bellowicondiv absolute right-3 top-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm
                        outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400
                        placeholder:text-gray-400 dark:placeholder-gray-500
                        dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
            />
          </div>

          <div className="buttondiv flex items-center gap-3 pt-4">
            <AddFacultyButton />
            <CancelButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentAdmin;
