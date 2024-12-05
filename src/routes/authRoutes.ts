import { Router, RequestHandler } from 'express';
import { registerUser, loginUser, refreshUser, logoutUser } from '../controllers/authController';

const router = Router();

router.post('/register', registerUser as RequestHandler);
router.post('/login', loginUser as RequestHandler);
router.post('/refresh', refreshUser as RequestHandler); 
router.post('/logout', logoutUser as RequestHandler); 

export default router;
