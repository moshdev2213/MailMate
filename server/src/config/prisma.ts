import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {PrismaClient} from '@prisma/client'
import { env } from './env';
import logger from "./logging";

const adapter = new PrismaMariaDb({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  port: env.DATABASE_PORT,
  connectionLimit: env.DATABASE_CONNECTION_LIMIT || 20,
  // Increase timeout for acquiring connections from pool (default is 10000ms)
  acquireTimeout: env.DATABASE_CONNECTION_TIMEOUT || 30000,
});

const prisma = new PrismaClient({
    adapter,
    log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
})

prisma.$on('error', (e: any) => {
  logger.error('Prisma error', { error: e });
});

prisma.$on('warn', (e: any) => {
  logger.warn('Prisma warning', { warning: e });
});

export default prisma