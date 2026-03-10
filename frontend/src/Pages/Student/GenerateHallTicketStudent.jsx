import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Download, Printer, GraduationCap } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios";

export default function GenerateHallTicket() {

  const [isTicketGenerated, setIsTicketGenerated] = useState(false);
  const [examIds, setExamIds] = useState([]);
  const [hallTicket, setHallTicket] = useState(null);

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

  /* Static dropdown data */
  const academicYears = ["2023-24", "2024-25", "2025-26"];

  const semesters = [1,2,3,4,5,6,7,8];

  const examTypes = ["REGULAR", "Remedial / ATKT", "Internal"];

  return (

    <DashboardChildPageTemplate
      title="Generate Hall Ticket"
      desc="Select exam details to generate your hall ticket"
      width="max-w-7xl"
    >

      <div className="flex flex-col gap-6">

        {/* Form Card */}
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
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  {...register("academicYear", { required: "Academic Year is required" })}
                >
                  <option value="">Select Academic Year</option>

                  {academicYears.map((year, idx) => (
                    <option key={idx} value={year}>{year}</option>
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
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  {...register("semester", { required: "Semester is required" })}
                >
                  <option value="">Select Semester</option>

                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
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
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
                  {...register("examType", { required: "Exam Type is required" })}
                >
                  <option value="">Select Exam Type</option>

                  {examTypes.map((type, idx) => (
                    <option key={idx} value={type}>{type}</option>
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
                  className="custom-input bg-[var(--bg-primary)] theme-transition"
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

            <div className="mt-8">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-md text-white dark:text-black font-medium bg-black dark:bg-white hover:opacity-90 transition-opacity"
              >
                Generate Hall Ticket
              </button>
            </div>

          </form>

        </DashboardChildPageCard>


        {/* Hall Ticket Display */}
        {isTicketGenerated && hallTicket && (

          <DashboardChildPageCard>

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap size={20}/> Hall Ticket
              </h2>

              <div className="flex gap-3">

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 border rounded"
                >
                  <Printer size={16}/> Print
                </button>

                <button className="flex items-center gap-2 px-4 py-2 border rounded">
                  <Download size={16}/> Download
                </button>

              </div>

            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">

              <p><strong>Name:</strong> {hallTicket.student.name}</p>
              <p><strong>Enrollment:</strong> {hallTicket.student.student_id}</p>
              <p><strong>Class:</strong> {hallTicket.student.class}</p>
              <p><strong>Section:</strong> {hallTicket.student.section}</p>
              <p><strong>Academic Year:</strong> {hallTicket.student.academic_year}</p>

            </div>

            {/* Exam Info */}
            <div className="mb-6 text-sm">

              <p><strong>Exam:</strong> {hallTicket.exam.name}</p>
              <p><strong>Type:</strong> {hallTicket.exam.exam_type}</p>
              <p><strong>Semester:</strong> {hallTicket.exam.semester}</p>

            </div>

            {/* Schedule Table */}
            <div className="overflow-x-auto">

              <table className="w-full border text-sm">

                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Subject Code</th>
                    <th className="p-2 border">Subject Name</th>
                    <th className="p-2 border">Credits</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Start</th>
                    <th className="p-2 border">End</th>
                  </tr>
                </thead>

                <tbody>

                  {hallTicket.schedule.map((sub) => (

                    <tr key={sub.subject_id}>
                      <td className="p-2 border">{sub.subject_id}</td>
                      <td className="p-2 border">{sub.subject_name}</td>
                      <td className="p-2 border">{sub.credits}</td>
                      <td className="p-2 border">{sub.exam_date}</td>
                      <td className="p-2 border">{sub.start_time}</td>
                      <td className="p-2 border">{sub.end_time}</td>
                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </DashboardChildPageCard>

        )}

      </div>

    </DashboardChildPageTemplate>

  );
}
