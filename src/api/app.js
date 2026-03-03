'use strict';

const express = require('express');

const app = express();
const PORT = Number(process.env.PORT || 8080);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

const server = app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});

const shutdown = (signal) => {
  console.log(`Received ${signal}, shutting down API...`);
  server.close(() => {
    console.log('API shutdown complete');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
