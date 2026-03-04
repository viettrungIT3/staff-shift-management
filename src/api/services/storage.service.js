'use strict';

const path = require('path');
const { v4: uuidv4 } = require('uuid');
const storage = require('../../shared/storage/minio');

const BUCKET_NAME = process.env.MINIO_BUCKET || 'roster-images';

/**
 * Upload roster image to MinIO
 * @param {object} file - { originalname, buffer, mimetype }
 * @returns {Promise<{imageId: string, fileUrl: string}>}
 */
async function uploadRosterImage(file) {
  // Initialize storage if needed
  const config = require('../../shared/config/env');
  storage.init(config.minio);
  await storage.ensureBucket(BUCKET_NAME);
  
  // Generate unique filename
  const ext = path.extname(file.originalname);
  const objectName = `roster_${Date.now()}_${uuidv4()}${ext}`;
  
  // Upload to MinIO
  await storage.uploadFile(BUCKET_NAME, objectName, file.buffer, file.mimetype);
  
  // Get signed URL
  const fileUrl = await storage.getSignedUrl(BUCKET_NAME, objectName);
  
  return {
    imageId: uuidv4(),
    fileUrl
  };
}

module.exports = {
  uploadRosterImage
};
