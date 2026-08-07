import express from 'express';
import { getDashboardStats, getSummaryReport, getPublicStats } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for home/landing page live statistics
router.get('/public-stats', getPublicStats);

// Protected routes
router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/summary', getSummaryReport);

export default router;

