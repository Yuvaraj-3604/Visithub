import express from 'express';
import { 
  getEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} from '../controllers/employeeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getEmployees)
  .post(authorize('admin'), createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(authorize('admin'), updateEmployee)
  .delete(authorize('admin'), deleteEmployee);

export default router;
