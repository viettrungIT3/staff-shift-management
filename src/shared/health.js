'use strict';

var db = require('./db');

async function checkDatabase() {
  try {
    await db.raw('SELECT 1');
    return { status: 'healthy', error: null };
  } catch (err) {
    return { status: 'unhealthy', error: err.message };
  }
}

async function getHealthStatus() {
  var dbHealth = await checkDatabase();
  
  return {
    status: dbHealth.status === 'healthy' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      database: dbHealth,
      queue: { status: 'unknown', error: null },
      storage: { status: 'unknown', error: null }
    },
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
}

module.exports = {
  getHealthStatus: getHealthStatus,
  checkDatabase: checkDatabase
};
