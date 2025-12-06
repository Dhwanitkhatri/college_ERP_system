import React from "react";
import { ArrowLeft } from "lucide-react";

import AddFacultyButton from "../../ui/AddButton";
import CancelButton from "../../ui/CancelButton";
import { useNavigate } from "react-router-dom";

const AddFacultyAdmin = () => {
  const navigate = useNavigate();
  return (
    <div
      className="
        wrapperDiv min-h-full w-full
        bg-white dark:bg-gray-950 
        p-3 md:p-6 font-sans 
        text-gray-900 dark:text-white
      "
    >
      <div className="mainContainer max-w-3xl mx-auto mb-8">
        <div className="firstDiv flex items-start gap-4">
          <button
            className="
              p-2 -ml-2
              text-gray-500 dark:text-gray-400 
              hover:bg-gray-100 dark:hover:bg-gray-800 
              rounded-full transition-colors
            "
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="titleText">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Add New Faculty
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Enter faculty member details to add them to the system
            </p>
          </div>
        </div>
      </div>

      <div
        className="
          formDiv max-w-3xl mx-auto 
          border border-gray-200 dark:border-gray-800 
          rounded-xl p-8 
          shadow-[0_2px_8px_rgba(0,0,0,0.04)] 
          bg-white dark:bg-gray-900
        "
      >
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

          {/* Full Name */}
          <div className="fullNameDiv space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="
                w-full border border-gray-200 dark:border-gray-700 
                rounded-lg px-4 py-3 
                text-sm 
                text-gray-900 dark:text-white
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none 
                focus:border-gray-400 dark:focus:border-gray-500 
                focus:ring-1 
                focus:ring-gray-400 dark:focus:ring-gray-500 
                transition-all shadow-sm
                bg-white dark:bg-gray-900
              "
            />
          </div>

          {/* Phone Number */}
          <div className="phoneNumberDiv space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="Enter 10-digit phone number"
              className="
                w-full border border-gray-200 dark:border-gray-700 
                rounded-lg px-4 py-3 
                text-sm 
                text-gray-900 dark:text-white
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none 
                focus:border-gray-400 dark:focus:border-gray-500 
                focus:ring-1 
                focus:ring-gray-400 dark:focus:ring-gray-500 
                transition-all shadow-sm
                bg-white dark:bg-gray-900
              "
            />
          </div>

          {/* Email Address */}
          <div className="emailDiv space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              className="
                w-full border border-gray-200 dark:border-gray-700 
                rounded-lg px-4 py-3 
                text-sm 
                text-gray-900 dark:text-white
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none 
                focus:border-gray-400 dark:focus:border-gray-500 
                focus:ring-1 
                focus:ring-gray-400 dark:focus:ring-gray-500 
                transition-all shadow-sm
                bg-white dark:bg-gray-900
              "
            />
          </div>

          <div className="buttonDiv flex items-center gap-3 mt-8 flex-wrap">
            <AddFacultyButton />
            <CancelButton />
          </div>
        </form>
      </div>
    </div>
  );
};


export default AddFacultyAdmin;
