'use strict';

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  await knex('employees').del();
  
  var employees = [
    { employee_code: 'EMP001', full_name: 'An A', normalized_name: 'an a' },
    { employee_code: 'EMP002', full_name: 'An B', normalized_name: 'an b' },
    { employee_code: 'EMP003', full_name: 'Binh B', normalized_name: 'binh b' },
    { employee_code: 'EMP004', full_name: 'Cuong', normalized_name: 'cuong' },
    { employee_code: 'EMP005', full_name: 'Hai', normalized_name: 'hai' },
    { employee_code: 'EMP006', full_name: 'Hau', normalized_name: 'hau' },
    { employee_code: 'EMP007', full_name: 'Hieu', normalized_name: 'hieu' },
    { employee_code: 'EMP008', full_name: 'Hoang B', normalized_name: 'hoang b' },
    { employee_code: 'EMP009', full_name: 'Huy B', normalized_name: 'huy b' },
    { employee_code: 'EMP010', full_name: 'Huy C', normalized_name: 'huy c' },
    { employee_code: 'EMP011', full_name: 'Huy D', normalized_name: 'huy d' },
    { employee_code: 'EMP012', full_name: 'Kien C', normalized_name: 'kien c' },
    { employee_code: 'EMP013', full_name: 'Lam', normalized_name: 'lam' },
    { employee_code: 'EMP014', full_name: 'Long', normalized_name: 'long' },
    { employee_code: 'EMP015', full_name: 'Luyen', normalized_name: 'luyen' },
    { employee_code: 'EMP016', full_name: 'Luc', normalized_name: 'luc' },
    { employee_code: 'EMP017', full_name: 'Nghia', normalized_name: 'nghia' },
    { employee_code: 'EMP018', full_name: 'Quynh', normalized_name: 'quynh' },
    { employee_code: 'EMP019', full_name: 'Tan', normalized_name: 'tan' },
    { employee_code: 'EMP020', full_name: 'Tan C', normalized_name: 'tan c' },
    { employee_code: 'EMP021', full_name: 'Toan A', normalized_name: 'toan a' },
    { employee_code: 'EMP022', full_name: 'Toan B', normalized_name: 'toan b' },
    { employee_code: 'EMP023', full_name: 'Trung B', normalized_name: 'trung b' },
    { employee_code: 'EMP024', full_name: 'Trung C', normalized_name: 'trung c' },
    { employee_code: 'EMP025', full_name: 'Truong B', normalized_name: 'truong b' },
    { employee_code: 'EMP026', full_name: 'Tu', normalized_name: 'tu' },
    { employee_code: 'EMP027', full_name: 'Tuan B', normalized_name: 'tuan b' },
    { employee_code: 'EMP028', full_name: 'Tung B', normalized_name: 'tung b' },
    { employee_code: 'EMP029', full_name: 'Vu B', normalized_name: 'vu b' }
  ];
  
  await knex('employees').insert(employees);
  console.log('Seeded ' + employees.length + ' employees');
};
