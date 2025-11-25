import { Router } from 'express';
import { validatePagination } from '../utils/validation.util';
import { requireAuth } from '../middleware/auth.middleware';
import { emailController } from '../controllers/email.controller';

const router = Router();

/**
 * @swagger
 * /api/email:
 *   get:
 *     summary: Get emails
 *     description: Retrieves paginated list of emails for the authenticated user. Optionally fetches fresh emails from Gmail.
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Number of emails to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of emails to skip
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter emails
 *       - in: query
 *         name: refresh
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Whether to fetch fresh emails from Gmail
 *       - in: query
 *         name: fetchLimit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of emails to fetch from Gmail when refresh=true
 *     responses:
 *       200:
 *         description: Emails retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     emails:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Email'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/',
  requireAuth,
  validatePagination,
  emailController.getEmails
);

export default router;

