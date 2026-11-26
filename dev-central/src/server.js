import http from 'node:http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { loadKnowledgeBase } from './services/guides.service.js';

async function bootstrap() {
  await loadKnowledgeBase();

  const app = createApp();
  const server = http.createServer(app);

  server.keepAliveTimeout = 5_000;
  server.headersTimeout = 10_000;
  server.requestTimeout = 15_000;

  server.listen(env.PORT, env.HOST, () => {
    console.log(JSON.stringify({
      level: 'info',
      event: 'server.started',
      env: env.NODE_ENV,
      url: `http://${env.HOST}:${env.PORT}`
    }));
  });

  let isShuttingDown = false;
  function shutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(JSON.stringify({ level: 'info', event: 'server.stopping', signal }));

    server.close(() => {
      console.log(JSON.stringify({ level: 'info', event: 'server.stopped' }));
      process.exit(0);
    });

    const forceTimer = setTimeout(() => {
      console.error(JSON.stringify({ level: 'error', event: 'server.force_exit' }));
      process.exit(1);
    }, 5_000);
    forceTimer.unref();
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    console.error(JSON.stringify({ level: 'error', event: 'process.unhandled_rejection', reason: String(reason) }));
    shutdown('unhandledRejection');
  });
  process.on('uncaughtException', (err) => {
    console.error(JSON.stringify({ level: 'error', event: 'process.uncaught_exception', message: err.message }));
    shutdown('uncaughtException');
  });
}

bootstrap().catch((err) => {
  console.error(JSON.stringify({ level: 'error', event: 'server.bootstrap_failed', message: err.message }));
  process.exit(1);
});