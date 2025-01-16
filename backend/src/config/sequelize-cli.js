const config = require('./index');

const define = { underscored: true, timestamps: true };

const pgConnection = {
  dialect: 'postgres',
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  username: config.db.user,
  password: config.db.password,
};

const sqliteConnection = {
  dialect: 'sqlite',
  storage: config.db.storage,
};

module.exports = {
  development:
    config.db.dialect === 'postgres'
      ? { ...define, ...pgConnection }
      : { ...define, ...sqliteConnection },
  test: { ...define, dialect: 'sqlite', storage: ':memory:' },
  production:
    config.db.dialect === 'postgres'
      ? { ...define, ...pgConnection }
      : { ...define, ...sqliteConnection },
};
