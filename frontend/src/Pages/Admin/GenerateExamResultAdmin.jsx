import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FileText } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios";

export default function GenerateResult() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      semester: "",
      academicYear: "",
      examType: "",
      student: "",
    },
  });

  const selectedSemester = watch("semester");
  const selectedAcademicYear = watch("academicYear");
  const selectedStudent = watch("student");

  // Fetch students when semester and academic year are selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedSemester || !selectedAcademicYear) {
        setStudentsList([]);
        return;
      }

      setLoadingStudents(true);
      try {
        // Extract semester number from string (e.g., "Semester 6" -> 6)
        const semesterNum = parseInt(selectedSemester.match(/\d+/)[0]);
        const response = await api.get("/api/students", {
          params: {
            semester: semesterNum,
            academic_year: selectedAcademicYear,
          },
        });
        if (response.data.success) {
          setStudentsList(response.data.data);
        } else {
          setStudentsList([]);
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setStudentsList([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedSemester, selectedAcademicYear]);

  // Helper to convert semester string to number
  const getSemesterNumber = (semesterStr) => {
    const match = semesterStr.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  };

  // Fetch exam_id based on filters
  const fetchExamId = async (academicYear, semesterNum, examType) => {
    const response = await api.get("/api/exams", {
      params: {
        academic_year: academicYear,
        semester: semesterNum,
        exam_type: examType,
      },
    });
    console.log("Exam fetch response:", response.data);
    if (!response.data.success || response.data.data.length === 0) {
      throw new Error(`No exam found for ${examType} in ${academicYear} Semester ${semesterNum}`);
    }
    // Return the first matching exam (assume one exam per type per semester)
    return response.data.data[0].exam_id;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const semesterNum = getSemesterNumber(data.semester);
      if (!semesterNum) throw new Error("Invalid semester selected");

      // Step 1: Get exam_id
      const exam_id = await fetchExamId(data.academicYear, semesterNum, data.examType);

      // Step 2: Call result generation API
      let response;
      if (data.student) {
        // Extract student_id from the selected value (format: "student_id - name")
        const studentId = data.student.split(" - ")[0];
        response = await api.post("/api/results", {
          student_id: studentId,
          exam_id: exam_id,
        });
      } else {
        // Bulk generation
        response = await api.post("/api/results/all", {
          exam_id: exam_id,
          semester: semesterNum,
        });
      }

      const resData = response.data;
      if (resData.success) {
        if (data.student) {
          setMessage(` Result generated successfully for ${data.student}`);
        } else {
          setMessage(
            `✅ Bulk results generated: ${resData.summary.generated} generated, ${resData.summary.skipped} skipped, ${resData.summary.failed} failed`
          );
        }
      } else {
        throw new Error(resData.message || "Result generation failed");
      }
    } catch (err) {
      console.error("Result generation error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors) => {
    console.error("Form Validation Failed!", errors);
  };

  // Static options
  const academicYears = ["2023-24", "2024-25", "2025-26", "2026-27", "2027-28"];
  const semesters = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);
  const examTypes = ["REGULAR", "RE-EXAM", "BACKLOG"];

 
  return (
    <DashboardChildPageTemplate
      title="Generate Result"
      desc="Generate examination results for students"
      width="max-w-7xl"
    >
      <DashboardChildPageCard>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate className="flex flex-col gap-6">
          {/* Semester */}
          <div className="form-field !my-0">
            <label className="custom-label">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                errors.semester ? "border-red-500" : ""
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
            {errors.semester && <p className="custom-error">{errors.semester.message}</p>}
          </div>

          {/* Academic Year */}
          <div className="form-field !my-0">
            <label className="custom-label">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <select
              className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                errors.academicYear ? "border-red-500" : ""
              }`}
              {...register("academicYear", { required: "Academic Year is required" })}
            >
              <option value="">Select academic year</option>
              {academicYears.map((year, idx) => (
                <option key={idx} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.academicYear && <p className="custom-error">{errors.academicYear.message}</p>}
          </div>

          {/* Exam Type */}
          <div className="form-field !my-0">
            <label className="custom-label">
              Exam Type <span className="text-red-500">*</span>
            </label>
            <select
              className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                errors.examType ? "border-red-500" : ""
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
            {errors.examType && <p className="custom-error">{errors.examType.message}</p>}
          </div>

          {/* Student (Optional) */}
          <div className="form-field !my-0">
            <label className="custom-label flex items-center gap-1.5">
              Select Student{" "}
              <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
            </label>
            <select
              className="custom-input bg-[var(--bg-primary)] theme-transition"
              {...register("student")}
              disabled={loadingStudents}
            >
              <option value="">Select student (leave empty for all students)</option>
              {studentsList.map((student) => (
                <option key={student.student_id} value={`${student.student_id} - ${student.name}`}>
                  {student.name} ({student.student_id})
                </option>
              ))}
            </select>
            {loadingStudents && (
              <p className="text-sm text-gray-500 mt-1">Loading students...</p>
            )}
            {selectedStudent && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1.5 animate-in fade-in">
                ✅ Result will be generated only for the selected student
              </p>
            )}
          </div>

          {/* Message and Error */}
          {message && (
            <div className="p-3 rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              {loading ? "Generating..." : "Generate Result"}
            </button>
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
}