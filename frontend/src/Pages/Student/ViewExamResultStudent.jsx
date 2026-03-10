import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { Printer, Download, GraduationCap, User } from "lucide-react";

export default function ViewExamResult() {
  {
    /* this is the state to show the result only after form submission */
  }
  const [showResult, setShowResult] = useState(false);

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
    },
  });

  {
    /* this is the dummy data for the dropdowns (expanded as requested) */
  }
  const academicYears = ["2023-24", "2024-25", "2025-26", "2026-27", "2027-28"];
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
  const examIds = [
    "Internal Exam - 1",
    "Internal Exam - 2",
    "External Exam - Winter",
    "External Exam - Spring",
    "Remedial / ATKT Exam",
  ];

  // ================= DUMMY DATA =================
  // Ready to be replaced by API data later
  const studentData = {
    name: "EMILY CARTER",
    examination: "BCA-SEMESTER-1",
    heldIn: "MARCH-2025",
    enrollmentNumber: "23CI2010001",
    abcId: "261741569056",
    courseName: "BACHELOR OF COMPUTER APPLICATIONS",
    branchName: "BCA",
    branchCode: "CI201",
    date: "22/05/2025",
  };

  const courseGrades = [
    {
      code: "232010241",
      title: "SEARCH ENGINE OPTIMIZATION",
      credits: 4,
      grade: "A",
    },
    {
      code: "232010242",
      title: "WORDPRESS WEBSITE DEVELOPMENT",
      credits: 3,
      grade: "O",
    },
    {
      code: "232011241",
      title: "INDIAN KNOWLEDGE SYSTEM",
      credits: 2,
      grade: "O+",
    },
    { code: "232010343", title: "ADVANCED DBMS", credits: 2, grade: "O" },
    {
      code: "232010344",
      title: "VISUAL PROGRAMMING USING C SHARP",
      credits: 2,
      grade: "O+",
    },
    {
      code: "232010342",
      title: "SYSTEM ANALYSIS AND MODELING",
      credits: 3,
      grade: "A",
    },
    {
      code: "232010341",
      title: "COMPUTER NETWORKING",
      credits: 3,
      grade: "B+",
    },
    {
      code: "232011041",
      title: "INTRODUCTION TO ARTIFICIAL INTELLIGENCE",
      credits: 3,
      grade: "C",
    },
  ];

  const performanceData = {
    current: {
      totalCredits: 22,
      earnedCredits: 22,
      gradePoints: "182.00",
      sgpa: "8.27",
    },
    cumulative: {
      totalCredits: 93,
      earnedCredits: 93,
      gradePoints: "679.30",
      cgpa: "7.30",
    },
    result: "Pass",
  };
  // ==============================================

  {
    /* this is the submit function part */
  }
  const onSubmit = (data) => {
    console.log("View Exam Result Data Submitted:", data);
    setShowResult(true);
  };

  {
    /* the main designing part start from here */
  }
  return (
    <DashboardChildPageTemplate
      title="View Examination Result"
      desc="Select exam details to view your semester grade sheet"
      width="max-w-7xl"
    >
      <div className="pb-20 space-y-6">
        {/* ================= SELECTION FORM ================= */}
        <DashboardChildPageCard>
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Exam Details
            </h3>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* this is the academic year part */}
              <div className="flex-1 form-field !my-0">
                <label className="custom-label">
                  Academic Year
                </label>
                <select
                  className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                    errors.academicYear
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
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
                  <p className="custom-error">{errors.academicYear.message}</p>
                )}
              </div>

              {/* this is the semester part */}
              <div className="flex-1 form-field !my-0">
                <label className="custom-label">
                  Semester 
                </label>
                <select
                  className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                    errors.semester
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
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

              {/* this is the exam ID part */}
              <div className="flex-1 form-field !my-0">
                <label className="custom-label">
                  Exam ID
                </label>
                <select
                  className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                    errors.examId
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  {...register("examId", { required: "Required" })}
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
            </div>

            {/* below is the action button of the view result */}
            <div className="mt-8">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-md text-white dark:text-black font-medium bg-black dark:bg-white hover:opacity-90 transition-opacity"
              >
                View Result
              </button>
            </div>
          </form>
        </DashboardChildPageCard>

        {/* ================= RESULT DISPLAY ================= */}
        {showResult && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {/* Action Buttons in Black & White theme */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Printer size={18} />
                Print Marksheet
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>

            {/* The Actual Grade Sheet Container */}
            <div className="bg-white text-black p-2 overflow-x-auto shadow-sm theme-transition">
              <div className="min-w-[900px]">
                {/* Thick Outer Border */}
                <div className="border-[4px] border-black p-2">
                  {/* Thin Inner Border */}
                  <div className="border border-black p-8">
                    {/* Header */}
                    <div className="flex items-center pb-4 mb-6 relative">
                      <div className="w-20 h-20 rounded-full border-[1.5px] border-black flex items-center justify-center flex-shrink-0 absolute left-0 top-0">
                        {/* Changed icon color to black to match theme */}
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
                          Technology Campus, Innovation Drive - University Road,
                          Education City,
                          <br /> Techville - 380015
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
                            BRANCH NAME
                          </th>
                          <th className="border border-black py-1.5 px-2 font-bold w-1/4">
                            BRANCH CODE
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-center">
                          <td className="border border-black py-1.5 px-2">
                            {studentData.courseName}
                          </td>
                          <td className="border border-black py-1.5 px-2">
                            {studentData.branchName}
                          </td>
                          <td className="border border-black py-1.5 px-2">
                            {studentData.branchCode}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Student Info & Photo */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-[13px] space-y-2 uppercase">
                        <p>
                          <span className="font-bold">NAME :</span>{" "}
                          {studentData.name}
                        </p>
                        <p>
                          <span className="font-bold">EXAMINATION :</span>{" "}
                          {studentData.examination}
                        </p>
                        <p>
                          <span className="font-bold">HELD IN :</span>{" "}
                          {studentData.heldIn}
                        </p>
                        <div className="flex gap-12">
                          <p>
                            <span className="font-bold">
                              ENROLLMENT NUMBER :
                            </span>{" "}
                            {studentData.enrollmentNumber}
                          </p>
                          <p>
                            <span className="font-bold">ABC ID :</span>{" "}
                            {studentData.abcId}
                          </p>
                        </div>
                      </div>
                      {/* Photo Placeholder */}
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
                        {courseGrades.map((course, index) => (
                          <tr key={index}>
                            <td className="border border-black py-1 px-2">
                              {course.code}
                            </td>
                            <td className="border border-black py-1 px-2 text-left">
                              {course.title}
                            </td>
                            <td className="border border-black py-1 px-2">
                              {course.credits}
                            </td>
                            <td className="border border-black py-1 px-2 font-semibold">
                              {course.grade}
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
                            {performanceData.current.totalCredits}
                          </td>
                          <td className="border border-black py-1.5 px-2">
                            {performanceData.current.earnedCredits}
                          </td>
                          <td className="border border-black py-1.5 px-2">
                            {performanceData.current.gradePoints}
                          </td>
                          <td className="border border-black py-1.5 px-2 font-bold">
                            {performanceData.current.sgpa}
                          </td>
                          <td className="border border-black py-1.5 px-2">
                            {performanceData.cumulative.totalCredits}
                          </td>
                          <td className="border border-black py-1.5 px-2">
                            {performanceData.cumulative.earnedCredits}
                          </td>
                          <td className="border border-black py-1.5 px-2">
                            {performanceData.cumulative.gradePoints}
                          </td>
                          <td className="border border-black py-1.5 px-2 font-bold">
                            {performanceData.cumulative.cgpa}
                          </td>
                          <td className="border border-black py-1.5 px-2 font-bold uppercase">
                            {performanceData.result}
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
                        {studentData.date}
                      </p>
                      <div className="text-center">
                        <div className="w-32 border-b-[1.5px] border-black mb-1"></div>
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
        )}
      </div>
    </DashboardChildPageTemplate>
  );
}
