'use strict';

var db = require('../../shared/db');

async function getCells(req, res, next) {
  try {
    var imageId = req.params.imageId;
    
    var cells = await db('ocr_cells')
      .select(
        'ocr_cell_id as ocrCellId',
        'row_index as rowIndex',
        'col_index as colIndex',
        'raw_text as rawText',
        'normalized_text as normalizedText',
        'confidence_score as confidenceScore',
        'mapping_status as mappingStatus'
      )
      .where('image_id', imageId);
    
    res.json({
      imageId: imageId,
      cells: cells,
      total: cells.length
    });
  } catch (err) {
    next(err);
  }
}

async function fixCell(req, res, next) {
  try {
    var ocrCellId = req.params.ocrCellId;
    var employeeId = req.body.employee_id;
    var normalizedText = req.body.normalized_text;
    
    await db('ocr_cells')
      .where('ocr_cell_id', ocrCellId)
      .update({
        mapped_employee_id: employeeId,
        normalized_text: normalizedText,
        mapping_status: 'manual_fixed',
        created_at: new Date()
      });
    
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

async function approveRoster(req, res, next) {
  try {
    var imageId = req.params.imageId;
    
    // Use transaction for atomic writes
    await db.transaction(async function(trx) {
      // Get all OCR cells for this image
      var cells = await trx('ocr_cells')
        .select('row_index', 'col_index', 'mapped_employee_id')
        .where('image_id', imageId)
        .whereIn('mapping_status', ['mapped', 'manual_fixed']);
      
      // Get duty date from roster_images
      var imageRecord = await trx('roster_images')
        .select('captured_at')
        .where('image_id', imageId)
        .first();
      
      var dutyDate = imageRecord ? imageRecord.captured_at : new Date();
      
      // Get positions and shifts
      var positions = await trx('positions').select('position_id', 'position_code');
      var shifts = await trx('shifts').select('shift_id', 'shift_code');
      
      var positionMap = {};
      positions.forEach(function(p) { positionMap[p.position_code] = p.position_id; });
      
      var shiftMap = {};
      shifts.forEach(function(s) { shiftMap[s.shift_code] = s.shift_id; });
      
      var assignments = [];
      
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (cell.mapped_employee_id && cell.row_index !== null && cell.col_index !== null) {
          var shiftCode = 'CA_' + (cell.row_index + 1);
          var positionCode = cell.col_index === 0 ? 'C_TRAI' : 'CHOI_' + cell.col_index;
          
          assignments.push({
            duty_date: dutyDate,
            shift_id: shiftMap[shiftCode],
            position_id: positionMap[positionCode],
            employee_id: cell.mapped_employee_id,
            source_image_id: imageId,
            source_type: 'ocr',
            status: 'confirmed',
            version_no: 1,
            effective_from: new Date(),
            created_at: new Date()
          });
        }
      }
      
      if (assignments.length > 0) {
        await trx('duty_assignments').insert(assignments);
      }
    });
    
    res.json({
      message: 'Roster approved and published',
      imageId: imageId
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCells: getCells,
  fixCell: fixCell,
  approveRoster: approveRoster
};
