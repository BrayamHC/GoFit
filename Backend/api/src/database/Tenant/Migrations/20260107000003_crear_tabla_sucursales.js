// src/database/Tenant/Migrations/20260107000003_crear_tabla_sucursales.js
exports.up = function (knex) {
    return knex.schema.createTable('sucursales', (table) => {
        table.increments('sucursal_id').primary();
        table.uuid('sucursal_uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('nombre', 150).notNullable();
        table.string('descripcion', 255);
        table.string('status', 20).notNullable().defaultTo('activo');
        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
        table.timestamp('fecha_actualizacion');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('sucursales');
};
