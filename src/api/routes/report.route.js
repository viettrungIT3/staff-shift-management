'use strict';

var express = require('express');
var router = express.Router();
var reportController = require('../controllers/report.controller');

router.get('/monthly', reportController.getMonthlyReport);
router.get('/summary', reportController.getSummary);
router.get('/employee/:employeeId', reportController.getEmployeeHistory);

module.exports = router;
