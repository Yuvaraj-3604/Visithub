import express from 'express';
import {
  registerVisitor,
  getVisitors,
  getVisitorById,
  approveOrRejectRequest,
  checkInVisitor,
  checkOutVisitor,
  cancelVisitorRequest
} from '../controllers/visitorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getVisitors)
  .post(authorize('receptionist'), registerVisitor);

router.route('/:id')
  .get(getVisitorById);

router.put('/:id/approve-reject', authorize('employee', 'admin'), approveOrRejectRequest);
router.put('/:id/check-in', authorize('receptionist'), checkInVisitor);
router.put('/:id/check-out', authorize('receptionist'), checkOutVisitor);
router.put('/:id/cancel', authorize('receptionist'), cancelVisitorRequest);

export default router;
