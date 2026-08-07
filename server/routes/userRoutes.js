import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js'; // Wait, let's make sure the path is correct. Our folder structure is server/middleware/roleMiddleware.js. Oh, let's verify where roleMiddleware is.
// Let's check: server/middleware/roleMiddleware.js is where roleMiddleware is. Let's make sure path is '../middleware/roleMiddleware.js'.
// In previous file: userController had no imports, but userRoutes needs it. Let's make it '../middleware/roleMiddleware.js'.

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

export default router;
