import crypto from 'node:crypto';
import { env } from '../config/env.js';

export function requestContext(req, res, next) {
  const requestId = crypto.randomUUID();
  const start = process.hrtime.bigint();

  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(JSON.stringify({
      level: 'info',
      event: 'http.request',
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2))
    }));
  });

  next();
}

export function securityHeaders(req, res, next) {
  const isSandboxFrame = req.path === '/sandbox.html';

  if (isSandboxFrame) {
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'none'",
        "script-src 'unsafe-inline'",
        "style-src 'unsafe-inline'",
        "img-src data:",
        "font-src data:",
        "connect-src 'none'",
        "object-src 'none'",
        "base-uri 'none'",
        "frame-ancestors 'self'"
      ].join('; ')
    );
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  } else {
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self'",
        "font-src 'self'",
        "frame-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
      ].join('; ')
    );
    res.setHeader('X-Frame-Options', 'DENY');
  }

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  if (env.isProd) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
}

export function allowOnlyReadMethods(req, res, next) {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return next();
  }

  res.setHeader('Allow', 'GET, HEAD');
  return res.status(405).json({
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: `Método ${req.method} não é permitido nesta rota.`,
      requestId: req.id
    }
  });
}

export function createRateLimiter({ windowMs, maxRequests, maxTrackedIps = 5000 }) {
  const buckets = new Map();

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of buckets.entries()) {
      if (now >= entry.resetAt) {
        buckets.delete(ip);
      }
    }
  }, windowMs);

  cleanup.unref();

  return function rateLimiter(req, res, next) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = buckets.get(ip);

    if (!entry || now >= entry.resetAt) {
      if (buckets.size >= maxTrackedIps && !buckets.has(ip)) {
        const oldestKey = buckets.keys().next().value;
        buckets.delete(oldestKey);
      }
      entry = { count: 0, resetAt: now + windowMs };
      buckets.set(ip, entry);
    }

    entry.count += 1;
    const remaining = Math.max(0, maxRequests - entry.count);

    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(remaining));

    if (entry.count > maxRequests) {
      const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(Math.max(1, retryAfterSeconds)));
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Muitas requisições em pouco tempo. Tente novamente em instantes.',
          requestId: req.id
        }
      });
    }

    return next();
  };
}