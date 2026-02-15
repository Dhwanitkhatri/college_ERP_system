import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import { CreditCard, Search } from "lucide-react";
import axios from "axios";

export default function PayFeeAdmin() {

  {/* this is the variables for fee data*/}
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [searchEnrollment, setSearchEnrollment] = useState("");
  const [feeSummary, setFeeSummary] = useState(null);

  const token = localStorage.getItem("token");

  {/* this is the react hook form part*/}
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  {/*below is the calculation part of the fee data */}
  const amountInput = watch("amount");
  const payingNow = Number(amountInput) || 0;

  const totalFee = feeSummary?.total_fee;
  const alreadyPaid = feeSummary?.paid_amount || 0;

  const newTotalPaid =
    totalFee !== undefined ? alreadyPaid + payingNow : null;

  const newPending =
    totalFee !== undefined ? totalFee - (alreadyPaid + payingNow) : null;

  {/* fetch all students */}
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/fee/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  {/* fetch fee summary when student selected */}
  const fetchFeeStatus = async (studentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/fee/check-fee-status?student_id=${studentId}&academic_year=2025-2026`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFeeSummary(res.data.feeSummary);
    } catch (error) {
      setFeeSummary(null);
    }
  };

  {/* filter students by enrollment search */}
  const filteredStudents = students.filter((student) =>
    student.student_id
      .toLowerCase()
      .includes(searchEnrollment.toLowerCase())
  );

  {/* this part is handle form submission */}
  const onSubmit = (data) => {
    console.log(data);
    alert("Payment Saved!");
    reset();
  };

  {/*the main designing part start here */}
  return (
    <DashboardChildPageTemplate
      title="Pay Fee"
      desc="Submit your fee payment details"
      width="max-w-6xl"
    >
      <div className="pb-20 space-y-6">

        {/* ================= STUDENT SELECTION CARD ================= */}
        <DashboardChildPageCard>
          <div className="flex items-center gap-2 mb-6">
            <CreditCard size={20} />
            <h3 className="font-medium">Select Student</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* enrollment search field */}
            <div>
              <label className="custom-label mb-2">
                Search by Enrollment Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter enrollment number"
                  value={searchEnrollment}
                  onChange={(e) => setSearchEnrollment(e.target.value)}
                  className="custom-input bg-[var(--bg-primary)] theme-transition pl-10"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
              </div>
            </div>

            {/* student dropdown */}
            <div>
              <label className="custom-label mb-2">
                Select Student
              </label>
              <select
                className="custom-input bg-[var(--bg-primary)] theme-transition"
                value={selectedStudent}
                onChange={(e) => {
                  setSelectedStudent(e.target.value);
                  fetchFeeStatus(e.target.value);
                }}
              >
                <option value="">Choose Student</option>

                {filteredStudents.map((student) => (
                  <option
                    key={student.student_id}
                    value={student.student_id}
                  >
                    {student.student_id} - {student.name}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </DashboardChildPageCard>

        {/* SHOW BELOW CONTENT ONLY AFTER STUDENT IS SELECTED */}
        {selectedStudent && (
          <>
            {/* this part is the fee summary card part */}
            <div className="p-6 rounded-xl border border-blue-100 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800 transition-colors">
              <div className="flex items-center gap-2 mb-4 text-blue-800 dark:text-blue-300 font-medium">
                <CreditCard size={20} />
                <h3>Fee Summary</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                {/* this is the total fee part */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total Fee
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {totalFee !== undefined
                      ? `₹${totalFee.toLocaleString("en-IN")}`
                      : "-"}
                  </p>
                </div>

                {/* this is the paid amount part */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Paid
                  </p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400 transition-all">
                    {newTotalPaid !== null
                      ? `₹${newTotalPaid.toLocaleString("en-IN")}`
                      : "-"}
                  </p>
                </div>

                {/* this is the pending amount part */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Pending
                  </p>
                  <p className="text-lg font-bold text-red-500 dark:text-red-400">
                    {newPending !== null
                      ? `₹${newPending.toLocaleString("en-IN")}`
                      : "-"}
                  </p>
                </div>

                {/* this is the due date part */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Due Date
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {feeSummary ? "As Assigned" : "-"}
                  </p>
                </div>

              </div>
            </div>

            {/* the payment form start from here */}
            <DashboardChildPageCard>
              <form onSubmit={handleSubmit(onSubmit)}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                  {/* this is the amount input part */}
                  <div>
                    <label className="custom-label mb-2">
                      Amount to be Paid (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="custom-input bg-[var(--bg-primary)] theme-transition"
                      {...register("amount", { required: "Amount is required" })}
                    />
                    {errors.amount && (
                      <p className="custom-error">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>

                  {/* this is the payment mode part */}
                  <div>
                    <label className="custom-label mb-2">Payment Mode</label>
                    <select
                      className="custom-input bg-[var(--bg-primary)] theme-transition"
                      {...register("paymentMode", {
                        required: "Select payment mode",
                      })}
                    >
                      <option value="">Select payment mode</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                    {errors.paymentMode && (
                      <p className="custom-error">
                        {errors.paymentMode.message}
                      </p>
                    )}
                  </div>

                  {/* this is the reference number part */}
                  <div>
                    <label className="custom-label mb-2">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter reference number"
                      className="custom-input bg-[var(--bg-primary)] theme-transition"
                      {...register("referenceNumber", {
                        required: "Reference number is required",
                      })}
                    />
                    {errors.referenceNumber && (
                      <p className="custom-error">
                        {errors.referenceNumber.message}
                      </p>
                    )}
                  </div>

                  {/* this is the payment date part */}
                  <div>
                    <label className="custom-label mb-2">
                      Payment Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="custom-input w-full bg-[var(--bg-primary)] theme-transition"
                        {...register("paymentDate", {
                          required: "Date is required",
                        })}
                      />
                    </div>
                    {errors.paymentDate && (
                      <p className="custom-error">
                        {errors.paymentDate.message}
                      </p>
                    )}
                  </div>

                  {/* this is the remarks part */}
                  <div className="md:col-span-2">
                    <label className="custom-label mb-2">Remarks</label>
                    <textarea
                      rows="3"
                      placeholder="Enter any additional remarks (optional)"
                      className="custom-input bg-[var(--bg-primary)] theme-transition resize-none"
                      {...register("remarks")}
                    ></textarea>
                  </div>

                </div>

                {/* below is the buttons part */}
                {/* first is submit button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]"
                  >
                    <CreditCard size={18} />
                    Submit Payment
                  </button>

                  {/* this is the cancel button */}
                  <CancelButton onClick={() => reset()} />
                </div>

              </form>
            </DashboardChildPageCard>
          </>
        )}

      </div>
    </DashboardChildPageTemplate>
  );
}
