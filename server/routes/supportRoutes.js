import express from 'express';
import {
  createSupportTicket,
  getMySupportTickets,
  getAllSupportTickets,
  resolveSupportTicket,
} from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/tickets', createSupportTicket);
router.get('/tickets/my', getMySupportTickets);
router.get('/tickets', authorize('super_admin', 'admin'), getAllSupportTickets);
router.put('/tickets/:id/resolve', authorize('super_admin', 'admin'), resolveSupportTicket);

export default router;
