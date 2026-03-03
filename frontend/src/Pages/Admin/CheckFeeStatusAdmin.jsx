// CheckFeeStatusAdmin.jsx

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios";

export default function CheckFeeStatusAdmin() {

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Store students list
  const [students, setStudents] = useState([]);

  // Store fetched fee status
  const [feeStatus, setFeeStatus] = useState(null);

  // React Hook Form
  const { register, handleSubmit } = useForm();

  // ================= FETCH STUDENTS =================
  useEffect(() => {
    api
      .get("api/fee/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStudents(res.data);
        console.log("Fetched students:", res.data);
      })
      .catch((err) => {
        console.error(
          "Error fetching students:",
          err.response?.data || err.message
        );
      });
  }, []);

  // ================= SEARCH FEE STATUS =================
  const onSearch = (data) => {

    console.log("Searching fee status for:", data);

    // Prevent API call if any field missing
    if (!data.studentId || !data.academicYear || !data.semester) return;

    api
      .get("api/fee/check-fee-status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          student_id: data.studentId,
          academic_year: data.academicYear,
          semester: data.semester, // ✅ Semester added
        },
      })
      .then((res) => {
        console.log("Fetched fee status:", res.data);
        setFeeStatus(res.data);
      })
      .catch((err) => {
        console.error(
          "Error fetching fee status:",
          err.response?.data || err.message
        );
        setFeeStatus(null);
      });
  };

  return (
    <DashboardChildPageTemplate
      title="Check Fee Status"
      desc="Check student fee status and payment history"
      width="max-w-7xl"
    >
      <div className="space-y-6 pb-10">

        {/* ================= SEARCH FORM ================= */}
        <DashboardChildPageCard>
          <form
            onSubmit={handleSubmit(onSearch)}
            className="flex flex-col gap-6"
          >

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* ===== Student Select ===== */}
              <div>
                <label className="custom-label">Student ID</label>
                <select
                  className="custom-input theme-transition"
                  defaultValue=""
                  {...register("studentId")}
                >
                  <option value="" disabled>
                    Select Student
                  </option>

                  {students.map((student) => (
                    <option
                      key={student.student_id}
                      value={student.student_id}
                    >
                      {student.student_id} - {student.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ===== Academic Year ===== */}
              <div>
                <label className="custom-label">Academic Year</label>
                <select
                  className="custom-input theme-transition"
                  {...register("academicYear")}
                >
                  <option value="">Select Academic Year</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                </select>
              </div>

              {/* ===== Semester Selection (NEW) ===== */}
              <div>
                <label className="custom-label">Semester</label>
                <select
                  className="custom-input theme-transition"
                  defaultValue=""
                  {...register("semester")}
                >
                  <option value="" disabled>
                    Select Semester
                  </option>

                  {[1,2,3,4,5,6,7,8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* ===== Submit Button ===== */}
            <div className="flex justify-start">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-md font-medium flex items-center gap-2 hover:opacity-90 transition-opacity theme-transition"
                style={{
                  backgroundColor: "var(--btn-primary-bg)",
                  color: "var(--btn-primary-text)",
                }}
              >
                <Search size={18} />
                Check Status
              </button>
            </div>

          </form>
        </DashboardChildPageCard>

        {/* ================= RESULT SECTION ================= */}
        {feeStatus && (
          <>
            <DashboardChildPageCard>
              <h2 className="text-lg font-semibold mb-6">
                Student Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium">
                    {feeStatus.student?.student_id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-medium">
                    {feeStatus.student?.student_name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Academic Year</p>
                  <p className="font-medium">
                    {feeStatus.student?.academic_year}
                  </p>
                </div>
              </div>
            </DashboardChildPageCard>
          </>
        )}

      </div>
    </DashboardChildPageTemplate>
  );
}