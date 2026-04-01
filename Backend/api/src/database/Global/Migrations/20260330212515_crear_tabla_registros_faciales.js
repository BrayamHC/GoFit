exports.up = function (knex) {
    return knex.schema.createTable('registros_faciales', function (table) {
        table.increments('registro_id').primary();

        table.integer('cliente_id').unsigned().notNullable()
            .references('cliente_id').inTable('clientes')
            .onDelete('CASCADE');
        table.string('cliente_uuid', 36).notNullable()
            .comment('Snapshot: evita joins en el endpoint de FastAPI');

        table.jsonb('encoding').notNullable()
            .comment('Vector facial: array de floats generado por FastAPI');

        table.enu('status', ['activo', 'inactivo'])
            .notNullable()
            .defaultTo('activo');

        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());

        table.index(['cliente_id'], 'idx_registros_faciales_cliente');
        table.index(['status'], 'idx_registros_faciales_status');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('registros_faciales');
};