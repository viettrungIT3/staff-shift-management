'use strict';

const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
 * Mock OCR processing - simulates extracting data from roster image
 * In production, this would use PaddleOCR/Tesseract
 * 
 * @param {string} imagePath - Path to image file
 * @param {object} options - { rows: 4, cols: 5 }
 * @returns {Promise<Array>} - Array of cell data
 */
async function processImage(imagePath, options) {
  const rows = options?.rows || 4;
  const cols = options?.cols || 5;
  const cells = [];
  
  console.log('Mock OCR processing: ' + imagePath + ' (' + rows + 'x' + cols + ' grid)');
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock cell data based on test data pattern
  const mockNames = [
    ['Tam', 'Tuan', 'Xuan', 'Hau'],
    ['Thang', 'Phong', 'Tung', 'Luong'],
    ['Kien', 'Cuong', 'Anh', 'Huy'],
    ['Tung', 'Nguyen', 'Nguyen', 'Vu'],
    ['Tam', 'Jemy', 'Hao', 'Huy']
  ];
  
  const colHeaders = ['C.trai', 'Choi 1', 'Choi 2', 'Choi 3', 'Choi 4'];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const rawText = col === 0 
        ? colHeaders[row]
        : (mockNames[col - 1]?.[row] || 'Person_' + row + '_' + col);
      
      cells.push({
        rowIndex: row,
        colIndex: col,
        rawText: rawText,
        normalizedText: rawText.trim(),
        confidenceScore: 0.95,
        bbox: {
          x: col * 100,
          y: row * 50,
          w: 100,
          h: 50
        }
      });
    }
  }
  
  console.log('Mock OCR completed: ' + cells.length + ' cells extracted');
  return cells;
}

/**
 * Extract date from image filename or metadata
 * @param {string} filename 
 * @returns {Date|null}
 */
function extractDateFromFilename(filename) {
  // Try to extract date from filename like "020232026.jpg" -> "02/02/2026"
  const match = filename.match(/(\d{2})(\d{2})(\d{4})/);
  if (match) {
    const day = match[1];
    const month = match[2];
    const year = match[3];
    return new Date(year + '-' + month + '-' + day);
  }
  return new Date(); // Default to today
}

module.exports = {
  processImage,
  extractDateFromFilename
};
