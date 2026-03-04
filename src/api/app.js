'use strict';

const path = require('path');
const express = require('express');
const multer = require('multer');

// Load config with correct path
const config = require(path.resolve(__dirname, '../shared/config/env'));

const uploadController = require(path.resolve(__dirname, './controllers/upload.controller'));

const app = express();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.post('/api/v1/rosters/upload', upload.single('image'), uploadController.uploadRoster);
app.post('/api/v1/rosters/:imageId/process', uploadController.processRoster);

app.use('/api/v1/review', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});
app.use('/api/v1/reports', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = config.port;
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
