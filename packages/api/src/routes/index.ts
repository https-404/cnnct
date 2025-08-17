import authRouter from './auth.route';
import healthrouter from './health.route';
import { Router } from 'express';

const router: Router = Router();

router.use('/health', healthrouter);
router.use('/auth', authRouter);

export default router;