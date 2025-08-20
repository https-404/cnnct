import friendRouter from './friend.route';
import authRouter from './auth.route';
import healthrouter from './health.route';
import { Router } from 'express';
import userRouter from './user.route';
import requestRouter from './request.route';
import storageRouter from './storage.route';
import { authenticateToken } from '../middleware/auth.middleware';

const router: Router = Router();

router.use('/health', healthrouter);
router.use('/auth', authRouter);
router.use('/user', authenticateToken, userRouter);
router.use('/friends', friendRouter);
router.use('/requests', requestRouter);

router.use('/storage', storageRouter);

export default router;