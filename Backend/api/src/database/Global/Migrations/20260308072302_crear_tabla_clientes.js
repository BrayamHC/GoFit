/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('clientes', function (table) {
        table.increments('cliente_id').primary();
        table.uuid('cliente_uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));

        table.string('nombre', 120).notNullable();
        table.string('apellido', 120).notNullable();
        table.string('email', 120).nullable();
        table.string('telefono', 20).nullable();
        table.date('fecha_nacimiento').nullable();
        table.string('status', 20).notNullable()
            .defaultTo('activo')
            .comment('activo | inactivo | eliminado');

        // Auditoría
        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
        table.timestamp('fecha_actualizacion').defaultTo(knex.fn.now());
        table.integer('usuario_creacion').nullable();
        table.integer('usuario_actualizacion').nullable();

        // Índices
        table.index(['cliente_uuid'], 'idx_clientes_uuid');
        table.index(['email'], 'idx_clientes_email');
        table.index(['status'], 'idx_clientes_status');
        // Búsqueda por nombre en listados
        table.index(['nombre', 'apellido'], 'idx_clientes_nombre_apellido');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('clientes');
};
