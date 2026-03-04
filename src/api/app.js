'use strict';

var path = require('path');
var express = require('express');
var multer = require('multer');

var config = require(path.resolve(__dirname, './shared/config/env'));

var uploadController = require('./controllers/upload.controller');
var reviewRoutes = require('./routes/review.route');

var app = express();
var upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', function(req, res) {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/v1/rosters/upload', upload.single('image'), uploadController.uploadRoster);
app.post('/api/v1/rosters/:imageId/process', uploadController.processRoster);

app.use('/api/v1/review', reviewRoutes);

app.use('/api/v1/reports', function(req, res) {
  res.status(501).json({ error: 'Not implemented' });
});

app.use(function(err, req, res, next) {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

var PORT = config.port;
var server = app.listen(PORT, function() {
  console.log('API listening on port ' + PORT);
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
