import { Router, Request, Response } from 'express';
import authRoute from './auth.routes'

const router = Router()

router.use('/auth',authRoute)

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;