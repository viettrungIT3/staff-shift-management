'use strict';

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  // Clear existing data
  await knex('employees').del();
  
  // Get positions for reference
  const positions = await knex('positions').select('position_id', 'position_code');
  const positionMap = {};
  positions.forEach(p => {
    positionMap[p.position_code] = p.position_id;
  });
  
  // Employee data from data/images/test/data.txt
  const employees = [
    { employee_code: 'EMP001', full_name: 'An A', normalized_name: 'an a' },
    { employee_code: 'EMP002', full_name: 'An B', normalized_name: 'an b' },
    { employee_code: 'EMP003', full_name: 'Bình B', normalized_name: 'binh b' },
    { employee_code: 'EMP004', full_name: 'Cường', normalized_name: 'cuong' },
    { employee_code: 'EMP005', full_name: 'Hải', normalized_name: 'hai' },
    { employee_code: 'EMP006', full_name: 'Hậu', normalized_name: 'hau'{ employee_code: 'EMP007', full_name: 'Hiếu', normalized_name: 'hieu' },
    { employee_code: 'EMP008', full_name: 'Hoàng B', normalized_name: 'hoang b' },
    { employee_code: 'EMP009', full_name: 'Huy B', normalized_name: 'huy b' },
    { employee_code: 'EMP010', full_name: 'Huy C', normalized_name: 'huy c' },
    { employee_code: 'EMP011', full_name: 'Huy D', normalized_name: 'huy d' },
    { employee_code: 'EMP012', full_name: 'Kiên C', normalized_name: 'kien c' },
    { employee_code: 'EMP013', full_name: 'Lâm', normalized_name: 'lam' },
    { employee_code: 'EMP014', full_name: 'Long', normalized_name: 'long' },
    { employee_code: 'EMP015', full_naLuyện', normalized_name: 'luyen' },
    { employee_code: 'EMP016', full_name: 'Lực', normalized_name: 'luc' },
    { employee_code: 'EMP017', full_name: 'Nghĩa', normalized_name: 'nghia' },
    { employee_code: 'EMP018', full_name: 'Quỳnh', normalized_name: 'quynh' },
    { employee_code: 'EMP019', full_name: 'Tấn', normalized_name: 'tan' },
    { employee_code: 'EMP020', full_name: 'Tân C', normalized_name: 'tan c' },
    { employee_code: 'EMP021', full_name: 'Toàn A', normalized_name: 'toan a' },
    { employee_code: 'EMP022', full_name: 'Toàn B', normalized_name: 'toan b' },
    { employee_code: 'EMP023', full_name: 'Trung B', normalized_name: 'trung b' },
    { employee_code: 'EMP024', full_name: 'Trung C', normalized_name: 'trung c' },
    { employee_code: 'EMP025', full_name: 'Trường B', normalized_name: 'truong b' },
    { employee_code: 'EMP026', full_name: 'Tú', normalized_name: 'tu' },
    { employee_code: 'EMP027', full_name: 'Tuấn B', normalized_name: 'tuan b' },
    { employee_ll_name: 'Tùng B', normalized_name: 'tung b' },
    { employee_code: 'EMP029', full_name: 'Vũ B', normalized_name: 'vu b' },
  ];
  
  await knex('employees').insert(employees);
  
  console.log('Seeded ' + employees.length + ' employees');
};
