import React from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CheckFeeStatusAdmin() {
  const token = localStorage.getItem("token"); // Get token from localStorage
  const [students, setStudents] = useState([]);
  const [feeStatus, setFeeStatus] = useState(null);
  useEffect(() => {
    api
      .get("api/fee/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStudents(res.data); // backend sends array
        console.log("Fetched student:", res.data);
        
      })
      .catch((err) => {
        console.error(
          "Error fetching students:",
          err.response?.data || err.message
        );
      });
  }, []);

  const { register, handleSubmit } = useForm();

  const onSearch = (data) => {
    console.log("Searching fee status for:", data);
    if (!data.studentId) return;
    api
      .get("api/fee/check-fee-status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          student_id: data.studentId,
          academic_year: data.academicYear,
        },
      })
      .then((res) => {
        console.log("Fetched fee status:", res.data);
       setFeeStatus(res.data);
        // Handle the response data as needed
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
      <div className="mainDiv space-y-6 pb-10">
        <DashboardChildPageCard>
          <form
            onSubmit={handleSubmit(onSearch)}
            className="flex flex-col gap-6"
          >
            <div className="gridDiv grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="studentIdDiv">
                <label className="custom-label">Student ID</label>
                {/* <input
                  type="text"
                  placeholder="enter student id"
                  className="custom-input theme-transition"
                  {...register("studentId")}
                /> */}
                <select
                  name=""
                  defaultValue=""
                  id=""
                  className="custom-input theme-transition"
                  {...register("studentId")}
                >
                  <option value="" disabled>
                    Select Student
                  </option>
                  {/*student id mapping*/}
                  {students.map((student) => (
                    <option key={student.student_id} value={student.student_id}>
                      {student.student_id} - {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="AcademicYearDiv">
                <label className="custom-label">Academic Year</label>
                <select
                  className="custom-input theme-transition"
                  {...register("academicYear")}
                >
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                </select>
              </div>
            </div>
            <div className="CheckButtonDiv flex justify-start">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-md font-medium flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap theme-transition"
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

        {feeStatus && (
          <>
        <DashboardChildPageCard>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6 theme-transition">
            Student Information
          </h2>
          <div className="gridDiv grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="studentDiv">
              <p className="text-sm text-[var(--text-muted)] mb-1 theme-transition">
                Student ID
              </p>
              <p className="font-medium text-[var(--text-primary)] theme-transition">
                {feeStatus.student?.student_id}
              </p>
            </div>
            <div className="studentNameDiv">
              <p className="text-sm text-[var(--text-muted)] mb-1 theme-transition">
                Student Name
              </p>
              <p className="font-medium text-[var(--text-primary)] theme-transition">
                {feeStatus.student?.student_name}
              </p>
            </div>
            <div className="academicYearDiv">
              <p className="text-sm text-[var(--text-muted)] mb-1 theme-transition">
                Academic Year
              </p>
              <p className="font-medium text-[var(--text-primary)] theme-transition">
                {feeStatus.student?.academic_year}
              </p>
            </div>
          </div>
        </DashboardChildPageCard>

        <DashboardChildPageCard>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6 theme-transition">
            Fee Summary
          </h2>
          <div className="gridDiv grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="totalFeeDiv fee-summary-box bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                Total Fee
              </p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                ₹{feeStatus.feeSummary?.total_fee || "0"}
              </p>
            </div>

            <div className="paidAmountDiv fee-summary-box bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                Paid Amount
              </p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">
                ₹{feeStatus.feeSummary?.paid_amount || "0"}
              </p>
            </div>

            <div className="remainingAmountDiv fee-summary-box bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800">
              <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">
                Remaining Amount
              </p>
              <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
                ₹{feeStatus.feeSummary?.remaining_amount || "0"}
              </p>
            </div>

            <div className="paymentStatusDiv fee-summary-box bg-[var(--bg-secondary)] border-[var(--border-medium)] theme-transition">
              <p className="text-sm text-[var(--text-muted)] mb-1 theme-transition">
                Payment Status
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                {feeStatus.feeSummary?.payment_status || "N/A"}
              </span>
            </div>
          </div>
        </DashboardChildPageCard>

        <DashboardChildPageCard>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6 theme-transition">
            Payment History
          </h2>
          <div className="tableDiv overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[var(--border-medium)] theme-transition">
                  <th className="py-3 px-4 font-medium text-[var(--text-secondary)] theme-transition">
                    Installment No.
                  </th>
                  <th className="py-3 px-4 font-medium text-[var(--text-secondary)] theme-transition">
                    Amount Paid
                  </th>
                  <th className="py-3 px-4 font-medium text-[var(--text-secondary)] theme-transition">
                    Payment Mode
                  </th>
                  <th className="py-3 px-4 font-medium text-[var(--text-secondary)] theme-transition">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)] theme-transition">
                {feeStatus.paymentHistory?.map((pay, index) => (
                  <tr
                    key={index}
                    className="transition-colors theme-transition"
                  >
                    <td className="py-3 px-4 text-[var(--text-primary)] theme-transition">
                      Installment {pay.installment_no}
                    </td>

                    <td className="py-3 px-4 text-[var(--text-primary)] theme-transition">
                      ₹{Number(pay.amount_paid).toLocaleString("en-IN")}
                    </td>

                    <td className="py-3 px-4 text-[var(--text-primary)] theme-transition">
                      {pay.payment_mode}
                    </td>

                    <td className="py-3 px-4 text-[var(--text-secondary)] theme-transition">
                      {new Date(pay.payment_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardChildPageCard>
        </>
        )}
      </div>
    </DashboardChildPageTemplate>
  );
}
