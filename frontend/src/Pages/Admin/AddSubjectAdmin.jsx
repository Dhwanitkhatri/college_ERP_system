import React from "react";
import { ArrowLeft } from "lucide-react";
import AddFacultyButton from "../../ui/AddFacultyButton";
import CancelButton from "../../ui/CancelButton";

const AddSubjectAdmin = () => {
  return (
    <div className="mainDiv min-h-screen bg-white p-8 font-sans text-gray-900">
      <div className="headerDiv max-w-3xl mx-auto mb-8 flex items-start gap-4">
        <button className="mt-1 -ml-1 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="titleDiv">
          <h1 className="text-xl font-bold">Add New Subject</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter Subject details to add it to the system.
          </p>
        </div>
      </div>
      <div className="formDiv max-w-3xl mx-auto border border-gray-200 rounded-xl p-8 bg-white shadow-sm">
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="CourseDiv">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter subject name (e.g., Mathematics , English)"
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm
                        outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400
                        placeholder:text-gray-400"
            />
          </div>
          <div className="buttonDiv flex items-center gap-3 pt-4">
            <AddFacultyButton />
            <CancelButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectAdmin;
