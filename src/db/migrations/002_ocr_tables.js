'use strict';

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  await knex.schema.createTable('roster_images', (table) => {
    table.bigIncrements('image_id').primary();
    table.enu('source_type', ['scan', 'photo', 'upload']).notNullable().defaultTo('photo');
    table.string('file_url', 1024).notNullable();
    table.dateTime('captured_at').nullable();
    table.string('uploaded_by', 100).nullable();
    table.dateTime('upload_time').notNullable().defaultTo(knex.fn.now());
    table.enu('ocr_status', ['pending', 'processing', 'done', 'failed', 'review_required']).notNullable().defaultTo('pending');
    table.string('ocr_engine', 100).nullable();
    table.decimal('overall_confidence', 5, 4).nullable();
  });

  await knex.schema.createTable('ocr_cells', (table) => {
    table.bigIncrements('ocr_cell_id').primary();
    table.bigInteger('image_id').unsigned().notNullable();
    table.integer('row_index').notNullable();
    table.integer('col_index').notNullable();
    table.integer('bbox_x').notNullable();
    table.integer('bbox_y').notNullable();
    table.integer('bbox_w').notNullable();
    table.integer('bbox_h').notNullable();
    table.string('raw_text', 255).notNullable();
    table.string('normalized_text', 255).nullable();
    table.decimal('confidence_score', 5, 4).notNullable();
    table.bigInteger('mapped_employee_id').unsigned().nullable();
    table.enu('mapping_status', ['mapped', 'unmapped', 'ambiguous', 'manual_fixed']).notNullable().defaultTo('unmapped');
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());

    table.foreign('image_id').references('roster_images.image_id');
    table.foreign('mapped_employee_id').references('employees.employee_id');
    table.index(['image_id'], 'idx_ocr_cells_image');
    table.index(['mapping_status'], 'idx_ocr_cells_map_status');
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('ocr_cells');
  await knex.schema.dropTableIfExists('roster_images');
};
