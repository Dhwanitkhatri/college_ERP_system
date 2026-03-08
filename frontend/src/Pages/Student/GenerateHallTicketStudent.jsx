import React from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";

export default function GenerateHallTicket() {
    {/* this is the react hook form part*/}
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      academicYear: "",
      semester: "",
      examId: "",
      examType: "",
    },
  });

  {/* */}
  const onSubmit = (data) => {
    console.log("Generate Hall Ticket Data:", data);
  };

  // this is the dummy data for the dropdowns
  const academicYears = ["2023-24", "2024-25", "2025-26"];
  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
  ];
  const examIds = ["EXAM-WIN-2023", "EXAM-SPR-2024", "EXAM-WIN-2024"];
  const examTypes = ["Regular", "Remedial / ATKT", "Internal"];
  {/* the main designing part start from here*/}
  return (
    <DashboardChildPageTemplate
      title="Generate Hall Ticket"
      desc="Select exam details to generate your hall ticket"
      width="max-w-7xl"
    >
      <DashboardChildPageCard>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* this is the heading part of the page*/}
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-6">
            Exam Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* this is the academic year part */}
            <div className="form-field !my-0">
              <label className="custom-label">
                Academic Year
              </label>
              <select
                className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                  errors.academicYear
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                {...register("academicYear", {
                  required: "Academic Year is required",
                })}
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((year, idx) => (
                  <option key={idx} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.academicYear && (
                <p className="custom-error">{errors.academicYear.message}</p>
              )}
            </div>

            {/* this is the semester part */}
            <div className="form-field !my-0">
              <label className="custom-label">
                Semester
              </label>
              <select
                className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                  errors.semester
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                {...register("semester", { required: "Semester is required" })}
              >
                <option value="">Select Semester</option>
                {semesters.map((sem, idx) => (
                  <option key={idx} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
              {errors.semester && (
                <p className="custom-error">{errors.semester.message}</p>
              )}
            </div>

            {/* this is the exam ID part */}
            <div className="form-field !my-0">
              <label className="custom-label">
                Exam ID
              </label>
              <select
                className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                  errors.examId
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                {...register("examId", { required: "Exam ID is required" })}
              >
                <option value="">Select Exam ID</option>
                {examIds.map((id, idx) => (
                  <option key={idx} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              {errors.examId && (
                <p className="custom-error">{errors.examId.message}</p>
              )}
            </div>

            {/* this is the exam type part */}
            <div className="form-field !my-0">
              <label className="custom-label">
                Exam Type
              </label>
              <select
                className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                  errors.examType
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                {...register("examType", { required: "Exam Type is required" })}
              >
                <option value="">Select Exam Type</option>
                {examTypes.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.examType && (
                <p className="custom-error">{errors.examType.message}</p>
              )}
            </div>
          </div>

          {/* below is the action button of the generate hall ticket*/}
          <div className="mt-8">
            <button
              type="submit"
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Generate Hall Ticket
            </button>
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
}
