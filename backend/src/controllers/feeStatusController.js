// Fee-status Controller

import { sequelize } from "../config/db.js";
import { FeePayment } from "../model/FeePayment.js";
import { StudentFee } from "../model/StudentFees.js";
import { FeeStructure } from "../model/FeeStructure.js";
import { Student } from "../model/Student.js";
import { assignStudentFees } from "../services/assignStudentFeesService.js";


// CREATE FEE STRUCTURE
export const createFeeStructure = async (req, res) => {
  try {
    const {
      semester,
      academic_year,
      tuition_fee,
      exam_fee = 0,
      library_fee = 0,
      lab_fee = 0,
      misc_fee = 0,
    } = req.body;

    const course_id = req.user.course_id;

    if (!course_id || !semester || !academic_year || !tuition_fee) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const total_fee =
      Number(tuition_fee) +
      Number(exam_fee) +
      Number(library_fee) +
      Number(lab_fee) +
      Number(misc_fee);

    const feeStructure = await FeeStructure.create({
      course_id,
      semester,
      academic_year,
      tuition_fee,
      exam_fee,
      library_fee,
      lab_fee,
      misc_fee,
      total_fee,
    });

    await assignStudentFees(feeStructure.id);

    res.status(201).json({
      message: "Fee Structure created successfully",
      data: feeStructure,
    });

  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Fee structure already exists",
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// UPDATE FEE STRUCTURE
export const updateFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      semester,
      academic_year,
      tuition_fee,
      exam_fee = 0,
      library_fee = 0,
      lab_fee = 0,
      misc_fee = 0,
    } = req.body;

    const course_id = req.user.course_id;

    // Check if exists
    const feeStructure = await FeeStructure.findOne({
      where: { id, course_id },
    });

    if (!feeStructure) {
      return res.status(404).json({
        message: "Fee structure not found",
      });
    }

    // Calculate new total
    const total_fee =
      Number(tuition_fee || 0) +
      Number(exam_fee || 0) +
      Number(library_fee || 0) +
      Number(lab_fee || 0) +
      Number(misc_fee || 0);

    // Update
    await feeStructure.update({
      semester: semester || feeStructure.semester,
      academic_year: academic_year || feeStructure.academic_year,
      tuition_fee: tuition_fee || feeStructure.tuition_fee,
      exam_fee,
      library_fee,
      lab_fee,
      misc_fee,
      total_fee,
    });

    res.json({
      message: "Fee Structure updated successfully",
      data: feeStructure,
    });

  } catch (error) {
    console.log(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Duplicate fee structure",
      });
    }

    res.status(500).json({ error: error.message });
  }
};

// ASSIGN FEE TO STUDENT
export const assignFeeToStudent = async (req, res) => {
  try {
    const { student_id, fee_structure_id, assigned_date, due_date } = req.body;

    if (!student_id || !fee_structure_id || !assigned_date || !due_date) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const fee = await StudentFee.create({
      student_id,
      fee_structure_id,
      assigned_date,
      due_date,
    });

    res.status(201).json({
      message: "Fee assigned to student",
      data: fee,
    });

  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Fee already assigned to this student",
      });
    }
    res.status(500).json({ error: error.message });
  }
};



// PAY FEE (WITH TRANSACTION)
export const payFee = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      student_id,
      fee_structure_id,
      amount_paid,
      payment_mode,
      reference_no,
      payment_date,
      remarks,
    } = req.body;
    console.log(req.body);

    const received_by = req.user.uid;

    if (
      !student_id ||
      !fee_structure_id ||
      !amount_paid ||
      !payment_mode ||
      !payment_date
    ) {
      await t.rollback();
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    // Check Fee Structure
    const feeStructure = await FeeStructure.findByPk(fee_structure_id);

    if (!feeStructure) {
      await t.rollback();
      return res.status(404).json({
        message: "Fee structure not found",
      });
    }

    // Check if fee assigned to student
    const studentFee = await StudentFee.findOne({
      where: { student_id, fee_structure_id },
    });

    if (!studentFee) {
      await t.rollback();
      return res.status(400).json({
        message: "Fee not assigned to this student",
      });
    }

    const alreadyPaid =
      (await FeePayment.sum("amount_paid", {
        where: { student_id, fee_structure_id },
      })) || 0;

    const pending = Number(feeStructure.total_fee) - alreadyPaid;

    if (Number(amount_paid) > pending) {
      await t.rollback();
      return res.status(400).json({
        message: "Amount exceeds pending fees",
        pending_amount: pending,
      });
    }

    const payment = await FeePayment.create(
      {
        student_id,
        fee_structure_id,
        amount_paid,
        payment_mode,
        reference_no,
        payment_date,
        received_by,
        remarks,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      message: "Fee payment successful",
      data: {
        payment,
        total_fee: feeStructure.total_fee,
        paid_amount: alreadyPaid + Number(amount_paid),
        remaining_amount: pending - Number(amount_paid),
      },
    });

  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};



// ADMIN CHECK FEE STATUS
export const adminCheckFeeStatus = async (req, res) => {
  try {
    const { student_id, academic_year , semester} = req.query;
    

    if (!student_id || !academic_year) {
      return res.status(400).json({
        message: "Required fields",
      });
    }
    const feeStructure = await FeeStructure.findOne({where:{semester , academic_year , course_id:req.user.course_id}});
    const studentFee = await StudentFee.findOne({
      where: { student_id  },
      include: [
        {
          model: Student,
          attributes: ["student_id", "name" ],
        },
        {
          model: FeeStructure,
          where: { academic_year , semester },
        },
      ],
    });

    if (!studentFee) {
      return res.status(404).json({
        message: "Fee not assigned to student",
      });
    }

    const student = studentFee.Student;
    

    const payments = await FeePayment.findAll({
      where: {
        student_id,
        fee_structure_id: feeStructure.id,
      },
      order: [["payment_date", "ASC"]],
    });

    const paid_amount = payments.reduce(
      (sum, p) => sum + Number(p.amount_paid),
      0
    );

    const remaining_amount =
      Number(feeStructure.total_fee) - paid_amount;

    const paymentHistory = payments.map((p, index) => ({
      installment_no: index + 1,
      amount_paid: p.amount_paid,
      payment_mode: p.payment_mode,
      payment_date: p.payment_date,
    }));

    res.json({
      student: {
        student_id: student.student_id,
        student_name: student.name,
        academic_year,
      },
      feeSummary: {
        total_fee: feeStructure.total_fee,
        paid_amount,
        remaining_amount,
        payment_status:
          remaining_amount === 0 ? "Paid" : "Pending",
        due_date:studentFee.due_date,
        fee_id:feeStructure.id
      },
      paymentHistory,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};



// GET ALL STUDENTS
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: ["student_id", "name"],
      where:{course_id:req.user.course_id}
    });

    res.json(students);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
