const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const env = process.env.NODE_ENV || 'development';

function int(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

const config = {
  env,
  port: int(process.env.PORT, 4000),
  apiBase: process.env.API_BASE || '/api/v1',

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  bcryptRounds: int(process.env.BCRYPT_ROUNDS, 10),

  db: {
    dialect: process.env.DB_DIALECT || 'sqlite',
    host: process.env.DB_HOST || 'localhost',
    port: int(process.env.DB_PORT, 5432),
    name: process.env.DB_NAME || 'shopflow',
    user: process.env.DB_USER || 'shopflow',
    password: process.env.DB_PASSWORD || 'shopflow',
    storage: process.env.DB_STORAGE || path.resolve(__dirname, '../../data/shopflow.sqlite'),
  },

  mail: {
    host: process.env.SMTP_HOST || 'localhost',
    port: int(process.env.SMTP_PORT, 1025),
    from: process.env.MAIL_FROM || 'noreply@shopflow.test',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    // When true, outgoing mail is printed to the logs instead of being sent.
    preview: process.env.MAIL_PREVIEW !== 'false',
  },

  cache: {
    ttlMs: int(process.env.CACHE_TTL_MS, 60000),
  },

  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  webBaseUrl: process.env.WEB_BASE_URL || 'http://localhost:5173',
};

module.exports = config;
