import healthrouter from './health.route';
import { Router } from 'express';

const router: Router = Router();

// Debug log to check if the request reaches this file
console.log('Request reached routes/index.ts');

router.use('/health', healthrouter);

export default router;