'use strict';
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'duty_user',
      password: process.env.DB_PASSWORD || 'duty_pass',
      database: process.env.DB_NAME || 'duty_db'
    },
    migrations: { directory: './db/migrations' },
    seeds: { directory: './db/seeds' }
  }
};
