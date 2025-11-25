import React from "react";
import { ArrowLeft } from "lucide-react";

import AddFacultyButton from "../../ui/AddFacultyButton";
import CancelButton from "../../ui/CancelButton";

const AddFacultyAdmin = () => {
  return (
    <div className="wrapperDiv min-h-screen bg-white p-6 md:p-12 font-sans text-gray-900">
      <div className="mainContainer max-w-3xl mx-auto mb-8">
        <div className="firstDiv flex items-start gap-4">
          <button className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="titleText">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Add New Faculty
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Enter faculty member details to add them to the system
            </p>
          </div>
        </div>
      </div>
      <div className="formDiv max-w-3xl mx-auto border border-gray-200 rounded-xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="fullNameDiv space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all shadow-sm"
            />
          </div>
          <div className="phoneNumberDiv space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="Enter 10-digit phone number"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all shadow-sm"
            />
          </div>
          <div className="emailDiv space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all shadow-sm"
            />
          </div>

          <div className="buttonDiv flex items-center gap-3 mt-8">
            <AddFacultyButton />
            <CancelButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFacultyAdmin;
