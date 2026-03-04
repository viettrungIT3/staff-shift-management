'use strict';

const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../../shared/config/env'); // TODO: Add knex connection
const queue = require('../../shared/queue/rabbitmq');
const ocrService = require('./ocr.service');
const storage = require('../../shared/storage/minio');

const QUEUE_IMAGE_UPLOADED = 'roster.image.uploaded';

/**
 * Process uploaded roster image
 * 1. Save image metadata to DB
 * 2. Run OCR on image
 * 3. Save OCR cells to DB
 * 4. Publish to queue for mapping
 * 
 * @param {object} file - Uploaded file
 * @returns {Promise<{imageId: string, dutyDate: Date, cells: Array}>}
 */
async function processRosterImage(file) {
  const config = require('../../shared/config/env');
  
  // Initialize storage
  storage.init(config.minio);
  await storage.ensureBucket(config.minio.bucket);
  
  // Generate unique ID and save file
  const imageId = uuidv4();
  const ext = path.extname(file.originalname);
  const objectName = `roster_${Date.now()}_${imageId}${ext}`;
  
  await storage.uploadFile(config.minio.bucket, objectName, file.buffer, file.mimetype);
  const fileUrl = await storage.getSignedUrl(config.minio.bucket, objectName);
  
  // Extract date from filename
  const dutyDate = ocrService.extractDateFromFilename(file.originalname);
  
  // Mock OCR processing (in production, this would be async job)
  const cells = await ocrService.processImage(objectName);
  
  // TODO: Save to DB (roster_images, ocr_cells)
  // For now, return mock data
  
  console.log(`Roster processed: imageId=${imageId}, date=${dutyDate.toISOString()}, cells=${cells.length}`);
  
  // Publish to queue for mapping worker
  try {
    await queue.connect(config.mq.url);
    await queue.publish(QUEUE_IMAGE_UPLOADED, {
      imageId,
      fileUrl,
      dutyDate: dutyDate.toISOString(),
      cellCount: cells.length
    });
  } catch (err) {
    console.error('Failed to publish to queue:', err);
  }
  
  return {
    imageId,
    dutyDate,
    cells,
    fileUrl
  };
}

module.exports = {
  processRosterImage
};
