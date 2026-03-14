/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('asistencias', function (table) {
        table.increments('asistencia_id').primary();

        table.integer('cliente_id').unsigned().notNullable()
            .references('cliente_id').inTable('clientes')
            .onDelete('RESTRICT');

        // Snapshot: se guarda el nombre al momento del acceso
        table.string('nombre_cliente', 241).notNullable()
            .comment('Snapshot: nombre + apellido al momento del acceso');

        table.timestamp('fecha_acceso').notNullable().defaultTo(knex.fn.now());

        // Snapshot: días restantes calculados al momento del acceso
        table.integer('dias_restantes_suscripcion').nullable()
            .comment('Snapshot calculado desde fecha_fin al momento del registro');

        // Auditoría (solo creación, este registro es inmutable)
        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
        table.integer('usuario_creacion').nullable();

        // Índices
        // Historial de asistencias de un cliente
        table.index(['cliente_id', 'fecha_acceso'], 'idx_asistencias_cliente_fecha');
        // Pase de lista del día
        table.index(['fecha_acceso'], 'idx_asistencias_fecha_acceso');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('asistencias');
};
