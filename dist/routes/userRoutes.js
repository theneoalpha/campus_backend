import { Router } from 'express';
import { registerUser, loginUser, getUserDetails, approveUser, getAllUsers } from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', verifyToken, getUserDetails);

router.put('/approve/:userId', verifyToken, isAdmin, approveUser);

router.get('/users', verifyToken, isAdmin, getAllUsers);
export default router;


