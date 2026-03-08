import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Download, Printer, GraduationCap, User } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";

export default function GenerateHallTicket() {
  {
    /* this is the state to show the hall ticket only after form submission */
  }
  const [isTicketGenerated, setIsTicketGenerated] = useState(false);

  {
    /* this is the react hook form part */
  }
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

  {
    /* this function only runs when all required fields are filled and submitted */
  }
  const onSubmit = (data) => {
    console.log("Generate Hall Ticket Data:", data);
    {
      /* revealing the hall ticket UI */
    }
    setIsTicketGenerated(true);
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
    "Semester 7",
    "Semester 8",
  ];

  const examIds = ["Internal", "External", "EXAM-WIN-2024"];
  const examTypes = ["Regular", "Remedial / ATKT", "Internal"];

  // this is the dummy data for the student details shown on the ticket
  const studentDetails = {
    examType: "External",
    enrollmentNumber: "23CI2010001",
    programName: "BCA (Bachelor of Computer Applications)",
    studentName: "Emily Carter",
    semester: "Semester 8",
    examCategory: "Regular",
  };

  // this is the dummy data for the exam schedule table
  const examSchedule = [
    {
      code: "BCA-101",
      name: "Data Structures",
      type: "Theory",
      date: "15/03/2026",
      time: "10:00 AM - 01:00 PM",
    },
    {
      code: "BCA-102",
      name: "Algorithms",
      type: "Theory",
      date: "17/03/2026",
      time: "10:00 AM - 01:00 PM",
    },
    {
      code: "BCA-103",
      name: "Database Systems",
      type: "Theory",
      date: "19/03/2026",
      time: "10:00 AM - 01:00 PM",
    },
    {
      code: "BCA-104",
      name: "Operating Systems",
      type: "Theory",
      date: "21/03/2026",
      time: "10:00 AM - 01:00 PM",
    },
    {
      code: "BCA-105",
      name: "Computer Networks",
      type: "Theory",
      date: "23/03/2026",
      time: "10:00 AM - 01:00 PM",
    },
    {
      code: "BCA-103-P",
      name: "Database Systems Lab",
      type: "Practical",
      date: "25/03/2026",
      time: "02:00 PM - 05:00 PM",
    },
    {
      code: "BCA-104-P",
      name: "Operating Systems Lab",
      type: "Practical",
      date: "26/03/2026",
      time: "02:00 PM - 05:00 PM",
    },
    {
      code: "BCA-105-V",
      name: "Project Viva",
      type: "Viva",
      date: "28/03/2026",
      time: "11:00 AM - 01:00 PM",
    },
  ];

  {
    /* the main designing part start from here */
  }
  return (
    <DashboardChildPageTemplate
      title="Generate Hall Ticket"
      desc="Select exam details to generate your hall ticket"
      width="max-w-7xl"
    >
      <div className="flex flex-col gap-6">
        <DashboardChildPageCard>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* this is the heading part of the page */}
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-6">
              Exam Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* this is the academic year part */}
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

              {/* this is the semester part */}
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
            </div>

            {/* below is the action button of the generate hall ticket */}
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

        {/* these buttons and the ticket only show when the hall ticket is generated */}
        {isTicketGenerated && (
          <div className="animate-in fade-in duration-500 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Printer size={18} />
                Print Hall Ticket
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
            <div className="bg-white dark:bg-gray-900 border-[3px] border-black dark:border-gray-500 rounded-lg p-8 md:p-12 mt-2 shadow-sm">
              <div className="flex flex-col md:flex-row items-center relative pb-2 min-h-[100px]">
                <div className="md:absolute left-0 top-0 w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4 md:mb-0">
                  <GraduationCap className="w-10 h-10 text-white dark:text-black" />
                </div>
                {/* this is the institute header part */}
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
                    EXAMINATION HELD IN: 2025-26 - MARCH 2026
                  </p>
                </div>
              </div>

              {/* this is the student details part */}
              <div className="flex justify-between items-start border-t border-b border-gray-300 dark:border-gray-700 py-6 my-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 w-full md:w-3/4 text-sm text-black dark:text-white">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block mb-0.5">
                      Exam Type:
                    </span>
                    <span>{studentDetails.examType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block mb-0.5">
                      Enrollment Number:
                    </span>
                    <span>{studentDetails.enrollmentNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block mb-0.5">
                      Program Name:
                    </span>
                    <span>{studentDetails.programName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block mb-0.5">
                      Student Name:
                    </span>
                    <span>{studentDetails.studentName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block mb-0.5">
                      Semester:
                    </span>
                    <span>{studentDetails.semester}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block mb-0.5">
                      Exam Category:
                    </span>
                    <span>{studentDetails.examCategory}</span>
                  </div>
                </div>

                {/* Photo Placeholder */}
                <div className="hidden md:flex w-28 h-36 border border-gray-400 bg-gray-50 dark:bg-gray-800 items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              </div>

              {/* this is the examination schedule table part */}
              <div className="mb-8">
                <h3 className="text-[15px] text-black dark:text-white mb-3">
                  Examination Schedule
                </h3>
                <div className="overflow-x-auto">
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
                          Exam Type
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
                      {examSchedule.map((row, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                            {row.code}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                            {row.name}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                            {row.type}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                            {row.date}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                            {row.time}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-3"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* this is the important instructions part */}
              <div className="border border-yellow-400 bg-[#FFFFF0] dark:bg-yellow-900/10 p-5 rounded text-sm mb-12">
                <h4 className="text-black dark:text-white mb-3">
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
                    Students must follow all examination rules and regulations.
                  </li>
                </ul>
              </div>

              {/* this is the signatures and footer part */}
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-20 px-4 md:px-12 text-sm text-black dark:text-gray-300 gap-12 sm:gap-0">
                <div className="text-center w-48">
                  <div className="border-b border-gray-400 dark:border-gray-500 w-full mb-2"></div>
                  <p>University Seal</p>
                </div>
                <div className="text-center w-56">
                  <div className="border-b border-gray-400 dark:border-gray-500 w-full mb-2"></div>
                  <p>Controller of Examinations</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Signature & Stamp
                  </p>
                </div>
              </div>

              <p className="text-center text-xs text-gray-500 mt-12 pt-6">
                This is a computer-generated hall ticket and does not require a
                physical signature.
                <br />
                For any queries, contact the examination department.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardChildPageTemplate>
  );
}
