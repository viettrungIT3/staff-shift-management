'use strict';

require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT || '8080'),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'duty_user',
    password: process.env.DB_PASSWORD || 'duty_pass',
    database: process.env.DB_NAME || 'duty_db',
    connectionLimit: parseInt(process.env.DB_POOL_SIZE || '10')
  },
  mq: {
    url: process.env.MQ_URL || 'amqp://guest:guest@localhost:5672',
    prefetch: parseInt(process.env.MQ_PREFETCH || '1')
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minio',
    secretKey: process.env.MINIO_SECRET_KEY || 'miniopass',
    bucket: process.env.MINIO_BUCKET || 'roster-images'
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: process.env.NODE_ENV !== 'production'
  }
};
