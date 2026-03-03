'use strict';

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  await knex.schema.createTable('duty_assignments', (table) => {
    table.bigIncrements('assignment_id').primary();
    table.date('duty_date').notNullable();
    table.bigInteger('shift_id').unsigned().notNullable();
    table.bigInteger('position_id').unsigned().notNullable();
    table.bigInteger('employee_id').unsigned().notNullable();
    table.bigInteger('source_image_id').unsigned().nullable();
    table.bigInteger('source_ocr_cell_id').unsigned().nullable();
    table.enu('source_type', ['ocr', 'manual', 'import']).notNullable().defaultTo('ocr');
    table.enu('status', ['planned', 'confirmed', 'cancelled']).notNullable().defaultTo('confirmed');
    table.integer('version_no').notNullable().defaultTo(1);
    table.dateTime('effective_from').notNullable().defaultTo(knex.fn.now());
    table.dateTime('effective_to').nullable();
    table.string('created_by', 100).nullable();
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());

    table.foreign('shift_id').references('shifts.shift_id');
    table.foreign('position_id').references('positions.position_id');
    table.foreign('employee_id').references('employees.employee_id');
    table.foreign('source_image_id').references('roster_images.image_id');
    table.foreign('source_ocr_cell_id').references('ocr_cells.ocr_cell_id');

    table.unique(['duty_date', 'shift_id', 'position_id', 'version_no'], {
      indexName: 'uk_assignment_active'
    });
    table.index(['employee_id', 'duty_date'], 'idx_assignment_emp_date');
    table.index(['position_id', 'duty_date'], 'idx_assignment_pos_date');
    table.index(['duty_date', 'shift_id', 'position_id'], 'idx_assignment_month');
  });

  await knex.schema.createTable('duty_swaps', (table) => {
    table.bigIncrements('swap_id').primary();
    table.date('duty_date').notNullable();
    table.bigInteger('shift_id').unsigned().notNullable();
    table.bigInteger('position_id').unsigned().notNullable();
    table.bigInteger('from_employee_id').unsigned().notNullable();
    table.bigInteger('to_employee_id').unsigned().notNullable();
    table.string('reason', 500).nullable();
    table.string('approved_by', 100).nullable();
    table.dateTime('approved_at').nullable();
    table.enu('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending');
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());

    table.foreign('shift_id').references('shifts.shift_id');
    table.foreign('position_id').references('positions.position_id');
    table.foreign('from_employee_id').references('employees.employee_id');
    table.foreign('to_employee_id').references('employees.employee_id');

    table.index(['duty_date', 'shift_id', 'position_id'], 'idx_swap_date');
    table.index(['status'], 'idx_swap_status');
  });

  await knex.schema.createTable('assignment_audit_logs', (table) => {
    table.bigIncrements('audit_id').primary();
    table.bigInteger('assignment_id').unsigned().notNullable();
    table.enu('action_type', ['insert', 'update', 'cancel', 'swap_apply', 'manual_fix']).notNullable();
    table.bigInteger('old_employee_id').unsigned().nullable();
    table.bigInteger('new_employee_id').unsigned().nullable();
    table.string('changed_by', 100).nullable();
    table.dateTime('changed_at').notNullable().defaultTo(knex.fn.now());
    table.string('note', 500).nullable();

    table.foreign('assignment_id').references('duty_assignments.assignment_id');
    table.index(['assignment_id', 'changed_at'], 'idx_audit_assignment_time');
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('assignment_audit_logs');
  await knex.schema.dropTableIfExists('duty_swaps');
  await knex.schema.dropTableIfExists('duty_assignments');
};
