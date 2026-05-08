import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Download, Printer, GraduationCap, User } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios";
import { generatePDF } from "../../utils/pdfGenerator";

export default function GenerateHallTicket() {
  /* ========================================================= */
  /* STRICTLY PRESERVING YOUR FRIEND'S BACKEND LOGIC EXACTLY   */
  /* ========================================================= */

  const [isTicketGenerated, setIsTicketGenerated] = useState(false);
  const [examIds, setExamIds] = useState([]);
  const [hallTicket, setHallTicket] = useState(null);

  // Ref ONLY for the printable ticket (NOT the buttons)
  const hallTicketRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      academicYear: "",
      semester: "",
      examId: "",
      examType: "",
    },
  });

  const watchAcademicYear = watch("academicYear");
  const watchSemester = watch("semester");
  const watchExamType = watch("examType");

  /* Fetch exams when dropdown changes */
  useEffect(() => {
    const fetchExams = async () => {
      if (!watchAcademicYear || !watchSemester || !watchExamType) return;
      try {
        const res = await api.get("/api/hall-tickets/get-exam-for-hallticket", {
          params: {
            academic_year: watchAcademicYear,
            semester: watchSemester,
            exam_type: watchExamType,
          },
        });
        setExamIds(res.data.data || []);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };
    fetchExams();
  }, [watchAcademicYear, watchSemester, watchExamType]);

  /* Generate hall ticket */
  const onSubmit = async (data) => {
    try {
      const res = await api.get("/api/hall-tickets/my", {
        params: {
          academic_year: data.academicYear,
          semester: data.semester,
          exam_type: data.examType,
          exam_id: data.examId,
        },
      });
      const ticket = res.data.data?.[0];
      setHallTicket(ticket);
      setIsTicketGenerated(true);
    } catch (error) {
      console.error("Error generating hall ticket:", error);
    }
  };

  /* Static dropdown data kept exactly as your friend wrote it */
  const academicYears = ["2023-24", "2024-25", "2025-26"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const examTypes = ["REGULAR", "Remedial / ATKT", "Internal"];
  /* ========================================================= */

  const handleDownload = async () => {
    if (!hallTicketRef.current) return;

    const originalContainer = hallTicketRef.current;

    // Clone the ticket card so we can safely tweak styles only for PDF
    const cloneWrapper = document.createElement("div");
    cloneWrapper.style.position = "fixed";
    cloneWrapper.style.left = "-9999px";
    cloneWrapper.style.top = "0";
    cloneWrapper.style.backgroundColor = "#ffffff";
    cloneWrapper.style.zIndex = "-1";

    const clonedTicket = originalContainer.cloneNode(true);

    // If schedule ever gets its own scroll wrapper, remove its limits too
    const clonedTableWrapper = clonedTicket.querySelector(".table-wrapper");
    if (clonedTableWrapper) {
      clonedTableWrapper.style.maxHeight = "none";
      clonedTableWrapper.style.overflowY = "visible";
      clonedTableWrapper.style.overflowX = "visible";
      clonedTableWrapper.style.width = "auto";
    }

    cloneWrapper.appendChild(clonedTicket);
    document.body.appendChild(cloneWrapper);

    await generatePDF(
      cloneWrapper,
      `hallticket_${hallTicket?.student?.student_id || "student"}_${
        hallTicket?.exam?.name || "exam"
      }.pdf`,
      {
        // Slightly higher scale for sharper text, still not huge file
        scale: 2.3,
        orientation: "portrait",
        fitToWidth: true,
        imageType: "image/jpeg",
        imageQuality: 0.8,
      }
    );

    document.body.removeChild(cloneWrapper);
  };

  /* the main designing part start from here */
  return (
    <DashboardChildPageTemplate
      title="Generate Hall Ticket"
      desc="Select exam details to generate your hall ticket"
      width="max-w-7xl"
    >
      <div className="flex flex-col gap-6">
        {/* ================= FORM UI ================= */}
        <DashboardChildPageCard>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-6">
              Exam Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Academic Year */}
              <div className="form-field !my-0">
                <label className="custom-label">
                  Academic Year <span className="text-red-500">*</span>
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

              {/* Semester */}
              <div className="form-field !my-0">
                <label className="custom-label">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                    errors.semester
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  {...register("semester", {
                    required: "Semester is required",
                  })}
                >
                  <option value="">Select Semester</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
                {errors.semester && (
                  <p className="custom-error">{errors.semester.message}</p>
                )}
              </div>

              {/* Exam Type */}
              <div className="form-field !my-0">
                <label className="custom-label">
                  Exam Type <span className="text-red-500">*</span>
                </label>
                <select
                  className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                    errors.examType
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  {...register("examType", {
                    required: "Exam Type is required",
                  })}
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

              {/* Exam ID */}
              <div className="form-field !my-0">
                <label className="custom-label">
                  Exam ID <span className="text-red-500">*</span>
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
                  {examIds.map((exam) => (
                    <option key={exam.exam_id} value={exam.exam_id}>
                      {exam.name}
                    </option>
                  ))}
                </select>
                {errors.examId && (
                  <p className="custom-error">{errors.examId.message}</p>
                )}
              </div>
            </div>

            {/* action button */}
            <div className="form-actions mt-8">
              <button
                type="submit"
                className="px-6 py-2 rounded-md text-white dark:text-black font-medium bg-black dark:bg-white hover:opacity-90 transition-opacity"
              >
                Generate Hall Ticket
              </button>
            </div>
          </form>
        </DashboardChildPageCard>

        {/* ================= HALL TICKET DESIGN ================= */}
        {isTicketGenerated && hallTicket && (
          <div className="animate-in fade-in duration-500 flex flex-col gap-4">
            {/* Action buttons (NOT part of captured area) */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Printer size={18} />
                Print Hall Ticket
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>

            {/* ONLY this wrapper is rendered to PDF */}
            <div ref={hallTicketRef}>
              {/* Hall ticket container with strict black border */}
              <div className="bg-white dark:bg-gray-900 border-[3px] border-black dark:border-gray-500 rounded-lg p-8 md:p-12 mt-2 shadow-sm">
                {/* Institute Header */}
                <div className="flex flex-col md:flex-row items-center relative pb-2 min-h-[100px]">
                  <div className="md:absolute left-0 top-0 w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4 md:mb-0">
                    <GraduationCap className="w-10 h-10 text-white dark:text-black" />
                  </div>

                  <div className="flex flex-col items-center text-center w-full px-2">
                    <h1 className="text-[22px] font-bold text-black dark:text-white uppercase tracking-wide leading-tight">
                      PRESTIGIOUS INSTITUTE OF TECHNOLOGY
                    </h1>
                    <p className="text-[15px] font-medium text-black dark:text-gray-300 mt-1">
                      Affiliated to State University
                    </p>

                    <div className="mt-4 mb-3 inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-1 text-lg font-bold tracking-wider uppercase">
                      HALL TICKET
                    </div>

                    <p className="text-[15px] font-bold text-black dark:text-gray-200 uppercase">
                      EXAMINATION HELD IN: {hallTicket.student.academic_year}
                    </p>
                  </div>
                </div>

                {/* Student Details Grid */}
                <div className="flex justify-between items-start border-t border-b border-gray-300 dark:border-gray-700 py-6 my-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 w-full md:w-3/4 text-sm text-black dark:text-white">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-0.5">
                        Exam Name:
                      </span>
                      <span className="font-medium">
                        {hallTicket.exam.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-0.5">
                        Enrollment Number:
                      </span>
                      <span className="font-medium">
                        {hallTicket.student.student_id}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-0.5">
                        Class & Section:
                      </span>
                      <span className="font-medium">
                        {hallTicket.student.class} -{" "}
                        {hallTicket.student.section}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-0.5">
                        Student Name:
                      </span>
                      <span className="font-medium">
                        {hallTicket.student.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-0.5">
                        Semester:
                      </span>
                      <span className="font-medium">
                        {hallTicket.exam.semester}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-0.5">
                        Exam Type:
                      </span>
                      <span className="font-medium">
                        {hallTicket.exam.exam_type}
                      </span>
                    </div>
                  </div>

                  {/* Photo Placeholder */}
                  <div className="hidden md:flex w-28 h-36 border border-gray-400 bg-gray-50 dark:bg-gray-800 items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                </div>

                {/* Examination Schedule Table */}
                <div className="mb-8">
                  <h3 className="text-[15px] text-black dark:text-white mb-3 font-semibold">
                    Examination Schedule
                  </h3>
                  <div className="table-wrapper overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full text-sm border-collapse border border-gray-300 dark:border-gray-600">
                      <thead className="bg-[#E9EDF1] dark:bg-gray-800 text-black dark:text-white font-bold">
                        <tr>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left">
                            Sr. No.
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left">
                            Subject Code
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left">
                            Subject Name
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left">
                            Credits
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left">
                            Exam Date
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left">
                            Exam Time
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left">
                            Supervisor Sign
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-black dark:text-gray-200">
                        {hallTicket.schedule.map((sub, index) => (
                          <tr key={sub.subject_id}>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                              {index + 1}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                              {sub.subject_id}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                              {sub.subject_name}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                              {sub.credits}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                              {sub.exam_date}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 whitespace-nowrap">
                              {sub.start_time} - {sub.end_time}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-3"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Important instructions */}
                <div className="border border-yellow-400 bg-[#FFFFF0] dark:bg-yellow-900/10 p-5 rounded text-sm mb-12">
                  <h4 className="text-black dark:text-white mb-3 font-semibold">
                    Important Instructions:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-black dark:text-gray-300">
                    <li>
                      Students must carry this hall ticket to the examination
                      hall.
                    </li>
                    <li>Students must carry a valid photo ID proof.</li>
                    <li>
                      Students should report 30 minutes before the exam starts.
                    </li>
                    <li>
                      Mobile phones and electronic devices are strictly
                      prohibited.
                    </li>
                    <li>
                      Students must follow all examination rules and
                      regulations.
                    </li>
                  </ul>
                </div>

                {/* Signatures */}
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-20 px-4 md:px-12 text-sm text-black dark:text-gray-300 gap-12 sm:gap-0">
                  <div className="text-center w-48">
                    <div className="border-b border-gray-400 dark:border-gray-500 w-full mb-2"></div>
                    <p className="font-medium">University Seal</p>
                  </div>
                  <div className="text-center w-56">
                    <div className="border-b border-gray-400 dark:border-gray-500 w-full mb-2"></div>
                    <p className="font-medium">Controller of Examinations</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Signature & Stamp
                    </p>
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