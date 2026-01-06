// Fee-status Controllerr..
import { FeePayment } from "../model/FeePayment";   
import { StudentFee } from "../model/StudentFees";
import { FeeStructure } from "../model/FeeStructure";
import { Student } from "../model/Student";
import { where } from "sequelize";

export const createFeeStructure = async(req , res) => {
    try{
        const {
            course_id,
            semester,
            academic_year,
            tution_fee,
            exam_fee = 0,
            libarary_fee = 0,
            lab_fee = 0,
            misc_fee = 0
        } = req.body;

        if(!course_id || !semester || !academic_year || !tution_fee)
        {
            return res.status(404).json({message : "Reuired fields .."});
        }

        const total_fee = 
        Number(tution_fee) + 
        Number(exam_fee) + 
        Number(libarary_fee) +
        Number(lab_fee) + 
        Number(misc_fee);

        const feeStructures = await FeeStructure.create({
            course_id,
            semester,
            academic_year,
            tution_fee,
            exam_fee,
            libarary_fee,
            lab_fee,
            misc_fee,
            total_fee
        });

        res.status(201).json({
            message : "Fee Structure created succesfully",
            data : feeStructures,
        })
    }catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Fee structure already exists",
      });
    }
    res.status(500).json({ error: error.message });
  }
};

export const assignFeeToStudent = async (req,res) => {
    try{
        const {
             student_id,
             fee_structure_id,
             assigned_date,
             due_date
        } = req.body;

        if(!student_id || !fee_structure_id || !assigned_date || !due_date){
            res.status(402).json({message:"All fields are required"});
        }
        const fee = await StudentFee.create({
            student_id,
            fee_structure_id,
            assigned_date,
            due_date,
        });

        res.status(201).json({
            message:"Fee asigned to student",
            data:fee,
        });
    }catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Fee already assigned to this student",
      });
    }
    res.status(500).json({ error: error.message });
  }
};

export const payFee = async (req,res) => {
    try{
        const {
            student_id,
            fee_structure_id,
            amount_paid,
            paymant_mode,
            reference_no,
            paymant_date,
            remarks,
        } = req.body;

        const received_by = req.user.uid;

        if(
            !student_id ||
            !fee_structure_id||
            !amount_paid||
            !paymant_mode||
            !paymant_date
        ){
            return res.status(400).json({
                message : "Required Fields ."
            });
        }

        const feeStructures = await FeeStructure.findByPk(fee_structure_id);
        if(!feeStructures){
            return res.status(404).json({
                message : "Fee structure not found"
            });
        }

        const alreadyPaid = (await FeePayment.sum(amount_paid,{
            where:{student_id,fee_structure_id}
        })) || 0;

        const pending = Number(feeStructures.total_fee) - alreadyPaid;

        if(amount_paid > pending){
            return res.status(400).json({
                message:"Amount exceeds pending fees",
                pending_amount : pending
            });
        }

        const payment = await FeePayment.create({
            student_id,
            fee_structure_id,
            amount_paid,
            paymant_mode,
            reference_no,
            paymant_date,
            received_by,
            remarks,
        });
        res.status(201).json({
            message : "fee payment donee..",
            data:{
                payment,
                total_fee : feeStructures.total_fee,
                paid_amount : alreadyPaid + Number(amount_paid),
                remaining_amount : pending - Number(amount_paid)
            },
        });
    }catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const adminCheckFeeStatus = async (req,res) => {
    try{
        const { student_id , academic_year} = req.body;

        if(!student_id || !academic_year){
            return res.status(400).json({
                message : "Requires fields"
            });
        }

        const studentFee = await StudentFee.findOne({
            where:{student_id},
            include:[{
                model : FeeStructure,
                as:"feeStructure",
                where:{academic_year},
            }],
        });
        if(!studentFee){
            return res.status(404).json({
                message : "Fee not assigned to students"
            });
        }

        const feeStructure = studentFee.feeStructure;

        const payments = await FeePayment.findAll({
            where: {
                student_id,
                fee_structure_id : feeStructure.id,
            },
            order:[["payment_date" , "ASC"]]
        });

        const paid_amount = payments.reduce(
            (sum , p) => sum + Number(p.amount_paid),
            0
        );

        const remaining_amount = 
        Number(feeStructure.total_fee) - paid_amount;

        const paymentHistory = payments.map((p,index) => ({
            installment_no : index + 1 ,
            amount_paid : p.amount_paid,
            paymant_mode: p.paymant_mode,
            paymant_date:p.paymant_date,
        }));

        res.json({
      student: {
        student_id,
        academic_year,
      },
      feeSummary: {
        total_fee: feeStructure.total_fee,
        paid_amount,
        remaining_amount,
        payment_status:
          remaining_amount === 0 ? "Paid" : "Pending",
      },
      paymentHistory,
    });


    }catch (error) {
    res.status(500).json({ error: error.message });
  }
};
