'use strict';

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  // Clear existing data
  await knex('positions').del();
  await knex('shifts').del();
  
  // Insert positions (5 columns from roster: C.trại + 4 Chơi)
  const positions = [
    { position_code: 'C_TRAI', position_name: 'C.trại', is_active: true },
    { position_code: 'CHOI_1', position_name: 'Chơi 1', is_active: true },
    { position_code: 'CHOI_2', position_name: 'Chơi 2', is_active: true },
    { position_code: 'CHOI_3', position_name: 'Chơi 3', is_active: true },
    { position_code: 'CHOI_4', position_name: 'Chơi 4', is_active: true },
  ];
  
  await knex('positions').insert(positions);
  
  // Insert shifts (4 rows from roster)
  const shifts = [
    { shift_code: 'CA_1', shift_name: 'Ca 1', start_time: '06:00:00', end_time: '10:00:00', crosses_midnight: false },
    { shift_code: 'CA_2', shifCa 2', start_time: '10:00:00', end_time: '14:00:00', crosses_midnight: false },
    { shift_code: 'CA_3', shift_name: 'Ca 3', start_time: '14:00:00', end_time: '18:00:00', crosses_midnight: false },
    { shift_code: 'CA_4', shift_name: 'Ca 4', start_time: '18:00:00', end_time: '22:00:00', crosses_midnight: false },
  ];
  
  await knex('shifts').insert(shifts);
  
  console.log('Seeded ' + positions.length + ' positions and ' + shifts.length + ' shifts');
};
