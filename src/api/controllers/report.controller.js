'use strict';

/**
 * Get monthly shift statistics
 * GET /api/v1/reports/monthly?year=2026&month=3
 */
async function getMonthlyReport(req, res, next) {
  try {
    var year = parseInt(req.query.year) || new Date().getFullYear();
    var month = parseInt(req.query.month) || (new Date().getMonth() + 1);
    
    // TODO: Query from DB
    // Mock data for now
    var mockData = {
      year: year,
      month: month,
      totalShifts: 120,
      employeeStats: [
        { employeeId: 1, employeeCode: 'EMP001', fullName: 'An A', totalShifts: 15 },
        { employeeId: 2, employeeCode: 'EMP002', fullName: 'An B', totalShifts: 12 },
        { employeeId: 3, employeeCode: 'EMP003', fullName: 'Binh B', totalShifts: 10 }
      ],
      positionStats: [
        { positionCode: 'C_TRAI', positionName: 'C.trai', totalShifts: 30 },
        { positionCode: 'CHOI_1', positionName: 'Choi 1', totalShifts: 30 },
        { positionCode: 'CHOI_2', positionName: 'Choi 2', totalShifts: 30 },
        { positionCode: 'CHOI_3', positionName: 'Choi 3', totalShifts: 15 },
        { positionCode: 'CHOI_4', positionName: 'Choi 4', totalShifts: 15 }
      ],
      shiftStats: [
        { shiftCode: 'CA_1', shiftName: 'Ca 1', totalShifts: 30 },
        { shiftCode: 'CA_2', shiftName: 'Ca 2', totalShifts: 30 },
        { shiftCode: 'CA_3', shiftName: 'Ca 3', totalShifts: 30 },
        { shiftCode: 'CA_4', shiftName: 'Ca 4', totalShifts: 30 }
      ]
    };
    
    res.json(mockData);
  } catch (err) {
    next(err);
  }
}

/**
 * Get summary statistics
 * GET /api/v1/reports/summary
 */
async function getSummary(req, res, next) {
  try {
    // TODO: Query from DB
    var mockSummary = {
      totalEmployees: 29,
      totalPositions: 5,
      totalShifts: 4,
      totalAssignments: 156,
      thisMonthShifts: 120,
      avgShiftsPerEmployee: 4.1,
      mostActiveEmployee: { employeeCode: 'EMP001', fullName: 'An A', totalShifts: 15 },
      mostPopularPosition: { positionCode: 'C_TRAI', positionName: 'C.trai', totalShifts: 30 }
    };
    
    res.json(mockSummary);
  } catch (err) {
    next(err);
  }
}

/**
 * Get employee shift history
 * GET /api/v1/reports/employee/:employeeId
 */
async function getEmployeeHistory(req, res, next) {
  try {
    var employeeId = req.params.employeeId;
    
    // TODO: Query from DB
    var mockHistory = {
      employeeId: employeeId,
      assignments: [
        { dutyDate: '2026-03-01', shiftCode: 'CA_1', positionCode: 'C_TRAI', status: 'confirmed' },
        { dutyDate: '2026-03-02', shiftCode: 'CA_2', positionCode: 'CHOI_1', status: 'confirmed' },
        { dutyDate: '2026-03-03', shiftCode: 'CA_3', positionCode: 'CHOI_2', status: 'confirmed' }
      ]
    };
    
    res.json(mockHistory);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMonthlyReport,
  getSummary,
  getEmployeeHistory
};
