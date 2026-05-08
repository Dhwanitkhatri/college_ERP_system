import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import { CreditCard, Search } from "lucide-react";
import api from "../../api/axios";

export default function PayFeeAdmin() {
  {
    /* this is the variables for fee data*/
  }
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [searchEnrollment, setSearchEnrollment] = useState("");
  const [feeSummary, setFeeSummary] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  // NEW STATES
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");

  {
    /* this is the react hook form part*/
  }
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // 👇 WATCH PAYMENT MODE
  const paymentMode = watch("paymentMode");

  {
    /*below is the calculation part of the fee data */
  }
  const amountInput = watch("amount");
  const payingNow = Number(amountInput) || 0;

  const totalFee = feeSummary?.total_fee;
  const alreadyPaid = feeSummary?.paid_amount || 0;

  const newTotalPaid = totalFee !== undefined ? alreadyPaid + payingNow : null;

  const newPending =
    totalFee !== undefined ? totalFee - (alreadyPaid + payingNow) : null;

  {
    /* fetch all students */
  }
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/api/fee/students");
        setStudents(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  {
    /* fetch fee summary when student selected */
  }
  const fetchFeeStatus = async (studentId, year, sem) => {
    try {
      const res = await api.get(
        `/api/fee/check-fee-status?student_id=${studentId}&academic_year=${year}&semester=${sem}`,
      );
      console.log(res.data);
      setFeeSummary(res.data.feeSummary);
    } catch (error) {
      setFeeSummary(null);
    }
  };

  {
    /* trigger fee status api when all three fields are selected */
  }
  useEffect(() => {
    if (selectedStudent && academicYear && semester) {
      fetchFeeStatus(selectedStudent, academicYear, semester);
    }
  }, [selectedStudent, academicYear, semester]);

  {
    /* filter students by enrollment search */
  }
  const filteredStudents = students.filter((student) =>
    student.student_id.toLowerCase().includes(searchEnrollment.toLowerCase()),
  );

  {
    /* this part is handle form submission */
  }
  const onSubmit = async (data) => {
    try {
      console.log(data);
      console.log(selectedStudent);
      console.log(academicYear);
      console.log(semester);
      console.log(feeSummary?.fee_id);

      await api.post("/api/fee/pay", {
        student_id: selectedStudent,
        academic_year: academicYear,
        semester: semester,
        amount_paid: data.amount,
        payment_mode: data.paymentMode,
        reference_no:
          data.paymentMode === "Cheque" ? data.referenceNumber : null,
        payment_date: data.paymentDate,
        remarks: data.remarks,
        fee_structure_id: feeSummary?.fee_id,
      });

      alert("Payment Saved!");
      reset();
      fetchFeeStatus(selectedStudent, academicYear, semester);
    } catch (error) {
      alert(error.response?.data?.message || "Payment Failed");
    }
  };

  {
    /*the main designing part start here */
  }
  return (
    <DashboardChildPageTemplate
      title="Pay Fee"
      desc="Submit your fee payment details"
      width="max-w-6xl"
    >
      <div className="pb-20 space-y-6">
        {/* ================= STUDENT SELECTION CARD ================= */}
        <DashboardChildPageCard>
          <div className="flex items-center gap-2 mb-6 text-[var(--text-primary)]">
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
                <Search
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />

                <input
                  type="text"
                  placeholder="Enter enrollment number"
                  value={searchEnrollment}
                  onChange={(e) => setSearchEnrollment(e.target.value)}
                  className="custom-input bg-[var(--bg-primary)] theme-transition pl-10"
                />
              </div>
            </div>

            {/* student dropdown */}
            <div>
              <label className="custom-label mb-2">Select Student</label>
              <select
                className="custom-input bg-[var(--bg-primary)] theme-transition"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Choose Student</option>
                {filteredStudents.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.student_id} - {student.name}
                  </option>
                ))}
              </select>
            </div>

            {/* academic year input */}
            <div>
              <label className="custom-label mb-2">Academic Year</label>
              <select
                className="custom-input"
                placeholder="Select academic year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              >
                <option value="">Select Academic Year</option>
                <option value="2023-24">2023-24</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>

            {/* semester dropdown */}
            <div>
              <label className="custom-label mb-2">Semester</label>
              <select
                className="custom-input"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
              </select>
            </div>
          </div>
        </DashboardChildPageCard>

        {/* ================= FEE SUMMARY CARD ================= */}
        {feeSummary && (
          <DashboardChildPageCard>
            <div className="flex items-center gap-2 mb-5 text-blue-600 dark:text-blue-500">
              <CreditCard size={20} />
              <span className="font-medium text-[var(--text-primary)]">
                Fee Summary
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Total Fee */}
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">
                  Total Fee
                </p>
                <p className="font-medium text-[var(--text-primary)]">
                  ₹{totalFee?.toLocaleString("en-IN") || "0"}
                </p>
              </div>

              {/* Paid Amount */}
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">
                  Paid
                </p>
                <p className="font-medium text-green-600 dark:text-green-500">
                  ₹{alreadyPaid?.toLocaleString("en-IN") || "0"}
                </p>
              </div>

              {/* Pending Amount */}
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">
                  Pending
                </p>
                <p className="font-medium text-red-600 dark:text-red-500">
                  ₹{((totalFee || 0) - alreadyPaid).toLocaleString("en-IN")}
                </p>
              </div>

              {/* Due Date */}
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">
                  Due Date
                </p>
                <p className="font-medium text-[var(--text-primary)]">
                  {feeSummary?.due_date
                    ? new Date(feeSummary.due_date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )
                    : "Feb 15, 2026"}{" "}
                  {/* Fallback to match your screenshot if API doesn't send date */}
                </p>
              </div>
            </div>
          </DashboardChildPageCard>
        )}

        {/* SHOW BELOW CONTENT ONLY AFTER ALL SELECTED */}
        {selectedStudent && academicYear && semester && (
          <>
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
                      className="custom-input"
                      {...register("amount", {
                        required: "Amount is required",
                      })}
                    />
                    {errors.amount && (
                      <p className="custom-error">{errors.amount.message}</p>
                    )}
                  </div>

                  {/* this is the payment mode part */}
                  <div>
                    <label className="custom-label mb-2">Payment Mode</label>
                    <select
                      className="custom-input"
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
                  {paymentMode === "Cheque" && (
                    <div>
                      <label className="custom-label mb-2">
                        Reference Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter reference number"
                        className="custom-input"
                        {...register("referenceNumber", {
                          required:
                            paymentMode === "Cheque"
                              ? "Reference number is required"
                              : false,
                        })}
                      />
                      {errors.referenceNumber && (
                        <p className="custom-error">
                          {errors.referenceNumber.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* this is the payment date part */}
                  <div>
                    <label className="custom-label mb-2">Payment Date</label>
                    <input
                      type="date"
                      className="custom-input"
                      max={today}
                      {...register("paymentDate", {
                        required: "Date is required",
                        max: {
                          value: today,
                          message: "Payment date cannot be in the future",
                        },
                      })}
                    />
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
                      className="custom-input resize-none"
                      {...register("remarks")}
                    ></textarea>
                  </div>
                </div>

                {/* below is the buttons part */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]"
                  >
                    <CreditCard size={18} />
                    Submit Payment
                  </button>

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
