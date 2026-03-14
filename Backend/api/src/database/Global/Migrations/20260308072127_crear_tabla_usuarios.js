/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('usuarios', function (table) {
        table.increments('usuario_id').primary();
        table.uuid('usuario_uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));

        table.string('nombre', 120).notNullable();
        table.string('apellido', 120).notNullable();
        table.string('email', 120).notNullable();
        table.string('password', 255).notNullable();
        table.string('status', 20).notNullable()
            .defaultTo('activo')
            .comment('activo | inactivo | eliminado');
        table.timestamp('fecha_ultimo_acceso').nullable();

        // Auditoría
        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
        table.timestamp('fecha_actualizacion').defaultTo(knex.fn.now());
        table.integer('usuario_creacion').nullable();
        table.integer('usuario_actualizacion').nullable();

        // Índices
        table.index(['usuario_uuid'], 'idx_usuarios_uuid');
        table.index(['email', 'status'], 'idx_usuarios_email_status');
        table.index(['status'], 'idx_usuarios_status');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('usuarios');
};
