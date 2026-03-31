/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('asistencias', function (table) {
        table.increments('asistencia_id').primary();
        table.uuid('asistencia_uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));

        // Cliente
        table.integer('cliente_id').unsigned().notNullable()
            .references('cliente_id').inTable('clientes')
            .onDelete('RESTRICT');
        table.string('nombre_cliente', 241).notNullable()
            .comment('Snapshot: nombre + apellido al momento del acceso');

        // Timestamps de visita
        table.timestamp('fecha_entrada').notNullable().defaultTo(knex.fn.now());
        table.timestamp('fecha_salida').nullable();
        table.integer('duracion_minutos').nullable()
            .comment('Calculado al registrar la salida: DIFF(fecha_salida, fecha_entrada)');

        // Estado de la visita
        table.enu('status', ['activa', 'completada', 'no_cerrada'])
            .notNullable()
            .defaultTo('activa')
            .comment('activa = sin salida registrada, completada = salida registrada,');

        // Método de acceso
        table.enu('metodo_acceso', ['manual', 'facial', 'qr'])
            .notNullable()
            .defaultTo('manual');

        // Snapshots al momento del acceso
        table.integer('dias_restantes_suscripcion').nullable()
            .comment('Snapshot: calculado desde fecha_fin de la suscripción activa');
        table.string('membresia_nombre', 120).nullable()
            .comment('Snapshot: nombre de la membresía activa al momento del acceso');
        table.integer('total_accesos').notNullable().defaultTo(1)
            .comment('Snapshot: accesos acumulados del cliente incluyendo este');

        // Auditoría
        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
        table.integer('usuario_creacion').unsigned().nullable()
            .references('usuario_id').inTable('usuarios')
            .onDelete('SET NULL');

        // Índices
        table.index(['cliente_id', 'fecha_entrada'], 'idx_asistencias_cliente_fecha');
        table.index(['fecha_entrada'], 'idx_asistencias_fecha_entrada');
        table.index(['fecha_salida'], 'idx_asistencias_fecha_salida');
        table.index(['status'], 'idx_asistencias_status');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('asistencias');
};