/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('suscripciones', function (table) {
        table.increments('suscripcion_id').primary();
        table.uuid('suscripcion_uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));

        table.integer('cliente_id').unsigned().notNullable()
            .references('cliente_id').inTable('clientes')
            .onDelete('RESTRICT');
        table.integer('membresia_id').unsigned().notNullable()
            .references('membresia_id').inTable('membresias')
            .onDelete('RESTRICT');

        table.date('fecha_inicio').notNullable();
        table.date('fecha_fin').notNullable();
        table.integer('dias_gracia').notNullable().defaultTo(0);
        table.date('fecha_suspension').nullable();
        table.string('motivo_suspension', 255).nullable();
        table.string('status', 20).notNullable()
            .defaultTo('vigente')
            .comment('vigente | vencida | suspendida | eliminada');

        // Auditoría
        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
        table.timestamp('fecha_actualizacion').defaultTo(knex.fn.now());
        table.integer('usuario_creacion').nullable();
        table.integer('usuario_actualizacion').nullable();

        // Índices
        table.index(['suscripcion_uuid'], 'idx_suscripciones_uuid');
        // Consulta más común: suscripción vigente de un cliente
        table.index(['cliente_id', 'status'], 'idx_suscripciones_cliente_status');
        // Jobs/cron de vencimiento
        table.index(['fecha_fin', 'status'], 'idx_suscripciones_fecha_fin_status');
        // Clientes por membresía (reportes)
        table.index(['membresia_id', 'status'], 'idx_suscripciones_membresia_status');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('suscripciones');
};
