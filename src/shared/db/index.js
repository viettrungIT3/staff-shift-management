'use strict';

var knex = require('knex');
var config = require('../config/env');

var db = knex({
  client: 'mysql2',
  connection: {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
  },
  pool: { min: 0, max: 7 }
});

module.exports = db;
