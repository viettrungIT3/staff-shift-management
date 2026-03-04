'use strict';

var path = require('path');
var uuidv4 = require('uuid').v4;
var db = require('../../shared/db');
var ocrService = require('./ocr.service');
var storage = require('../../shared/storage/minio');

async function processRosterImage(file) {
  var config = require('../../shared/config/env');
  
  storage.init(config.minio);
  await storage.ensureBucket(config.minio.bucket);
  
  var ext = path.extname(file.originalname);
  var objectName = 'roster_' + Date.now() + '_' + uuidv4() + ext;
  
  await storage.uploadFile(config.minio.bucket, objectName, file.buffer, file.mimetype);
  var fileUrl = await storage.getSignedUrl(config.minio.bucket, objectName);
  
  var dutyDate = ocrService.extractDateFromFilename(file.originalname);
  var imageId = uuidv4();
  
  // Process OCR
  var cells = await ocrService.processImage(objectName);
  
  // Use transaction for atomic writes
  await db.transaction(async function(trx) {
    // Insert image record - use string for image_id
    await trx('roster_images').insert({
      image_id: imageId,
      source_type: 'upload',
      file_url: fileUrl,
      captured_at: dutyDate,
      upload_time: new Date(),
      ocr_status: 'processing',
      ocr_engine: 'mock'
    });
    
    // Batch insert OCR cells
    var cellRecords = cells.map(function(cell) {
      return {
        image_id: imageId,
        row_index: cell.rowIndex,
        col_index: cell.colIndex,
        bbox_x: cell.bbox.x,
        bbox_y: cell.bbox.y,
        bbox_w: cell.bbox.w,
        bbox_h: cell.bbox.h,
        raw_text: cell.rawText,
        normalized_text: cell.normalizedText,
        confidence_score: cell.confidenceScore,
        mapping_status: 'unmapped',
        created_at: new Date()
      };
    });
    
    await trx('ocr_cells').insert(cellRecords);
    
    // Update image status
    await trx('roster_images').where('image_id', imageId).update({
      ocr_status: 'done',
      overall_confidence: 0.95
    });
  });
  
  console.log('Roster processed: imageId=' + imageId + ', date=' + dutyDate.toISOString() + ', cells=' + cells.length);
  
  return {
    imageId: imageId,
    dutyDate: dutyDate,
    cells: cells,
    fileUrl: fileUrl
  };
}

module.exports = {
  processRosterImage: processRosterImage
};
