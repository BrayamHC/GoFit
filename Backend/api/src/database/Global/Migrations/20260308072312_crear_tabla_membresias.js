/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('membresias', function (table) {
        table.increments('membresia_id').primary();
        table.uuid('membresia_uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));

        table.string('nombre', 100).notNullable();
        table.text('descripcion').nullable();
        table.decimal('precio', 10, 2).notNullable();
        table.string('moneda', 10).notNullable().defaultTo('MXN');
        table.integer('dias_duracion').notNullable()
            .comment('Ej: 30 = mensual, 90 = trimestral, 365 = anual');
        table.integer('dias_gracia').notNullable().defaultTo(0);
        table.string('status', 20).notNullable()
            .defaultTo('activo')
            .comment('activo | inactivo | eliminado');

        // Auditoría
        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
        table.timestamp('fecha_actualizacion').defaultTo(knex.fn.now());
        table.integer('usuario_creacion').nullable();
        table.integer('usuario_actualizacion').nullable();

        // Índices
        table.index(['membresia_uuid'], 'idx_membresias_uuid');
        table.index(['status'], 'idx_membresias_status');
        table.index(['nombre', 'status'], 'idx_membresias_nombre_status');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('membresias');
};
