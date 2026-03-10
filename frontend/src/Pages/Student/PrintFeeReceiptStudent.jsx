import React, { useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useForm } from "react-hook-form";

const PrintFeeReceiptStudent = () => {
  /* ---------------------------
     React Hook Form Setup
  ----------------------------*/
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /* ---------------------------
     State to control receipt visibility
  ----------------------------*/
  const [showReceipt, setShowReceipt] = useState(false);

  /* ---------------------------
     Dummy Receipt Data
     (Later replace with API response)
  ----------------------------*/
  const [receiptData, setReceiptData] = useState(null);

  /* ---------------------------
     Handle Form Submit
  ----------------------------*/
  const onSubmit = (data) => {
    // Later you will call backend API here
    // Example:
    // const res = await api.get(`/api/fees/receipt?year=${data.year}&semester=${data.semester}`)

    const dummyData = {
      receiptNo: "RCP-4-20260310",
      date: "10/03/2026",
      student: {
        name: "Emily Carter",
        enrollment: "23CI2010001",
        studentId: "23BCA001",
        class: "TY BCA A - Section A",
        semester: data.semester,
        year: data.academicYear,
      },
      fees: [
        { type: "Tuition Fee", amount: 12000 },
        { type: "Exam Fee", amount: 1200 },
        { type: "Library Fee", amount: 1200 },
        { type: "Lab Fee", amount: 1197 },
        { type: "Misc Fee", amount: 1500 },
      ],
      total: 17097,
      payment: {
        paid: 17000,
        mode: "Online Payment (UPI)",
        receivedBy: "admin_BCA",
        txn: "TXN3166916151",
      },
    };

    setReceiptData(dummyData);
    setShowReceipt(true);
  };

  /* ---------------------------
     Print Receipt
  ----------------------------*/
  const handlePrint = () => {
    window.print();
  };

  /* ---------------------------
     Download Receipt
     (Simple method using print dialog)
  ----------------------------*/
  const handleDownload = () => {
    window.print();
  };

  return (
    <DashboardChildPageTemplate
      title="Print Fee Receipt"
      desc="Select academic year and semester to generate receipt"
    >
      <DashboardChildPageCard>
        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Academic Year */}
          <div className="form-field">
            <label className="custom-label">Academic Year</label>

            <select
              className="custom-input"
              {...register("academicYear", {
                required: "Academic year is required",
              })}
            >
              <option value="">Select Academic Year</option>
              <option value="2023-24">2023-24</option>
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
            </select>

            {errors.academicYear && (
              <p className="custom-error">{errors.academicYear.message}</p>
            )}
          </div>

          {/* Semester */}
          <div className="form-field">
            <label className="custom-label">Semester</label>

            <select
              className="custom-input"
              {...register("semester", {
                required: "Semester is required",
              })}
            >
              <option value="">Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>

            {errors.semester && (
              <p className="custom-error">{errors.semester.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="
                px-6 py-2
                bg-[var(--btn-primary-bg)]
                text-[var(--btn-primary-text)]
                rounded-lg
                hover:opacity-90
                transition
              "
            >
              Get Receipt
            </button>
          </div>
        </form>
      </DashboardChildPageCard>

      {/* ================= RECEIPT SECTION ================= */}

      {showReceipt && receiptData && (
        <DashboardChildPageCard className="mt-4">
          <div id="receiptArea">
            {/* Institute Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                PRESTIGIOUS INSTITUTE OF TECHNOLOGY
              </h2>

              <p className="text-sm text-[var(--text-muted)]">
                Technology Campus, Innovation Drive, University Road
              </p>

              <p className="text-sm text-[var(--text-muted)]">
                Education City, Techville - 380015
              </p>

              <h3 className="mt-3 font-medium border-b border-[var(--border-light)] text-[var(--text-primary)] inline-block pb-1">
                FEE RECEIPT
              </h3>
            </div>

            {/* Receipt Meta Info */}
            <div className="flex justify-between text-sm text-[var(--text-secondary)] mb-4">
              <p>
                <span className="font-medium text-[var(--text-primary)]">
                  Receipt No:
                </span>{" "}
                {receiptData.receiptNo}
              </p>

              <p>
                <span className="font-medium text-[var(--text-primary)]">
                  Date:
                </span>{" "}
                {receiptData.date}
              </p>
            </div>

            {/* Student Information */}
            <div className="border border-[var(--border-light)] rounded-lg p-4 mb-5 bg-[var(--bg-secondary)]">
              <h3 className="font-semibold mb-2 text-[var(--text-primary)]">
                Student Information
              </h3>

              <div className="grid grid-cols-2 gap-2 text-sm text-[var(--text-secondary)]">
                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Name:
                  </span>{" "}
                  {receiptData.student.name}
                </p>

                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Student ID:
                  </span>{" "}
                  {receiptData.student.studentId}
                </p>

                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Enrollment:
                  </span>{" "}
                  {receiptData.student.enrollment}
                </p>

                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Class:
                  </span>{" "}
                  {receiptData.student.class}
                </p>

                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Semester:
                  </span>{" "}
                  {receiptData.student.semester}
                </p>

                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Academic Year:
                  </span>{" "}
                  {receiptData.student.year}
                </p>
              </div>
            </div>

            {/* Fee Structure Table */}

            <h3 className="font-semibold mb-2 text-[var(--text-primary)]">
              Fee Structure
            </h3>

            <table className="w-full text-sm border border-[var(--border-light)] rounded-lg overflow-hidden">
              <thead className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                <tr>
                  <th className="table-row-style">Fee Type</th>
                  <th className="table-row-style text-right">Amount (₹)</th>
                </tr>
              </thead>

              <tbody className="text-[var(--text-secondary)]">
                {receiptData.fees.map((fee, index) => (
                  <tr key={index}>
                    <td className="table-row-style">{fee.type}</td>
                    <td className="table-row-style text-right">
                      ₹{fee.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}

                {/* Total */}
                <tr className="font-semibold text-[var(--text-primary)]">
                  <td className="table-row-style">Total Fee</td>
                  <td className="table-row-style text-right">
                    ₹{receiptData.total.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Payment Information */}

            <div className="border border-[var(--border-light)] rounded-lg p-4 mt-5 bg-[var(--bg-secondary)]">
              <h3 className="font-semibold mb-2 text-[var(--text-primary)]">
                Payment Information
              </h3>

              <div className="grid grid-cols-2 gap-2 text-sm text-[var(--text-secondary)]">
                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Amount Paid:
                  </span>{" "}
                  ₹{receiptData.payment.paid}
                </p>

                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Payment Mode:
                  </span>{" "}
                  {receiptData.payment.mode}
                </p>

                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Received By:
                  </span>{" "}
                  {receiptData.payment.receivedBy}
                </p>

                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Transaction ID:
                  </span>{" "}
                  {receiptData.payment.txn}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions mt-6">
            <button
              onClick={handleDownload}
              className="
          px-5 py-2
          rounded-lg
          bg-[var(--btn-primary-bg)]
          text-[var(--btn-primary-text)]
          hover:opacity-90
          transition
        "
            >
              Download
            </button>

            <button
              onClick={handlePrint}
              className="
          px-5 py-2
          rounded-lg
          bg-[var(--btn-blue-bg)]
          text-[var(--btn-blue-text)]
          hover:bg-[var(--btn-blue-hover)]
          transition
        "
            >
              Print
            </button>
          </div>
        </DashboardChildPageCard>
      )}
    </DashboardChildPageTemplate>
  );
};

export default PrintFeeReceiptStudent;
