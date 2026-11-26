import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
      requestId: req.id
    }
  });
}

export function errorHandler(err, req, res, _next) {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Erro interno inesperado no servidor.';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else if (err?.type === 'entity.parse.failed') {
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'Corpo da requisição não é um JSON válido.';
  } else if (err?.type === 'entity.too.large') {
    statusCode = 413;
    code = 'PAYLOAD_TOO_LARGE';
    message = 'O tamanho da requisição excede o limite permitido.';
  }

  console.error(JSON.stringify({
    level: statusCode >= 500 ? 'error' : 'warn',
    event: 'http.error',
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    code,
    message: err?.message,
    ...(env.isProd ? {} : { stack: err?.stack })
  }));

  res.status(statusCode).json({
    error: {
      code,
      message,
      requestId: req.id
    }
  });
}