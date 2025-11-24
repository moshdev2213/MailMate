import { logger } from "./utils/logger.util"
import prisma from "./config/prisma";
import displayBanner from "./config/banner";
import { env } from "./config/env";
import app from "./app";

async function startServer() {
    try {
        // connect to DB in startup
        await prisma.$connect();
        logger.info("Database connected successfully");

        // display banner
        const server = app.listen(env.PORT, () => {
            displayBanner();
            logger.info(`${env.NODE_ENV} Server Running On Port ${env.PORT}`, {
                port: env.PORT,
                environment: env.NODE_ENV,
            });
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            logger.info(`${signal} received, starting graceful shutdown`);

            server.close(async () => {
                logger.info('HTTP server closed');

                try {
                    await prisma.$disconnect();
                    logger.info('Database connection closed');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during shutdown', { error });
                    process.exit(1);
                }
            });

            // Force close after 10 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    } catch (err) {
        logger.error("Failed to connect to database", { error: err });
        process.exit(1);
    }
}

startServer()