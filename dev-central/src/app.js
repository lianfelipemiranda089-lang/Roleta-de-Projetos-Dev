import express from 'express';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { createRateLimiter, requestContext, securityHeaders } from './middlewares/security.js';
import guidesRouter from './routes/guides.routes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(requestContext);
  app.use(securityHeaders);
  app.use(
    createRateLimiter({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      maxRequests: env.RATE_LIMIT_MAX_REQUESTS
    })
  );
  app.use(express.json({ limit: '16kb', strict: true }));

  app.use('/api', guidesRouter);
  app.use('/api', notFoundHandler);

  app.use(
    express.static(env.PUBLIC_DIR, {
      dotfiles: 'deny',
      etag: true,
      maxAge: env.isProd ? '1h' : 0
    })
  );

  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'PAGE_NOT_FOUND',
        message: 'Página ainda não encontrada. A interface visual entra no Passo 3.',
        requestId: req.id
      }
    });
  });

  app.use(errorHandler);

  return app;
}