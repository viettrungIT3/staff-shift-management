'use strict';

module.exports = (router) => {
  router.post('/upload', (req, res) => {
    res.status(501).json({ error: 'Upload endpoint not implemented' });
  });
  router.post('/:imageId/process', (req, res) => {
    res.status(501).json({ error: 'Process endpoint not implemented' });
  });
};
