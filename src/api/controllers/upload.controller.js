'use strict';

const storageService = require('../services/storage.service');

/**
 * Upload roster image
 * POST /api/v1/rosters/upload
 */
async function uploadRoster(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const result = await storageService.uploadRosterImage(req.file);
    
    res.status(201).json({
      message: 'File uploaded successfully',
      imageId: result.imageId,
      fileUrl: result.fileUrl
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Process uploaded image (trigger OCR)
 * POST /api/v1/rosters/:imageId/process
 */
async function processRoster(req, res, next) {
  try {
    const { imageId } = req.params;
    
    // TODO: Save to DB and publish to queue
    res.status(501).json({ 
      error: 'Not implemented',
      imageId 
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadRoster,
  processRoster
};
