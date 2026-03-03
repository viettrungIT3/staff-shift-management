'use strict';

const HEARTBEAT_MS = Number(process.env.WORKER_HEARTBEAT_MS || 30000);

console.log('OCR worker started');

const timer = setInterval(() => {
  console.log('OCR worker heartbeat');
}, HEARTBEAT_MS);

const shutdown = (signal) => {
  clearInterval(timer);
  console.log(`Received ${signal}, shutting down OCR worker...`);
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
