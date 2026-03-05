'use strict';

var path = require('path');
var express = require('express');
var multer = require('multer');

var config = require(path.resolve(__dirname, './shared/config/env'));
var health = require(path.resolve(__dirname, './shared/health'));

var uploadController = require('./controllers/upload.controller');
var reviewRoutes = require('./routes/review.route');
var reportRoutes = require('./routes/report.route');
var authRoutes = require('./routes/auth.route');
var validator = require('./middleware/validator');
var authMiddleware = require('./middleware/auth');

var app = express();
var upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async function(req, res) {
  var healthStatus = await health.getHealthStatus();
  var statusCode = healthStatus.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
});

app.get('/ready', async function(req, res) {
  var dbHealth = await health.checkDatabase();
  if (dbHealth.status === 'healthy') {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready', error: dbHealth.error });
  }
});

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/rosters', authMiddleware.authenticate);
app.post('/api/v1/rosters/upload', upload.single('image'), validator.validateUpload, uploadController.uploadRoster);
app.post('/api/v1/rosters/:imageId/process', uploadController.processRoster);

app.use('/api/v1/review', authMiddleware.authenticate, reviewRoutes);
app.use('/api/v1/reports', authMiddleware.authenticate, reportRoutes);

app.use(function(err, req, res, next) {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

var PORT = config.port;
var server = app.listen(PORT, function() {
  console.log('API listening on port ' + PORT + ' in ' + config.nodeEnv + ' mode');
});

var shutdown = function(signal) {
  console.log('Received ' + signal + ', shutting down API...');
  server.close(function() {
    console.log('API shutdown complete');
    process.exit(0);
  });
};

process.on('SIGINT', function() { shutdown('SIGINT'); });
process.on('SIGTERM', function() { shutdown('SIGTERM'); });

module.exports = app;
