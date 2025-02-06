const app = require('./app');
const config = require('./config');
const logger = require('./logger');
const sequelize = require('./config/database');

async function start() {
  try {
    await sequelize.authenticate();
    logger.info(`Database connection ok (dialect=${config.db.dialect})`);
  } catch (err) {
    logger.warn(`Database connection failed on boot: ${err.message}`);
    logger.warn('Startup continuing anyway - run `npm run migrate` and `npm run seed` first.');
  }

  const server = app.listen(config.port, () => {
    logger.info(`ShopFlow API listening on http://localhost:${config.port} (${config.env})`);
  });

  const shutdown = () => {
    logger.info('Shutting down...');
    server.close(() => {
      sequelize.close().then(() => process.exit(0));
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start();
