import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.util';
import { emailService } from '../services/email.service';
import { logger } from '../utils/logger.util';
import { appConfig } from '../config/app';

class EmailController {
  async getEmails(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 'UNAUTHORIZED', 401);
      }

      const limit = parseInt(req.query.limit as string, 10) || 20;
      const offset = parseInt(req.query.offset as string, 10) || 0;

      // Optionally fetch fresh emails from Gmail
      const shouldRefresh = req.query.refresh === 'true';

      if (shouldRefresh) {
        // Get fetch limit from query param or use default, with max limit protection
        const requestedFetchLimit = parseInt(req.query.fetchLimit as string, 10) || appConfig.email.defaultFetchLimit;
        const fetchLimit = Math.min(requestedFetchLimit, appConfig.email.maxFetchLimit);

        await emailService.fetchEmailsFromGmail(req.user.id, fetchLimit);
      }

      const result = await emailService.getEmailsFromDatabase(
        req.user.id,
        limit,
        offset
      );

      sendSuccess(res, {
        emails: result.emails,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.offset + result.limit < result.total,
        },
      });
    } catch (error) {
      logger.error('Failed to get emails', { error, userId: req.user?.id });
      next(error);
    }
  }
};

export const emailController = new EmailController()