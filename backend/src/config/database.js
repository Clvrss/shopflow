const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('./index');
const logger = require('../logger');

const common = {
  dialect: undefined,
  logging: config.env === 'test' ? false : (msg) => logger.debug(msg),
  define: {
    underscored: true,
    timestamps: true,
  },
  timezone: '+00:00',
};

let sequelize;

if (config.db.dialect === 'postgres') {
  sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
    ...common,
    dialect: 'postgres',
    host: config.db.host,
    port: config.db.port,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  });
} else {
  const storage =
    config.env === 'test' ? ':memory:' : config.db.storage || path.resolve(__dirname, '../../data/shopflow.sqlite');
  sequelize = new Sequelize({
    ...common,
    dialect: 'sqlite',
    storage,
    pool: { max: 1, min: 0 },
  });
}

module.exports = sequelize;
