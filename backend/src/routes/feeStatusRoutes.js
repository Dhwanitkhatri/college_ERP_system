import express from "express";
import {
    createFeeStructure,
    payFee,
    adminCheckFeeStatus,
    assignFeeToStudent }
     from "../controllers/feeStatusController.js";
import { 
    adminMiddleware ,
    authMiddleware } 
    from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/fee-structure/create",
  authMiddleware,
  adminMiddleware,
  createFeeStructure
);

router.post(
  "/student-fee/assign",
  authMiddleware,
  adminMiddleware,
  assignFeeToStudent
);

router.post(
  "/pay",
  authMiddleware,
  adminMiddleware,
  payFee
);

router.get(
  "/check-fee-status",
  authMiddleware,
  adminMiddleware,
  adminCheckFeeStatus
);

export default router;
