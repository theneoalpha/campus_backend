import { Router } from 'express';
import { registerUser, loginUser, getUserDetails, approveUser } from '../controllers/userController';
import { verifyToken, isAdmin } from '../middleware/auth';

const router = Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Authenticated Routes
router.get('/profile', verifyToken, getUserDetails);

// Admin Routes
router.put('/approve/:userId', verifyToken, isAdmin, approveUser);

export default router;
