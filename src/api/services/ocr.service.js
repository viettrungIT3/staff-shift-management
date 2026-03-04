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
async function processImage(imagePath, options = { rows: 4, cols: 5 }) {
  const { rows, cols } = options;
  const cells = [];
  
  console.log(`Mock OCR processing: ${imagePath} (${rows}x${cols} grid)`);
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock cell data based on test data pattern
  // In real implementation, this would:
  // 1. Preprocess image (deskew, denoise)
  // 2. Detect table grid
  // 3. OCR each cell
  // 4. Normalize text
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const mockNames = [
        ['Tâm', 'Tuấn', 'Xuân', 'Hậu'],
        ['Thắng', 'Phong', 'Tùng', 'Lượng'],
        ['Kiên', 'Cường', 'Anh', 'Huy'],
        ['Tùng', 'Nguyễn', 'Nguyễn', 'Vũ'],
        ['Tâm', 'Jêmy', 'Hào', 'Huy']
      ];
      
      const rawText = col === 0 
        ? ['C.trại', 'Chơi 1', 'Chơi 2', 'Chơi 3', 'Chơi 4'][row]
        : (mockNames[col - 1]?.[row] || `Per   cells.push({
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
  
  console.log(`Mock OCR completed: ${cells.length} cells extracted`);
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
    const [, day, month, year] = match;
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date(); // Default to today
}

module.exports = {
  processImage,
  extractDateFromFilename
};
