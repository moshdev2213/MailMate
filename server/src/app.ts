import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors'
import { appConfig } from './config/app';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './utils/logger.util';
import { env } from './config/env';

const app = express()

// middleware
app.use(cors(appConfig.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// request loggings
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info('Incoming Request', {
        method: req.method,
        path: req.path,
        ip: req.ip
    })
    next()
})

app.get("/", (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        message: `${env.NODE_ENV} Server Online`,
        timestamp:new Date().toISOString()
    })
})


// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;