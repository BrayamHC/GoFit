exports.up = function (knex) {
    return knex.schema.createTable('membresias', function (table) {
        table.increments('membresia_id').primary();
        table.uuid('membresia_uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));

        table.string('nombre', 100).notNullable();
        table.text('descripcion').nullable();
        table.jsonb('caracteristicas').notNullable().defaultTo('[]');
        table.decimal('precio', 10, 2).notNullable();
        table.string('moneda', 10).notNullable().defaultTo('MXN');
        table.string('tipo', 20).notNullable()
            .defaultTo('mensual')
            .comment('mensual | trimestral | semestral | anual | personalizado');
        table.integer('dias_duracion').notNullable()
            .comment('30 | 90 | 180 | 365 | personalizado');
        table.string('status', 20).notNullable()
            .defaultTo('activo')
            .comment('activo | inactivo | eliminado');

        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
        table.timestamp('fecha_actualizacion').defaultTo(knex.fn.now());
        table.integer('usuario_creacion').nullable();
        table.integer('usuario_actualizacion').nullable();

        table.index(['membresia_uuid'], 'idx_membresias_uuid');
        table.index(['status'],         'idx_membresias_status');
        table.index(['tipo'],           'idx_membresias_tipo');
        table.index(['nombre', 'status'], 'idx_membresias_nombre_status');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('membresias');
};
