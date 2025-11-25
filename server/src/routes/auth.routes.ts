import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.get('/google', authController.initiateGoogleAuth);
router.get('/google/callback', authController.handleGoogleCallback);
router.post('/refresh', authController.refreshToken);
router.get('/me', requireAuth, authController.getCurrentUser);
router.post('/logout', requireAuth, authController.logout);

export default router;

