'use strict';

var path = require('path');
var Tesseract = require('tesseract.js');

var useRealOCR = process.env.USE_REAL_OCR === 'true';
var worker = null;

async function getWorker() {
  if (!worker) {
    try {
      worker = await Tesseract.createWorker('vie');
      console.log('Tesseract OCR worker initialized');
    } catch (err) {
      console.error('Failed to initialize Tesseract:', err.message);
      return null;
    }
  }
  return worker;
}

async function processImage(imagePath, options) {
  var rows = options && options.rows ? options.rows : 4;
  var cols = options && options.cols ? options.cols : 5;
  var cells = [];
  
  console.log('OCR processing: ' + imagePath + ' (' + rows + 'x' + cols + ' grid), realOCR=' + useRealOCR);
  
  if (useRealOCR) {
    try {
      var tesseractWorker = await getWorker();
      if (tesseractWorker) {
        var result = await tesseractWorker.recognize(imagePath);
        var lines = result.data.text.split('\n').filter(function(line) {
          return line.trim().length > 0;
        });
        
        for (var r = 0; r < rows && r < lines.length; r++) {
          var parts = lines[r].trim().split(/\s+/);
          for (var c = 0; c < cols; c++) {
            cells.push({
              rowIndex: r,
              colIndex: c,
              rawText: parts[c] || '',
              normalizedText: (parts[c] || '').toLowerCase().trim(),
              confidenceScore: result.data.confidence / 100,
              bbox: { x: c * 100, y: r * 50, w: 100, h: 50 }
            });
          }
        }
        
        console.log('Real OCR completed: ' + cells.length + ' cells');
        return cells;
      }
    } catch (err) {
      console.error('Real OCR failed, using fallback:', err.message);
    }
  }
  
  // Fallback: mock data
  console.log('Using mock OCR data');
  var mockNames = [
    ['Tam', 'Tuan', 'Xuan', 'Hau'],
    ['Thang', 'Phong', 'Tung', 'Luong'],
    ['Kien', 'Cuong', 'Anh', 'Huy'],
    ['Tung', 'Nguyen', 'Nguyen', 'Vu']
  ];
  
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      var rawText = c === 0 
        ? ['C.trai', 'Choi 1', 'Choi 2', 'Choi 3', 'Choi 4'][r]
        : (mockNames[c - 1]?.[r] || 'Person_' + r + '_' + c);
      
      cells.push({
        rowIndex: r,
        colIndex: c,
        rawText: rawText,
        normalizedText: rawText.toLowerCase().trim(),
        confidenceScore: 0.95,
        bbox: { x: c * 100, y: r * 50, w: 100, h: 50 }
      });
    }
  }
  
  console.log('Mock OCR completed: ' + cells.length + ' cells');
  return cells;
}

function extractDateFromFilename(filename) {
  var match = filename.match(/(\d{2})(\d{2})(\d{4})/);
  if (match) {
    return new Date(match[3] + '-' + match[2] + '-' + match[1]);
  }
  return new Date();
}

module.exports = {
  processImage: processImage,
  extractDateFromFilename: extractDateFromFilename
};
