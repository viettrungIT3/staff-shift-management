'use strict';

var express = require('express');
var router = express.Router();
var reviewController = require('../controllers/review.controller');

router.get('/:imageId/cells', reviewController.getCells);
router.post('/:ocrCellId/fix', reviewController.fixCell);
router.post('/:imageId/approve', reviewController.approveRoster);

module.exports = router;
