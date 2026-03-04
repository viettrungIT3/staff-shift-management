'use strict';

/**
 * Get OCR cells for review
 * GET /api/v1/review/:imageId/cells
 */
async function getCells(req, res, next) {
  try {
    var imageId = req.params.imageId;
    
    // TODO: Query from DB
    // For now, return mock data
    var mockCells = [
      { ocrCellId: 1, rowIndex: 0, colIndex: 0, rawText: 'C.trai', normalizedText: 'C.trai', confidenceScore: 0.98, mappingStatus: 'mapped' },
      { ocrCellId: 2, rowIndex: 0, colIndex: 1, rawText: 'Tam', normalizedText: 'Tam', confidenceScore: 0.95, mappingStatus: 'mapped' },
      { ocrCellId: 3, rowIndex: 0, colIndex: 2, rawText: 'Tuan', normalizedText: 'Tuan', confidenceScore: 0.92, mappingStatus: 'mapped' }
    ];
    
    res.json({
      imageId: imageId,
      cells: mockCells,
      total: mockCells.length
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Fix OCR cell mapping manually
 * POST /api/v1/review/:ocrCellId/fix
 */
async function fixCell(req, res, next) {
  try {
    var ocrCellId = req.params.ocrCellId;
    var employeeId = req.body.employee_id;
    var normalizedText = req.body.normalized_text;
    
    // TODO: Update DB
    console.log('Fixing cell ' + ocrCellId + ' to employee ' + employeeId);
    
    res.json({
      message: 'Cell fixed successfully',
      ocrCellId: ocrCellId,
      employeeId: employeeId,
      normalizedText: normalizedText
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Approve and publish roster to duty assignments
 * POST /api/v1/review/:imageId/approve
 */
async function approveRoster(req, res, next) {
  try {
    var imageId = req.params.imageId;
    
    // TODO: Create duty_assignments from ocr_cells
    console.log('Approving roster ' + imageId);
    
    res.json({
      message: 'Roster approved and published',
      imageId: imageId,
      assignmentsCreated: 20
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCells,
  fixCell,
  approveRoster
};
