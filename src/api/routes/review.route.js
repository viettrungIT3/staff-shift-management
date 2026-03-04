'use strict';

module.exports = (router) => {
  router.get('/:imageId/cells', (req, res) => {
    res.status(501).json({ error: 'Review cells endpoint not implemented' });
  });
  router.post('/:ocrCellId/fix', (req, res) => {
    res.status(501).json({ error: 'Fix cell endpoint not implemented' });
  });
  router.post('/:imageId/approve', (req, res) => {
    res.status(501).json({ error: 'Approve endpoint not implemented' });
  });
};
