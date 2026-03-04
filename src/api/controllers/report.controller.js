'use strict';

var db = require('../../shared/db');

async function getMonthlyReport(req, res, next) {
  try {
    var year = parseInt(req.query.year) || new Date().getFullYear();
    var month = parseInt(req.query.month) || (new Date().getMonth() + 1);
    
    var startDate = new Date(year, month - 1, 1);
    var endDate = new Date(year, month, 0);
    
    // Get employee stats
    var employeeStats = await db('duty_assignments as da')
      .join('employees as e', 'da.employee_id', 'e.employee_id')
      .select(
        'e.employee_id',
        'e.employee_code',
        'e.full_name'
      )
      .count('* as totalShifts')
      .where('da.duty_date', '>=', startDate)
      .where('da.duty_date', '<=', endDate)
      .where('da.status', 'confirmed')
      .groupBy('e.employee_id', 'e.employee_code', 'e.full_name')
      .orderBy('totalShifts', 'desc');
    
    // Get position stats
    var positionStats = await db('duty_assignments as da')
      .join('positions as p', 'da.position_id', 'p.position_id')
      .select('p.position_code', 'p.position_name')
      .count('* as totalShifts')
      .where('da.duty_date', '>=', startDate)
      .where('da.duty_date', '<=', endDate)
      .where('da.status', 'confirmed')
      .groupBy('p.position_code', 'p.position_name');
    
    // Get shift stats
    var shiftStats = await db('duty_assignments as da')
      .join('shifts as s', 'da.shift_id', 's.shift_id')
      .select('s.shift_code', 's.shift_name')
      .count('* as totalShifts')
      .where('da.duty_date', '>=', startDate)
      .where('da.duty_date', '<=', endDate)
      .where('da.status', 'confirmed')
      .groupBy('s.shift_code', 's.shift_name');
    
    var totalShifts = employeeStats.reduce(function(sum, e) { return sum + parseInt(e.totalShifts); }, 0);
    
    res.json({
      year: year,
      month: month,
      totalShifts: totalShifts,
      employeeStats: employeeStats,
      positionStats: positionStats,
      shiftStats: shiftStats
    });
  } catch (err) {
    next(err);
  }
}

async function getSummary(req, res, next) {
  try {
    var totalEmployees = await db('employees').count('* as count').first();
    var totalPositions = await db('positions').count('* as count').first();
    var totalShifts = await db('shifts').count('* as count').first();
    var totalAssignments = await db('duty_assignments').count('* as count').first();
    
    var mostActive = await db('duty_assignments as da')
      .join('employees as e', 'da.employee_id', 'e.employee_id')
      .select('e.employee_code', 'e.full_name')
      .count('* as total')
      .where('da.status', 'confirmed')
      .groupBy('e.employee_code', 'e.full_name')
      .orderBy('total', 'desc')
      .limit(1)
      .first();
    
    var mostPopular = await db('duty_assignments as da')
      .join('positions as p', 'da.position_id', 'p.position_id')
      .select('p.position_code', 'p.position_name')
      .count('* as total')
      .where('da.status', 'confirmed')
      .groupBy('p.position_code', 'p.position_name')
      .orderBy('total', 'desc')
      .limit(1)
      .first();
    
    res.json({
      totalEmployees: parseInt(totalEmployees.count),
      totalPositions: parseInt(totalPositions.count),
      totalShifts: parseInt(totalShifts.count),
      totalAssignments: parseInt(totalAssignments.count),
      mostActiveEmployee: mostActive || null,
      mostPopularPosition: mostPopular || null
    });
  } catch (err) {
    next(err);
  }
}

async function getEmployeeHistory(req, res, next) {
  try {
    var employeeId = req.params.employeeId;
    
    var assignments = await db('duty_assignments as da')
      .join('shifts as s', 'da.shift_id', 's.shift_id')
      .join('positions as p', 'da.position_id', 'p.position_id')
      .select(
        'da.duty_date',
        's.shift_code',
        's.shift_name',
        'p.position_code',
        'p.position_name',
        'da.status'
      )
      .where('da.employee_id', employeeId)
      .orderBy('da.duty_date', 'desc')
      .limit(50);
    
    res.json({
      employeeId: employeeId,
      assignments: assignments
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMonthlyReport: getMonthlyReport,
  getSummary: getSummary,
  getEmployeeHistory: getEmployeeHistory
};
