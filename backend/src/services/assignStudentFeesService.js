import { Student, Class, FeeStructure, StudentFee, FeePayment } from "../model/index.js";
import { Sequelize } from "sequelize";

export const assignStudentFees = async (new_fee_structure_id) => {
  const newFeeStructure = await FeeStructure.findByPk(new_fee_structure_id);
  if (!newFeeStructure) {
    throw new Error("Fee structure not found");
  }

  // Find all students eligible for this fee structure
  const students = await Student.findAll({
    include: {
      model: Class,
      where: {
        course_id: newFeeStructure.course_id,
        semester: newFeeStructure.semester,
        academic_year: newFeeStructure.academic_year
      }
    }
  });

  for (const student of students) {

    // 
    const existingStudentFee = await StudentFee.findOne({
      where: { student_id: student.student_id },
      include: [
        {
          model: FeeStructure,
          as: "feeStructure" //  MUST match alias
        }
      ]
    });

    // If no fee assigned yet → assign directly
    if (!existingStudentFee) {
      await StudentFee.create({
        student_id: student.student_id,
        fee_structure_id: newFeeStructure.id,
        assigned_date: new Date(),
        due_date: calculateDueDate()
      });
      continue;
    }

    // Calculate total paid for current fee structure
    const totalPaid =
      (await FeePayment.sum("amount_paid", {
        where: {
          student_id: student.student_id,
          fee_structure_id: existingStudentFee.fee_structure_id
        }
      })) || 0;

    // 🔴 FIX 2: access via alias
    const oldTotalFee = existingStudentFee.feeStructure.total_fee;

    // If fee is still PENDING → update to latest fee structure
    if (totalPaid < oldTotalFee) {
      await existingStudentFee.update({
        fee_structure_id: newFeeStructure.id,
        assigned_date: new Date(),
        due_date: calculateDueDate()
      });
    }
    // else → FULLY PAID → DO NOTHING
  }

  return {
    message: "Student fees assigned/updated successfully"
  };
};

const calculateDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 15);
  return date;
};
