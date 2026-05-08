import express from "express";
import {
  createFeeStructure,
  payFee,
  adminCheckFeeStatus,
  assignFeeToStudent,
  getAllStudents
}
  from "../controllers/feeStatusController.js";
import {
  adminMiddleware,
  authMiddleware
}
  from "../middleware/authMiddleware.js";

const router = express.Router();
router.post(
  "/pay",
  authMiddleware,
  adminMiddleware,
  payFee
);


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


router.get(
  "/check-fee-status",
  authMiddleware,
  adminMiddleware,
  adminCheckFeeStatus
);
router.get(
  "/students",
  authMiddleware,
  adminMiddleware,
  getAllStudents
);

import { updateFeeStructure } from "../controllers/feeStatusController.js";

router.put(
  "/fee-structure/update/:id",
  authMiddleware,
  adminMiddleware,
  updateFeeStructure
);
export default router;
