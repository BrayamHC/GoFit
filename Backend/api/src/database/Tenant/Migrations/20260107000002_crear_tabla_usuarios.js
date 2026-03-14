/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('usuarios', (table) => {
        table.increments('usuario_id').primary();
        table.uuid('usuario_uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
        // table.string('nombre_corto', 50).notNullable();
        table.string('nombre_completo', 150).notNullable();
        // Autenticación
        table.string('email', 120).notNullable().unique();
        table.string('password', 255).notNullable();
        table.string('telefono', 20).nullable();
        // Información adicional
        table.text('direccion').nullable();
        // Rol (FK)
        table.integer('rol_id')
            .unsigned()
            .notNullable()
            .references('rol_id')
            .inTable('roles')
            .onDelete('RESTRICT');

        table.string('status', 20)
            .notNullable()
            .defaultTo('activo')
            .comment('activo | inactivo | eliminado');
        // Auditoría de acceso
        table.timestamp('fecha_ultimo_acceso').nullable();
        // Campos de auditoría
        table.integer('usuario_creacion').unsigned().nullable();
        table.integer('usuario_actualizacion').unsigned().nullable();
        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
        table.timestamp('fecha_actualizacion').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('usuarios');
};
