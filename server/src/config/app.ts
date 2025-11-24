import { env } from './env';

export const appConfig = {
  port: env.PORT,
  frontendUrl: env.FRONTEND_URL,
  cors: {
    origin: env.FRONTEND_URL.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  }
};

