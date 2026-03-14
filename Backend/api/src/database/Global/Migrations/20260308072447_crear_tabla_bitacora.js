/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('bitacora', function (table) {
        table.increments('bitacora_id').primary();

        // Quién hizo la acción (usuario del sistema)
        table.integer('usuario_id').unsigned().nullable()
            .references('usuario_id').inTable('usuarios')
            .onDelete('SET NULL');
        table.string('usuario_nombre', 241).nullable()
            .comment('Snapshot: nombre + apellido al momento de la acción');

        // Qué se hizo y sobre qué
        table.string('modulo', 50).notNullable()
            .comment('Ej: clientes, suscripciones, inventario, asistencias');
        table.integer('modulo_id').nullable()
            .comment('ID del registro afectado dentro del módulo');
        table.string('accion', 50).notNullable()
            .comment('Ej: crear | editar | eliminar | acceso');
        table.text('descripcion').notNullable();

        table.timestamp('fecha').defaultTo(knex.fn.now());

        // Índices
        table.index(['usuario_id', 'fecha'], 'idx_bitacora_usuario_fecha');
        table.index(['modulo', 'modulo_id'], 'idx_bitacora_modulo');
        table.index(['fecha'], 'idx_bitacora_fecha');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('bitacora');
};
