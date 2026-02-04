import React from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { Plus, BookOpen, Save } from "lucide-react";

export default function SessionPlanningFaculty() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onFormSubmit = (data) => {
    alert("Validation Successful");
    console.log(data);
  };

  return (
    // Main Template
    <DashboardChildPageTemplate
      title="Session Planning"
      desc="Create and schedule session plans for your lectures"
      width="max-w-7xl"
    >
      <div className="pb-20">
        {/* Form Start */}
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Select class field*/}
              <DashboardChildPageCard>
                <label className="custom-label mb-2">
                  Select Class <span className="text-red-500">*</span>
                </label>
                <select
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  {...register("selectedClass", {
                    required: "Please select a class",
                  })}
                >
                  <option value="">Choose class</option>
                  <option value="CS - Semester 1">SY - BCA - A</option>
                  <option value="CS - Semester 3">SY - BCA - B</option>
                  <option value="CS - Semester 3">SY - BCA - C</option>
                  <option value="CS - Semester 3">SY - BCA - D</option>
                  <option value="CS - Semester 3">SY - BCA - E</option>
                  <option value="CS - Semester 3">SY - BCA - F</option>
                </select>
                {errors.selectedClass && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.selectedClass.message}
                  </p>
                )}
              </DashboardChildPageCard>

              <DashboardChildPageCard>
                {/* Select subject field*/}
                <label className="custom-label mb-2">
                  Select Subject <span className="text-red-500">*</span>
                </label>
                <select
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  {...register("subject", {
                    required: "Please select a subject",
                  })}
                >
                  <option value="">Choose subject</option>
                  <option value="STQA">STQA</option>
                  <option value="IOT">IOT</option>
                  <option value="DSA">CC</option>
                  <option value="CN">SM</option>
                  <option value="DBMS">SMM</option>
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </DashboardChildPageCard>

              <DashboardChildPageCard>
                {/* Lecture number field*/}
                <label className="custom-label mb-2">
                  Lecture Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter lecture number"
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  {...register("lectureNumber", {
                    required: "Lecture number is required",
                  })}
                />
                {errors.lectureNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lectureNumber.message}
                  </p>
                )}
              </DashboardChildPageCard>

              <DashboardChildPageCard>
                {/* select Date field*/}
                <label className="custom-label mb-2">
                  Select Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="custom-input w-full bg-[var(--bg-primary)] theme-transition"
                    {...register("date", { required: "Date is required" })}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.date.message}
                  </p>
                )}
              </DashboardChildPageCard>
            </div>

            <div className="h-full">
              {/* this is the right side part of the design.*/}
              <DashboardChildPageCard className="h-full flex flex-col">
                <div className="mb-6">
                  {/* Add topics field */}
                  <label className="custom-label text-base mb-1">
                    Add Topics <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-[var(--text-light)] mb-4">
                    Add topics to be covered in this lecture
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="custom-input bg-[var(--bg-primary)] theme-transition flex-1 min-w-0"
                      placeholder="Enter topic name"
                    />
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium hover:bg-blue-700 transition-colors shrink-0"
                      style={{ backgroundColor: "#2563EB" }}
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  </div>
                </div>

                {/* no topics part is just only the design only visual*/}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[var(--border-light)] rounded-lg">
                  <BookOpen
                    size={48}
                    className="text-[var(--text-light)] mb-3 opacity-50"
                  />
                  <p className="text-[var(--text-muted)] font-medium">
                    No topics added yet
                  </p>
                  <p className="text-sm text-[var(--text-light)]">
                    Add topics to be covered in this lecture
                  </p>
                </div>
              </DashboardChildPageCard>
            </div>
          </div>

          {/* this is the buttons part*/}
          <div className="flex flex-wrap justify-end gap-4 mt-4">
            {/* Reset and Submit buttons */}
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg text-sm font-medium border theme-transition hover:bg-gray-50 dark:hover:bg-gray-800"
              style={{
                borderColor: "var(--border-medium)",
                color: "var(--text-primary)",
              }}
            >
              Reset Form
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--btn-primary-bg)",
                color: "var(--btn-primary-text)",
              }}
            >
              <Save size={18} />
              Create Session Plan
            </button>
          </div>
        </form>
      </div>
    </DashboardChildPageTemplate>
  );
}
