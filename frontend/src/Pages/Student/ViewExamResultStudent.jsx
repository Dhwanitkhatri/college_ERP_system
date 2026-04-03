import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { Printer, Download, GraduationCap, User } from "lucide-react";
import api from "../../api/axios";
import { generatePDF } from "../../utils/pdfGenerator";

export default function ViewExamResult() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [examsList, setExamsList] = useState([]); // list of exams from API
  const [selectedExam, setSelectedExam] = useState(null); // the exam data to display
  const [studentInfo, setStudentInfo] = useState(null); // student details from API

  // this ref wraps ONLY the printable marksheet (not the buttons)
  const marksheetRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      academicYear: "",
      semester: "",
    },
  });

  const academicYears = ["2023-24", "2024-25", "2025-26", "2026-27", "2027-28"];
  const semesters = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

  // Handle first form submit (academic year & semester)
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setExamsList([]);
    setSelectedExam(null);
    try {
      const semesterNum = parseInt(data.semester.split(" ")[1]);
      const res = await api.get("/api/student-results/my-results", {
        params: {
          academic_year: data.academicYear,
          semester: semesterNum,
        },
      });

      if (!res.data.success || !res.data.data.length) {
        throw new Error("No results found for the selected period.");
      }

      // The API returns grouped by semester; we expect one semester group.
      const firstSemester = res.data.data[0];
      const exams = firstSemester.exams;

      setExamsList(exams);
      setStudentInfo(res.data.student); // store student info
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle exam selection from dropdown
  const handleExamSelect = (examId) => {
    const exam = examsList.find((ex) => ex.exam_id === examId);
    setSelectedExam(exam);
  };

  // Helper to format exam name for display
  const getExamDisplayName = (exam) => {
    return `${exam.exam_name} (${exam.exam_type})`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!marksheetRef.current || !selectedExam || !studentInfo) return;

    const original = marksheetRef.current;

    // Clone the marksheet so we can tweak styles safely for PDF only
    const cloneWrapper = document.createElement("div");
    cloneWrapper.style.position = "fixed";
    cloneWrapper.style.left = "-9999px";
    cloneWrapper.style.top = "0";
    cloneWrapper.style.backgroundColor = "#ffffff";
    cloneWrapper.style.zIndex = "-1";

    const clonedMarksheet = original.cloneNode(true);
    cloneWrapper.appendChild(clonedMarksheet);
    document.body.appendChild(cloneWrapper);

    await generatePDF(
      cloneWrapper,
      `result_${studentInfo.student_id || "student"}_${
        selectedExam.exam_name || "exam"
      }.pdf`,
      {
        // bit higher scale for clearer text, JPEG for smaller size
        scale: 2.0,
        orientation: "landscape",
        fitToWidth: true,
        imageType: "image/jpeg",
        imageQuality: 0.8,
        singlePage: true,
      }
    );

    document.body.removeChild(cloneWrapper);
  };

  return (
    <DashboardChildPageTemplate
      title="View Examination Result"
      desc="Select academic year and semester to view your grade sheet"
      width="max-w-7xl"
    >
      <div className="pb-20 space-y-6">
        {/* ================= SELECTION FORM ================= */}
        <DashboardChildPageCard>
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Select Academic Year & Semester
            </h3>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Academic Year */}
              <div className="flex-1 form-field !my-0">
                <label className="custom-label">Academic Year</label>
                <select
                  className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                    errors.academicYear ? "border-red-500" : ""
                  }`}
                  {...register("academicYear", { required: "Required" })}
                >
                  <option value="">Select Academic Year</option>
                  {academicYears.map((year, idx) => (
                    <option key={idx} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.academicYear && (
                  <p className="custom-error">
                    {errors.academicYear.message}
                  </p>
                )}
              </div>

              {/* Semester */}
              <div className="flex-1 form-field !my-0">
                <label className="custom-label">Semester</label>
                <select
                  className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                    errors.semester ? "border-red-500" : ""
                  }`}
                  {...register("semester", { required: "Required" })}
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
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-md text-white dark:text-black font-medium bg-black dark:bg-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Loading..." : "Get Exams"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </DashboardChildPageCard>

        {/* ================= EXAM SELECTION (if exams available) ================= */}
        {examsList.length > 0 && !selectedExam && (
          <DashboardChildPageCard>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Select an Exam to View Result
              </h3>
            </div>
            <div className="space-y-2">
              {examsList.map((exam) => (
                <button
                  key={exam.exam_id}
                  onClick={() => handleExamSelect(exam.exam_id)}
                  className="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {getExamDisplayName(exam)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    SGPA: {exam.sgpa} | Result: {exam.result_status}
                  </p>
                </button>
              ))}
            </div>
          </DashboardChildPageCard>
        )}

        {/* ================= RESULT DISPLAY ================= */}
        {selectedExam && studentInfo && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {/* Buttons (not included in PDF capture) */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Printer size={18} />
                Print Marksheet
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>

            {/* ONLY this wrapper is rendered into the PDF */}
            <div ref={marksheetRef}>
              {/* Grade Sheet Container */}
              <div className="bg-white text-black p-2 overflow-x-auto shadow-sm theme-transition">
                <div className="min-w-[900px]">
                  <div className="border-[4px] border-black p-2">
                    <div className="border border-black p-8">
                      {/* Header */}
                      <div className="flex items-center pb-4 mb-6 relative">
                        <div className="w-20 h-20 rounded-full border-[1.5px] border-black flex items-center justify-center flex-shrink-0 absolute left-0 top-0">
                          <GraduationCap
                            size={40}
                            className="text-black"
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="flex-1 text-center px-24">
                          <h1 className="text-[22px] font-sans font-bold uppercase tracking-wide">
                            PRESTIGIOUS INSTITUTE OF TECHNOLOGY
                          </h1>
                          <p className="text-[15px] mt-1 font-medium">
                            Institute of Computer Applications (ICA)
                          </p>
                          <p className="text-[12px] mt-1">
                            Technology Campus, Innovation Drive - University
                            Road, Education City, Techville - 380015
                          </p>
                          <div className="inline-block mt-4 border-y border-black py-1 px-4">
                            <h2 className="text-lg font-bold">
                              Semester Grade Sheet
                            </h2>
                          </div>
                        </div>
                      </div>

                      {/* Course Info Table */}
                      <table className="w-full text-[13px] border-collapse border border-black mb-6">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border border-black py-1.5 px-2 font-bold">
                              COURSE NAME
                            </th>
                            <th className="border border-black py-1.5 px-2 font-bold w-1/4">
                              BRANCH CODE
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-center">
                            <td className="border border-black py-1.5 px-2">
                              {studentInfo.course_id}
                            </td>
                            <td className="border border-black py-1.5 px-2">
                              {studentInfo.course_id}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Student Info & Photo */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="text-[13px] space-y-2 uppercase">
                          <p>
                            <span className="font-bold">NAME :</span>{" "}
                            {studentInfo.student_name}
                          </p>
                          <p>
                            <span className="font-bold">EXAMINATION :</span>{" "}
                            {selectedExam.exam_name} ({selectedExam.exam_type})
                          </p>
                          <p>
                            <span className="font-bold">HELD IN :</span>{" "}
                            {selectedExam.academic_year}
                          </p>
                          <p>
                            <span className="font-bold">SEMESTER :</span>{" "}
                            {selectedExam.semester}
                          </p>

                          <div className="flex gap-12" />
                        </div>
                        <div className="w-24 h-28 border border-black bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                          <User size={48} strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Grades Table */}
                      <table className="w-full text-[13px] border-collapse border border-black mb-6 text-center">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border border-black py-1.5 px-2 font-bold w-32">
                              Course Code
                            </th>
                            <th className="border border-black py-1.5 px-2 font-bold text-left">
                              Course Title
                            </th>
                            <th className="border border-black py-1.5 px-2 font-bold w-24">
                              Credits
                            </th>
                            <th className="border border-black py-1.5 px-2 font-bold w-24">
                              Grade
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedExam.subjects.map((sub, index) => (
                            <tr key={index}>
                              <td className="border border-black py-1 px-2">
                                {sub.subject_id}
                              </td>
                              <td className="border border-black py-1 px-2 text-left">
                                {sub.subject_name}
                              </td>
                              <td className="border border-black py-1 px-2">
                                {sub.credits}
                              </td>
                              <td className="border border-black py-1 px-2 font-semibold">
                                {sub.grade}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Performance Table */}
                      <table className="w-full text-[13px] border-collapse border-[2px] border-black mb-6 text-center">
                        <thead>
                          <tr className="bg-gray-200">
                            <th
                              colSpan="4"
                              className="border border-black py-1.5 px-2 font-bold border-b-[2px]"
                            >
                              Current Semester Performance
                            </th>
                            <th
                              colSpan="5"
                              className="border border-black py-1.5 px-2 font-bold border-b-[2px]"
                            >
                              Cumulative Performance
                            </th>
                          </tr>
                          <tr className="bg-gray-200">
                            <th className="border border-black py-1.5 px-2 font-bold">
                              Total Credits
                            </th>
                            <th className="border border-black py-1.5 px-2 font-bold">
                              Credits Earned
                            </th>
                            <th className="border border-black py-1.5 px-2 font-bold">
                              Grade Points Earned
                            </th>
                            <th className="border border-black py-1.5 px-2 font-bold">
                              SGPA
                            </th>
                            <th className="border border-black py-1.5 px-2 font-bold">
                              Total Credits
                            </th>
                            <th className="border border-black py-1.5 px-2 font-bold">
                              Credits Earned
                            </th>
                            <th className="border border-black py-1.5 px-2 font-bold">
                              Grade Points Earned
                            </th>
                            <th className="border border-black py-1.5 px-2 font-bold">
                              CGPA
                            </th>
                            <th className="border border-black py-1.5 px-2 font-bold">
                              Result
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-black py-1.5 px-2">
                              {selectedExam.total_credits}
                            </td>
                            <td className="border border-black py-1.5 px-2">
                              {selectedExam.earned_credits}
                            </td>
                            <td className="border border-black py-1.5 px-2">
                              {selectedExam.subjects
                                .reduce(
                                  (sum, s) =>
                                    sum + s.grade_point * s.credits,
                                  0
                                )
                                .toFixed(2)}
                            </td>
                            <td className="border border-black py-1.5 px-2 font-bold">
                              {selectedExam.sgpa.toFixed(2)}
                            </td>
                            <td className="border border-black py-1.5 px-2">
                              {selectedExam.total_credits}
                            </td>
                            <td className="border border-black py-1.5 px-2">
                              {selectedExam.earned_credits}
                            </td>
                            <td className="border border-black py-1.5 px-2">
                              {(
                                selectedExam.cgpa *
                                selectedExam.total_credits
                              ).toFixed(2)}
                            </td>
                            <td className="border border-black py-1.5 px-2 font-bold">
                              {selectedExam.cgpa.toFixed(2)}
                            </td>
                            <td className="border border-black py-1.5 px-2 font-bold uppercase">
                              {selectedExam.result_status}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Grade Point System Note */}
                      <div className="border border-black p-3 text-[11px] mb-12">
                        <p className="font-bold mb-1">Grade Point System:</p>
                        <div className="flex justify-between">
                          <p>
                            O+ / O (Outstanding) = 10 | A+ (Excellent) = 9 | A
                            (Very Good) = 8
                          </p>
                          <p>
                            B+ (Good) = 7 | B (Above Average) = 6 | C (Average) =
                            5 | D (Pass) = 4 | F (Fail) = 0
                          </p>
                        </div>
                      </div>

                      {/* Signatures & Footer */}
                      <div className="flex justify-between items-end text-[14px]">
                        <p>
                          <span className="font-bold">Date :</span>{" "}
                          {new Date().toLocaleDateString("en-GB")}
                        </p>
                        <div className="text-center">
                          <div className="w-32 border-b-[1.5px] border-black mb-1" />
                          <p className="font-bold">Registrar</p>
                        </div>
                      </div>

                      <p className="text-center text-[11px] mt-8 pt-4 border-t border-gray-300">
                        This is a computer-generated grade sheet and does not
                        require a physical signature.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardChildPageTemplate>
  );
}