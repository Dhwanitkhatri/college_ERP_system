import React, { useState, useRef } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useForm } from "react-hook-form";
import api from "../../api/axios";
import { generatePDF } from "../../utils/pdfGenerator";

const PrintFeeReceiptStudent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Stores the list of receipts after form submission
  const [receiptsList, setReceiptsList] = useState([]);
  // Stores the full details of the currently selected receipt
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  // ID of the selected receipt (still useful for tracking, but not for PDF API)
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  // Flag to show receipt details
  const [showReceipt, setShowReceipt] = useState(false);

  // Ref to the receipt area we want to export to PDF
  const receiptRef = useRef(null);

  // Helper to format currency
  const formatCurrency = (amount) => {
    return (
      "₹" +
      Number(amount)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  // Handle form submit: fetch list of receipts
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setReceiptsList([]);
    setSelectedReceipt(null);
    setShowReceipt(false);
    try {
      const listRes = await api.get("/api/fee-receipts/", {
        params: {
          academic_year: data.academicYear,
          semester: data.semester,
        },
      });

      if (!listRes.data.success || !listRes.data.data.length) {
        throw new Error("No receipt found for the selected period");
      }

      setReceiptsList(listRes.data.data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle selection of a receipt from the list
  const handleSelectReceipt = async (paymentId) => {
    setLoading(true);
    setError("");
    try {
      const detailRes = await api.get(`/api/fee-receipts/${paymentId}`);
      if (!detailRes.data.success) {
        throw new Error(
          detailRes.data.message || "Failed to fetch receipt details"
        );
      }
      const receipt = detailRes.data.data;

      // Transform API data to match component structure
      const transformed = {
        receiptNo: receipt.receipt_no,
        date: new Date(receipt.payment_date).toLocaleDateString("en-GB"),
        student: {
          name: receipt.student.name,
          studentId: receipt.student.student_id,
          class: receipt.student.class
            ? `${receipt.student.class} - Section ${receipt.student.section}`
            : "N/A",
          semester: receipt.student.semester || "N/A",
          year: receipt.student.academic_year || "N/A",
        },
        fees: [
          { type: "Tuition Fee", amount: receipt.fee_structure.tuition_fee },
          { type: "Exam Fee", amount: receipt.fee_structure.exam_fee },
          { type: "Library Fee", amount: receipt.fee_structure.library_fee },
          { type: "Lab Fee", amount: receipt.fee_structure.lab_fee },
          { type: "Misc Fee", amount: receipt.fee_structure.misc_fee },
        ],
        total: receipt.fee_structure.total_fee,
        payment: {
          paid: receipt.payment.amount_paid,
          mode: receipt.payment.payment_mode,
          receivedBy: receipt.payment.received_by,
          txn: receipt.payment.reference_no || "N/A",
        },
        balanceDue: receipt.balance_due,
        isLate: receipt.is_late,
        lateFee: receipt.late_fee,
      };

      setSelectedReceipt(transformed);
      setSelectedPaymentId(paymentId);
      setShowReceipt(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // NEW: client‑side PDF download using html2canvas + jsPDF
  const handleDownloadPdf = async () => {
    if (!receiptRef.current || !selectedReceipt) return;

    const original = receiptRef.current;

    // Clone the receipt so we can tweak styles if needed without affecting UI
    const cloneWrapper = document.createElement("div");
    cloneWrapper.style.position = "fixed";
    cloneWrapper.style.left = "-9999px";
    cloneWrapper.style.top = "0";
    cloneWrapper.style.backgroundColor = "#ffffff";
    cloneWrapper.style.zIndex = "-1";

    const clonedReceipt = original.cloneNode(true);
    cloneWrapper.appendChild(clonedReceipt);
    document.body.appendChild(cloneWrapper);

    await generatePDF(
      cloneWrapper,
      `fee_receipt_${selectedReceipt.student.studentId || "student"}_${
        selectedReceipt.receiptNo || "receipt"
      }.pdf`,
      {
        scale: 2.0,          // good balance of sharpness vs size
        orientation: "portrait",
        fitToWidth: true,
        imageType: "image/jpeg",
        imageQuality: 0.8,
        singlePage: true,    // receipt should easily fit on one page
      }
    );

    document.body.removeChild(cloneWrapper);
  };

  return (
    <DashboardChildPageTemplate
      title="Print Fee Receipt"
      desc="Select academic year and semester to view your receipts"
    >
      <DashboardChildPageCard>
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
              {...register("semester", { required: "Semester is required" })}
            >
              <option value="">Select Semester</option>
              {[...Array(8).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  Semester {num + 1}
                </option>
              ))}
            </select>
            {errors.semester && (
              <p className="custom-error">{errors.semester.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Get Receipts"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Receipt List (if any) */}
        {receiptsList.length > 0 && !showReceipt && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-[var(--text-primary)]">
              Select a Receipt to View
            </h3>
            <div className="space-y-2">
              {receiptsList.map((item) => (
                <div
                  key={item.payment_id}
                  onClick={() => handleSelectReceipt(item.payment_id)}
                  className="p-3 border border-[var(--border-light)] rounded-lg cursor-pointer hover:bg-[var(--bg-hover)] transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {item.receipt_no}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        Date:{" "}
                        {new Date(item.payment_date).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[var(--text-primary)]">
                        Paid: {formatCurrency(item.amount_paid)}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        Balance: {formatCurrency(item.balance_due)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DashboardChildPageCard>

      {/* Receipt Detail Section */}
      {showReceipt && selectedReceipt && selectedPaymentId && (
        <DashboardChildPageCard className="mt-4">
          {/* This is the area we convert to PDF */}
          <div id="receiptArea" ref={receiptRef}>
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

            {/* Receipt Meta */}
            <div className="flex justify-between text-sm text-[var(--text-secondary)] mb-4">
              <p>
                <span className="font-medium text-[var(--text-primary)]">
                  Receipt No:
                </span>{" "}
                {selectedReceipt.receiptNo}
              </p>
              <p>
                <span className="font-medium text-[var(--text-primary)]">
                  Date:
                </span>{" "}
                {selectedReceipt.date}
              </p>
            </div>

            {/* Student Info */}
            <div className="border border-[var(--border-light)] rounded-lg p-4 mb-5 bg-[var(--bg-secondary)]">
              <h3 className="font-semibold mb-2 text-[var(--text-primary)]">
                Student Information
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-[var(--text-secondary)]">
                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Name:
                  </span>{" "}
                  {selectedReceipt.student.name}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Student ID:
                  </span>{" "}
                  {selectedReceipt.student.studentId}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Class:
                  </span>{" "}
                  {selectedReceipt.student.class}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Semester:
                  </span>{" "}
                  {selectedReceipt.student.semester}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Academic Year:
                  </span>{" "}
                  {selectedReceipt.student.year}
                </p>
              </div>
            </div>

            {/* Fee Table */}
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
                {selectedReceipt.fees.map((fee, idx) => (
                  <tr key={idx}>
                    <td className="table-row-style">{fee.type}</td>
                    <td className="table-row-style text-right">
                      {formatCurrency(fee.amount)}
                    </td>
                  </tr>
                ))}
                {/* Total */}
                <tr className="font-semibold text-[var(--text-primary)]">
                  <td className="table-row-style">Total Fee</td>
                  <td className="table-row-style text-right">
                    {formatCurrency(selectedReceipt.total)}
                  </td>
                </tr>
                {/* Balance Due if any */}
                {selectedReceipt.balanceDue > 0 && (
                  <tr className="text-red-600">
                    <td className="table-row-style">Balance Due</td>
                    <td className="table-row-style text-right">
                      {formatCurrency(selectedReceipt.balanceDue)}
                    </td>
                  </tr>
                )}
                {selectedReceipt.isLate && (
                  <tr className="text-red-600">
                    <td className="table-row-style">Late Fee</td>
                    <td className="table-row-style text-right">
                      {formatCurrency(selectedReceipt.lateFee)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Payment Info */}
            <div className="border border-[var(--border-light)] rounded-lg p-4 mt-5 bg-[var(--bg-secondary)]">
              <h3 className="font-semibold mb-2 text-[var(--text-primary)]">
                Payment Information
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-[var(--text-secondary)]">
                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Amount Paid:
                  </span>{" "}
                  {formatCurrency(selectedReceipt.payment.paid)}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Payment Mode:
                  </span>{" "}
                  {selectedReceipt.payment.mode}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Received By:
                  </span>{" "}
                  {selectedReceipt.payment.receivedBy}
                </p>
                <p>
                  <span className="font-medium text-[var(--text-primary)]">
                    Transaction ID:
                  </span>{" "}
                  {selectedReceipt.payment.txn}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions mt-6 space-x-3">
            <button
              onClick={handleDownloadPdf}
              className="px-5 py-2 rounded-lg bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90 transition"
            >
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-lg bg-[var(--btn-blue-bg)] text-[var(--btn-blue-text)] hover:bg-[var(--btn-blue-hover)] transition"
            >
              Print
            </button>
            <button
              onClick={() => {
                setShowReceipt(false);
                setSelectedReceipt(null);
              }}
              className="px-5 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
            >
              Back to List
            </button>
          </div>
        </DashboardChildPageCard>
      )}
    </DashboardChildPageTemplate>
  );
};

export default PrintFeeReceiptStudent;