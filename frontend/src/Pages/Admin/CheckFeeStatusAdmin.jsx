// CheckFeeStatusAdmin.jsx

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios";

export default function CheckFeeStatusAdmin() {
  // ================= TOKEN =================

  // ================= STATE =================
  const [students, setStudents] = useState([]);
  const [feeStatus, setFeeStatus] = useState(null);

  // ================= FORM =================
  const { register, handleSubmit } = useForm();

  // ================= FETCH STUDENTS =================
  useEffect(() => {
    api
      .get("api/fee/students")
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        console.error(
          "Error fetching students:",
          err.response?.data || err.message,
        );
      });
  }, []);

  // ================= SEARCH FUNCTION =================
  const onSearch = (data) => {
    // Prevent empty search
    if (!data.studentId || !data.academicYear || !data.semester) return;

    api
      .get("api/fee/check-fee-status", {
        params: {
          student_id: data.studentId,
          academic_year: data.academicYear,
          semester: data.semester,
        },
      })
      .then((res) => {
        setFeeStatus(res.data);
      })
      .catch((err) => {
        console.error(
          "Error fetching fee status:",
          err.response?.data || err.message,
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {/* Student Select */}
              <div>
                <label className="custom-label">Student ID</label>
                <select
                  className="custom-input"
                  defaultValue=""
                  {...register("studentId")}
                >
                  <option value="" disabled>
                    Select Student
                  </option>
                  {students.map((student) => (
                    <option key={student.student_id} value={student.student_id}>
                      {student.student_id} - {student.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Year */}
              <div>
                <label className="custom-label">Academic Year</label>
                <select className="custom-input" {...register("academicYear")}>
                  <option value="">Select Academic Year</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="custom-label">Semester</label>
                <select
                  className="custom-input"
                  defaultValue=""
                  {...register("semester")}
                >
                  <option value="" disabled>
                    Select Semester
                  </option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-md font-medium flex items-center gap-2"
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
            {/* -------- Student Info -------- */}
            <DashboardChildPageCard>
              <h2 className="text-lg font-semibold mb-6 text-[var(--text-primary)]">
                Student Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Student ID</p>
                  <p className="font-medium text-[var(--text-primary)]">
                    {feeStatus.student?.student_id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[var(--text-muted)]">
                    Student Name
                  </p>
                  <p className="font-medium text-[var(--text-primary)]">
                    {feeStatus.student?.student_name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[var(--text-muted)]">
                    Academic Year
                  </p>
                  <p className="font-medium text-[var(--text-primary)]">
                    {feeStatus.student?.academic_year}
                  </p>
                </div>
              </div>
            </DashboardChildPageCard>

            {/* -------- Fee Summary -------- */}
            <DashboardChildPageCard>
              <h2 className="text-lg font-semibold mb-6 text-[var(--text-primary)]">
                Fee Summary
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="fee-summary-box border border-[var(--border-light)] bg-[var(--bg-secondary)]">
                  <p className="text-[var(--text-muted)]">Total Fee</p>
                  <p className="font-bold text-[var(--text-primary)]">
                    ₹{feeStatus.feeSummary?.total_fee || 0}
                  </p>
                </div>

                <div className="fee-summary-box border border-[var(--border-light)] bg-[var(--bg-secondary)]">
                  <p className="text-[var(--text-muted)]">Paid Amount</p>
                  <p className="font-bold text-green-600 dark:text-green-400">
                    ₹{feeStatus.feeSummary?.paid_amount || 0}
                  </p>
                </div>

                <div className="fee-summary-box border border-[var(--border-light)] bg-[var(--bg-secondary)]">
                  <p className="text-[var(--text-muted)]">Remaining Amount</p>
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    ₹{feeStatus.feeSummary?.remaining_amount || 0}
                  </p>
                </div>

                <div className="fee-summary-box border border-[var(--border-light)] bg-[var(--bg-secondary)]">
                  <p className="text-[var(--text-muted)]">Payment Status</p>

                  <span
                    className={`px-2 py-1 text-xs rounded font-medium
      ${
        feeStatus.feeSummary?.payment_status === "Pending"
          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      }
    `}
                  >
                    {feeStatus.feeSummary?.payment_status || "N/A"}
                  </span>
                </div>
              </div>
            </DashboardChildPageCard>

            {/* -------- Payment History -------- */}
            <DashboardChildPageCard>
              <h2 className="text-lg font-semibold mb-6 text-[var(--text-primary)]">
                Payment History
              </h2>

              {feeStatus.paymentHistory?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                      <tr className="border-b border-[var(--border-light)]">
                        <th className="py-3 px-4">Installment</th>
                        <th className="py-3 px-4">Amount Paid</th>
                        <th className="py-3 px-4">Payment Mode</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {feeStatus.paymentHistory.map((pay, index) => (
                        <tr
                          key={index}
                          className="border-b border-[var(--border-light)] hover:bg-[var(--bg-hover)]"
                        >
                          <td className="py-3 px-4">
                            Installment {pay.installment_no}
                          </td>

                          <td className="py-3 px-4">
                            ₹{Number(pay.amount_paid).toLocaleString("en-IN")}
                          </td>

                          <td className="py-3 px-4">{pay.payment_mode}</td>

                          <td className="py-3 px-4">
                            {new Date(pay.payment_date).toLocaleDateString(
                              "en-IN",
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-[var(--text-muted)]">
                  No payment history found
                </div>
              )}
            </DashboardChildPageCard>
          </>
        )}
      </div>
    </DashboardChildPageTemplate>
  );
}
