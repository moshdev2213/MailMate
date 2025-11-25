import { Router } from 'express';
import { validatePagination } from '../utils/validation.util';
import { requireAuth } from '../middleware/auth.middleware';
import { emailController } from '../controllers/email.controller';

const router = Router();

router.get(
  '/',
  requireAuth,
  validatePagination,
  emailController.getEmails
);

export default router;

