'use strict';

var authService = require('../services/auth.service');
var db = require('../../shared/db');

async function login(req, res, next) {
  try {
    var username = req.body.username;
    var password = req.body.password;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    // Simple auth - in production, use proper password hashing
    var user = await db('employees')
      .select('employee_id', 'employee_code', 'full_name')
      .where('employee_code', username)
      .first();
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    var token = authService.generateToken({
      id: user.employee_id,
      code: user.employee_code,
      name: user.full_name
    });
    
    res.json({
      token: token,
      user: {
        id: user.employee_id,
        code: user.employee_code,
        name: user.full_name
      }
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login: login,
  me: me
};
