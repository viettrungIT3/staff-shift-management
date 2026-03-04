'use strict';

require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 8080),
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'duty_user',
    password: process.env.DB_PASSWORD || 'duty_pass',
    database: process.env.DB_NAME || 'duty_db'
  },
  mq: {
    url: process.env.MQ_URL || 'amqp://guest:guest@localhost:5672'
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minio',
    secretKey: process.env.MINIO_SECRET_KEY || 'miniopass',
    bucket: process.env.MINIO_BUCKET || 'roster-images'
  }
};
