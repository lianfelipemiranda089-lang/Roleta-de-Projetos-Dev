import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

function parsePositiveInt(value, fallback, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return fallback;
  }
  return parsed;
}

const nodeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export const env = Object.freeze({
  NODE_ENV: nodeEnv,
  isProd: nodeEnv === 'production',
  HOST: process.env.HOST?.trim() || '127.0.0.1',
  PORT: parsePositiveInt(process.env.PORT, 3000, { min: 1, max: 65535 }),
  RATE_LIMIT_WINDOW_MS: parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000, { min: 1_000 }),
  RATE_LIMIT_MAX_REQUESTS: parsePositiveInt(process.env.RATE_LIMIT_MAX_REQUESTS, 120, { min: 10 }),
  ROOT_DIR,
  DATA_DIR: path.join(ROOT_DIR, 'src', 'data'),
  GUIDES_DIR: path.join(ROOT_DIR, 'src', 'data', 'guides'),
  PUBLIC_DIR: path.join(ROOT_DIR, 'public')
});