'use strict';

function validateUpload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  var allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.indexOf(req.file.mimetype) === -1) {
    return res.status(400).json({ error: 'Only JPG and PNG files are allowed' });
  }
  
  var maxSize = 10 * 1024 * 1024;
  if (req.file.size > maxSize) {
    return res.status(400).json({ error: 'File size must be less than 10MB' });
  }
  
  next();
}

module.exports = {
  validateUpload: validateUpload
};
