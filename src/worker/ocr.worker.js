'use strict';

const path = require('path');
const config = require(path.resolve(__dirname, '../shared/config/env'));
const queue = require('../shared/queue/rabbitmq');

const QUEUE_IMAGE_UPLOADED = 'roster.image.uploaded';
const HEARTBEAT_MS = Number(process.env.WORKER_HEARTBEAT_MS || 30000);

let isShuttingDown = false;

/**
 * Process OCR job
 * @param {object} job - { imageId, fileUrl, ... }
 */
async function processOcrJob(job) {
  console.log(`Processing OCR job: ${JSON.stringify(job)}`);
  
  // TODO: Implement actual OCR processing
  // 1. Download image from storage
  // 2. Preprocess image
  // 3. Detect table/grid
  // 4. OCR each cell
  // 5. Save to ocr_cells table
  
  console.log(`OCR job completed for imageId: ${job.imageId}`);
}

async function start() {
  console.log('Starting OCR worker...');
  
  // Connect to RabbitMQ
  await queue.connect(config.mq.url);
  await queue.assertQueue(QUEUE_IMAGE_UPLOADED);
  
  // Start consuming
  await queue.consume(QUEUE_IMAGE_UPLOADED, processOcrJob);
  
  // Heartbeat
  const timer = setInterval(() => {
    if (!isShuttingDown) {
      console.log('OCR worker heartbeat');
    }
  }, HEARTBEAT_MS);
  
  // Graceful shutdown
  const shutdown = async (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`Received ${signal}, shutting down OCR worker...`);
    clearInterval(timer);
    await queue.close();
    process.exit(0);
  };
  
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('Failed to start OCR worker:', err);
  process.exit(1);
});
