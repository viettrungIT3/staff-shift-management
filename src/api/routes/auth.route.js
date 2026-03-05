'use strict';

var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller');
var authMiddleware = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/me', authMiddleware.authenticate, authController.me);

module.exports = router;
