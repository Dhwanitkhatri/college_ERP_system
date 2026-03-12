import { FeePayment } from "../model/FeePayment.js";
import { FeeStructure } from "../model/FeeStructure.js";
import { StudentFee } from "../model/StudentFees.js";
import { Student } from "../model/Student.js";
import { Class } from "../model/Class.js";
import PDFDocument from 'pdfkit';

// ==========================================
// Helper: fetch receipt data for a payment
// ==========================================
const getReceiptData = async (payment_id, course_id) => {
  // Fetch payment
  const payment = await FeePayment.findByPk(payment_id);
  if (!payment) throw new Error("Payment not found");

  // Fetch student
  const student = await Student.findOne({
    where: { student_id: payment.student_id, course_id }
  });
  if (!student) throw new Error("Student not found or not in your course");

  // Fetch class
  let classData = null;
  if (student.class_pk) {
    classData = await Class.findOne({
      where: { id: student.class_pk, course_id }
    });
  }

  // Fetch fee structure
  const feeStructure = await FeeStructure.findOne({
    where: { id: payment.fee_structure_id, course_id }
  });
  if (!feeStructure) throw new Error("Fee structure not found");

  // Fetch ALL payments for this student and fee structure (to calculate total paid)
  const allPayments = await FeePayment.findAll({
    where: {
      student_id: payment.student_id,
      fee_structure_id: payment.fee_structure_id
    }
  });

  const totalPaid = allPayments.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);
  const totalFee = parseFloat(feeStructure.total_fee);
  const balanceDue = totalFee - totalPaid > 0 ? totalFee - totalPaid : 0;

  // Fetch student fee (due date)
  const studentFee = await StudentFee.findOne({
    where: {
      student_id: payment.student_id,
      fee_structure_id: payment.fee_structure_id
    }
  });

  // Determine if this specific payment was late
  const isLate = studentFee?.due_date && new Date(payment.payment_date) > new Date(studentFee.due_date);
  // Simple late fee: if the payment is late and the amount paid exceeds the total fee, treat excess as late fee
  const lateFee = isLate && parseFloat(payment.amount_paid) > totalFee
    ? parseFloat(payment.amount_paid) - totalFee
    : 0;

  return {
    receipt_no: `RCP-${payment.id}-${payment.payment_date.replace(/-/g, '')}`,
    payment_date: payment.payment_date,
    student: {
      student_id: student.student_id,
      name: student.name,
      class: classData?.class_id,
      section: classData?.section,
      semester: classData?.semester,
      academic_year: classData?.academic_year,
      admission_year: student.admission_year
    },
    fee_structure: {
      semester: feeStructure.semester,
      academic_year: feeStructure.academic_year,
      tuition_fee: Number(feeStructure.tuition_fee),
      exam_fee: Number(feeStructure.exam_fee),
      library_fee: Number(feeStructure.library_fee),
      lab_fee: Number(feeStructure.lab_fee),
      misc_fee: Number(feeStructure.misc_fee),
      total_fee: Number(feeStructure.total_fee)
    },
    payment: {
      amount_paid: payment.amount_paid,
      payment_mode: payment.payment_mode,
      reference_no: payment.reference_no,
      received_by: payment.received_by,
      remarks: payment.remarks
    },
    total_paid_so_far: totalPaid,      // optional, for frontend use
    due_date: studentFee?.due_date,
    is_late: isLate,
    late_fee: lateFee,
    balance_due: balanceDue,
    total_after_late: totalFee + lateFee
  };
};

