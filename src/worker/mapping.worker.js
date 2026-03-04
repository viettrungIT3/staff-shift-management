'use strict';

const path = require('path');
const config = require(path.resolve(__dirname, '../shared/config/env'));
const queue = require('../shared/queue/rabbitmq');

const QUEUE_OCR_COMPLETED = 'ocr.cell.completed';
const HEARTBEAT_MS = Number(process.env.WORKER_HEARTBEAT_MS || 30000);

let isShuttingDown = false;

/**
 * Process mapping job
 * @param {object} job - { ocrCellId, rawText, ... }
 */
async function processMappingJob(job) {
  console.log(`Processing mapping job: ${JSON.stringify(job)}`);
  
  // TODO: Implement actual mapping logic
  // 1. Normalize text
  // 2. Fuzzy match with employee dictionary
  // 3. Calculate confidence score
  // 4. Update ocr_cells with mapped_employee_id
  
  console.log(`Mapping job completed for ocrCellId: ${job.ocrCellId}`);
}

async function start() {
  console.log('Starting Mapping worker...');
  
  // Connect to RabbitMQ
  await queue.connect(config.mq.url);
  await queue.assertQueue(QUEUE_OCR_COMPLETED);
  
  // Start consuming
  await queue.consume(QUEUE_OCR_COMPLETED, processMappingJob);
  
  // Heartbeat
  const timer = setInterval(() => {
    if (!isShuttingDown) {
      console.log('Mapping worker heartbeat');
    }
  }, HEARTBEAT_MS);
  
  // Graceful shutdown
  const shutdown = async (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`Received ${signal}, shutting down Mapping worker...`);
    clearInterval(timer);
    await queue.close();
    process.exit(0);
  };
  
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('Failed to start Mapping worker:', err);
  process.exit(1);
});
