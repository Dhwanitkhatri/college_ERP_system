import React from "react";
import { useForm } from "react-hook-form";
import { FileText } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";

export default function GenerateResult() {
  {
    /* this is the react hook form part */
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      semester: "",
      examType: "External Exam",
      student: "",
    },
  });

  {
    /* watching the student field to show the dynamic helper text */
  }
  const selectedStudent = watch("student");

  {
    /* this is the submit function part which triggers the native alert */
  }
  const onSubmit = (data) => {
    // This console log will prove the button works in your browser's Developer Tools (F12)
    console.log("Form Submitted Successfully with data:", data);

    let alertMessage = "";

    if (data.student) {
      // Individual Generation Message
      alertMessage = `Result generated successfully for ${data.student} - ${data.semester} - ${data.examType}`;
    } else {
      // Bulk Generation Message
      alertMessage = `Result generated successfully for entire ${data.semester} - ${data.examType}`;
    }

    // Triggering the standard browser alert
    alert(alertMessage);
  };

  {
    /* this catches any hidden errors blocking the form from submitting */
  }
  const onError = (errors) => {
    console.error("Form Validation Failed! Check these errors:", errors);
  };

  // this is the dummy data for the dropdowns
  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ];
  const examTypes = ["Internal Exam", "External Exam", "Remedial / ATKT"];
  const students = [
    "23CI2010001 - Emily Carter",
    "23CI2010002 - John Doe",
    "23CI2010003 - Sarah Smith",
  ];

  {
    /* the main designing part start from here */
  }
  return (
    <DashboardChildPageTemplate
      title="Generate Result"
      desc="Generate examination results for students"
      width="max-w-7xl"
    >
      <DashboardChildPageCard>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          className="flex flex-col gap-6"
        >
          {/* this is the semester part */}
          <div className="form-field !my-0">
            <label className="custom-label">Semester</label>
            <select
              className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                errors.semester
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              {...register("semester", { required: "Semester is required" })}
            >
              <option value="">Select semester</option>
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

          {/* this is the exam type part */}
          <div className="form-field !my-0">
            <label className="custom-label">Exam Type</label>
            <select
              className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                errors.examType
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              {...register("examType", { required: "Exam Type is required" })}
            >
              <option value="">Select exam type</option>
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

          {/* this is the select student part */}
          <div className="form-field !my-0">
            <label className="custom-label flex items-center gap-1.5">
              Select Student{" "}
              <span className="text-gray-400 dark:text-gray-500 font-normal">
                (Optional)
              </span>
            </label>
            <select
              className="custom-input bg-[var(--bg-primary)] theme-transition"
              {...register("student")}
            >
              <option value="">
                Select student (leave empty for all students)
              </option>
              {students.map((student, idx) => (
                <option key={idx} value={student}>
                  {student}
                </option>
              ))}
            </select>

            {/* dynamic helper text only shows when a student is selected */}
            {selectedStudent && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 animate-in fade-in">
                Result will be generated only for the selected student
              </p>
            )}
          </div>

          {/* below is the action button of the generate result */}
          <div className="form-actions">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              <FileText className="w-4 h-4" />
              Generate Result
            </button>
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
}
