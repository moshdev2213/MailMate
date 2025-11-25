import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MailMate API',
      version: '1.0.0',
      description: 'API documentation for MailMate - Full-stack Gmail IMAP viewer',
      contact: {
        name: 'API Support',
        email: 'support@mailmate.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
      {
        url: 'https://api.mailmate.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from /api/auth/google/callback or /api/auth/refresh',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Error message',
                },
                code: {
                  type: 'string',
                  example: 'ERROR_CODE',
                },
              },
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            email: {
              type: 'string',
              example: 'user@example.com',
            },
            name: {
              type: 'string',
              nullable: true,
              example: 'John Doe',
            },
          },
        },
        Email: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            messageId: {
              type: 'string',
              example: '<message-id@example.com>',
            },
            subject: {
              type: 'string',
              example: 'Test Email',
            },
            from: {
              type: 'string',
              example: 'sender@example.com',
            },
            to: {
              type: 'string',
              example: 'recipient@example.com',
            },
            date: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00Z',
            },
            body: {
              type: 'string',
              example: 'Email body content',
            },
            read: {
              type: 'boolean',
              example: false,
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              example: 100,
            },
            limit: {
              type: 'integer',
              example: 20,
            },
            offset: {
              type: 'integer',
              example: 0,
            },
            hasMore: {
              type: 'boolean',
              example: true,
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Email',
        description: 'Email management endpoints',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

