import express from 'express';
import {
  getStudentReceipts,
  getFeeReceipt,
  downloadFeeReceiptPDF
} from '../controllers/printFeeController.js';
import { authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(authMiddleware);

// List all paid receipts for logged-in student (filter by academic_year & semester)
router.get('/', getStudentReceipts);

// (Optional) JSON receipt for a specific payment - can be used for frontend display before downloading PDF
router.get('/:payment_id', getFeeReceipt);

// PDF download for a specific payment
router.get('/:payment_id/pdf', downloadFeeReceiptPDF);

export default router;