// ==========================================
// GET ALL PAID RECEIPTS FOR LOGGED-IN STUDENT (with filters)
// ==========================================
export const getStudentReceipts = async (req, res) => {
  try {
    const user_id = req.user?.uid;
    const { academic_year, semester } = req.query;
    const course_id = req.user?.course_id;

    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (req.user?.role !== 'Student') {
      return res.status(403).json({ success: false, message: "Access denied: Students only" });
    }
    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    // Find student
    const student = await Student.findOne({ where: { user_id, course_id } });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Build filter for FeePayments
    const paymentWhere = { student_id: student.student_id };

    // If filters provided, restrict to matching fee structures
    if (academic_year || semester) {
      const feeWhere = { course_id };
      if (academic_year) feeWhere.academic_year = academic_year;
      if (semester) feeWhere.semester = semester;
      const feeStructures = await FeeStructure.findAll({ where: feeWhere, attributes: ['id'] });
      const feeStructureIds = feeStructures.map(fs => fs.id);
      if (feeStructureIds.length === 0) {
        return res.json({ success: true, data: [] });
      }
      paymentWhere.fee_structure_id = feeStructureIds;
    }

    // Fetch payments
    const payments = await FeePayment.findAll({
      where: paymentWhere,
      order: [['payment_date', 'DESC']]
    });

    // For each payment, get basic details
    const receipts = await Promise.all(payments.map(async (payment) => {
      const feeStructure = await FeeStructure.findOne({
        where: { id: payment.fee_structure_id, course_id }
      });
      const studentFee = await StudentFee.findOne({
        where: {
          student_id: student.student_id,
          fee_structure_id: payment.fee_structure_id
        }
      });
      const totalFee = feeStructure ? parseFloat(feeStructure.total_fee) : 0;
      const amountPaid = parseFloat(payment.amount_paid);

      // Get all payments for this student and fee structure to compute total paid
      const allPayments = await FeePayment.findAll({
        where: {
          student_id: student.student_id,
          fee_structure_id: payment.fee_structure_id
        }
      });
      const totalPaid = allPayments.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);
      const balanceDue = totalFee - totalPaid > 0 ? totalFee - totalPaid : 0;

      return {
        payment_id: payment.id,
        receipt_no: `RCP-${payment.id}-${payment.payment_date.replace(/-/g, '')}`,
        payment_date: payment.payment_date,
        amount_paid: payment.amount_paid,
        fee_structure: feeStructure ? {
          semester: feeStructure.semester,
          academic_year: feeStructure.academic_year,
          total_fee: feeStructure.total_fee
        } : null,
        due_date: studentFee?.due_date,
        is_late: studentFee?.due_date && new Date(payment.payment_date) > new Date(studentFee.due_date),
        balance_due: balanceDue
      };
    }));

    res.json({ success: true, data: receipts });
  } catch (error) {
    console.error("Error fetching student receipts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GENERATE FEE RECEIPT (JSON) - single payment (optional)
// ==========================================
export const getFeeReceipt = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const course_id = req.user?.course_id;

    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    const data = await getReceiptData(payment_id, course_id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error generating fee receipt:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// DOWNLOAD FEE RECEIPT AS PDF - single payment
// ==========================================
export const downloadFeeReceiptPDF = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const course_id = req.user?.course_id;

    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    const data = await getReceiptData(payment_id, course_id);

    // Create PDF document
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `receipt_${payment_id}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Helper to format currency – using "Rs." for reliability
    const formatCurrency = (amount) => {
      const num = Number(amount);
      if (isNaN(num)) return 'Rs. 0.00';
      return 'Rs. ' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Manual table drawing function
    const drawTable = (doc, rows, startY) => {
      const startX = 50;
      const col1Width = 200;
      const col2Width = 150;
      const rowHeight = 20;
      let y = startY;

      // Headers
      doc.font('Helvetica-Bold').fontSize(10);
      doc.text('Fee Type', startX, y);
      doc.text('Amount (Rs.)', startX + col1Width, y, { align: 'right' });
      y += 18;

      // Header underline
      doc.moveTo(startX, y - 5)
        .lineTo(startX + col1Width + col2Width, y - 5)
        .stroke();

      // Rows
      doc.font('Helvetica').fontSize(10);
      rows.forEach((row) => {
        doc.text(row[0], startX, y);
        doc.text(row[1], startX + col1Width, y, { align: 'right' });
        y += rowHeight;
      });

      // Bottom line
      doc.moveTo(startX, y - 5)
        .lineTo(startX + col1Width + col2Width, y - 5)
        .stroke();

      return y;
    };

    // College Header
    doc.fontSize(18).font('Helvetica-Bold').text('PRESTIGIOUS INSTITUTE OF TECHNOLOGY', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('Technology Campus, Innovation Drive - University Road, Education City, Techville - 380015', { align: 'center' });
    doc.moveDown(2);

    // Title
    doc.fontSize(16).font('Helvetica-Bold').text('FEE RECEIPT', { align: 'center', underline: true });
    doc.moveDown();

    // Receipt No and Date
    doc.fontSize(10).font('Helvetica');
    doc.text(`Receipt No: ${data.receipt_no}`, { continued: false });
    doc.text(`Date: ${new Date(data.payment_date).toLocaleDateString('en-GB')}`, { align: 'right' });
    doc.moveDown(2);

    // Student Information Header
    doc.fontSize(12).font('Helvetica-Bold').text('Student Information', { underline: true });
    doc.moveDown(0.5);

    const academicYear = data.student.academic_year || 'N/A';
    const studentClass = data.student.class ? `${data.student.class} - Section ${data.student.section}` : 'N/A';

    doc.fontSize(10).font('Helvetica');
    const studentDetails = [
      { label: 'Name', value: data.student.name },
      { label: 'Student ID', value: data.student.student_id },
      { label: 'Class', value: studentClass },
      { label: 'Semester', value: data.student.semester || 'N/A' },
      { label: 'Academic Year', value: academicYear }
    ];

    let y = doc.y;
    studentDetails.forEach((item, index) => {
      const x = index % 2 === 0 ? 50 : 300;
      if (index % 2 === 0) {
        doc.text(`${item.label}: ${item.value}`, x, y, { width: 200 });
      } else {
        doc.text(`${item.label}: ${item.value}`, x, y, { width: 200 });
        y += 20;
      }
    });
    doc.y = y + 10;
    doc.moveDown();

    // Fee Structure Header
    doc.fontSize(12).font('Helvetica-Bold').text('Fee Structure', { underline: true });
    doc.moveDown(0.5);

    // Build table rows
    const tableRows = [
      ['Tuition Fee', formatCurrency(data.fee_structure.tuition_fee)],
      ['Exam Fee', formatCurrency(data.fee_structure.exam_fee)],
      ['Library Fee', formatCurrency(data.fee_structure.library_fee)],
      ['Lab Fee', formatCurrency(data.fee_structure.lab_fee)],
      ['Misc Fee', formatCurrency(data.fee_structure.misc_fee)],
      ['Total Fee', formatCurrency(data.fee_structure.total_fee)],
    ];

    if (data.balance_due > 0) {
      tableRows.push(['Balance Due', formatCurrency(data.balance_due)]);
    }
    if (data.is_late) {
      tableRows.push(['Late Fee', formatCurrency(data.late_fee)]);
      tableRows.push(['Total Paid (incl. late fee)', formatCurrency(data.total_after_late)]);
    }

    // Draw the manual table
    const tableStartY = doc.y;
    const newY = drawTable(doc, tableRows, tableStartY);
    doc.y = newY + 20;

    // Footer
    doc.fontSize(10).font('Helvetica').text('This is a computer generated receipt. No signature required.', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF receipt:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};