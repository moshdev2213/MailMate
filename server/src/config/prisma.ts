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
  connectionLimit: 5,
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