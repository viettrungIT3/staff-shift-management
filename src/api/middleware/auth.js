'use strict';

var authService = require('../services/auth.service');

function authenticate(req, res, next) {
  var token = authService.extractToken(req.headers.authorization);
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  var decoded = authService.verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.user = decoded;
  next();
}

function optionalAuth(req, res, next) {
  var token = authService.extractToken(req.headers.authorization);
  
  if (token) {
    var decoded = authService.verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  
  next();
}

module.exports = {
  authenticate: authenticate,
  optionalAuth: optionalAuth
};
