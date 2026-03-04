'use strict';

const express = require('express');
const config = require('./shared/config/env');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes (placeholder)
app.use('/api/v1/rosters', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});
app.use('/api/v1/review', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});
app.use('/api/v1/reports', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = Number(process.env.PORT || 8080);
const server = app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`Received ${signal}, shutting down API...`);
  server.close(() => {
    console.log('API shutdown complete');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = app;
