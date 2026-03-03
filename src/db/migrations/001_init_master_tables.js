'use strict';

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  await knex.schema.createTable('employees', (table) => {
    table.bigIncrements('employee_id').primary();
    table.string('employee_code', 50).notNullable().unique();
    table.string('full_name', 255).notNullable();
    table.string('normalized_name', 255).notNullable();
    table.enu('status', ['active', 'inactive']).notNullable().defaultTo('active');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.index(['normalized_name'], 'idx_employees_normalized_name');
  });

  await knex.schema.createTable('positions', (table) => {
    table.bigIncrements('position_id').primary();
    table.string('position_code', 50).notNullable().unique();
    table.string('position_name', 255).notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('shifts', (table) => {
    table.bigIncrements('shift_id').primary();
    table.string('shift_code', 50).notNullable().unique();
    table.string('shift_name', 255).notNullable();
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.boolean('crosses_midnight').notNullable().defaultTo(false);
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('shifts');
  await knex.schema.dropTableIfExists('positions');
  await knex.schema.dropTableIfExists('employees');
};
