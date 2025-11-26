import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors'
import swaggerUi from 'swagger-ui-express';
import { appConfig } from './config/app';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './utils/logger.util';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import routes from './routes/index.routes';

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

// Swagger documentation
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MailMate API Documentation',
}));

// app api routes
app.use('/api',routes)

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