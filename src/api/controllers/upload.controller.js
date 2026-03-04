'use strict';

const rosterService = require('../services/roster.service');

/**
 * Upload roster image
 * POST /api/v1/rosters/upload
 */
async function uploadRoster(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const result = await rosterService.processRosterImage(req.file);
    
    res.status(201).json({
      message: 'File uploaded and processing started',
      imageId: result.imageId,
      dutyDate: result.dutyDate,
      cellCount: result.cells.length
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
    
    // TODO: Implement re-process logic
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
