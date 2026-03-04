'use strict';

module.exports = (router) => {
  router.get('/monthly', (req, res) => {
    res.status(501).json({ error: 'Monthly report endpoint not implemented' });
  });
  router.get('/summary', (req, res) => {
    res.status(501).json({ error: 'Summary report endpoint not implemented' });
  });
};
