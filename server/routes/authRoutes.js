import express from 'express';
import { 
  loginUser, 
  getUserProfile, 
  registerUser, 
  forgotPassword, 
  resetPassword 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Public signup and recovery routes
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
