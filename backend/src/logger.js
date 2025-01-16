const winston = require('winston');
const config = require('./config');

const logger = winston.createLogger({
  level: config.env === 'test' ? 'silent' : config.env === 'production' ? 'warn' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack, requestId, ...meta }) => {
      const req = requestId ? ` [${requestId}]` : '';
      const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      const err = stack ? `\n${stack}` : '';
      return `${timestamp} ${level.toUpperCase()}${req} ${message}${extra}${err}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    ...(config.env === 'production'
      ? [new winston.transports.File({ filename: 'logs/error.log', level: 'error' })]
      : []),
  ],
});

module.exports = logger;
