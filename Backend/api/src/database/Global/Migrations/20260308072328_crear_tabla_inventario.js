/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('inventario', function (table) {
        table.increments('inventario_id').primary();
        table.uuid('inventario_uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));

        table.string('nombre', 150).notNullable();
        table.text('descripcion').nullable();
        table.string('categoria', 100).nullable()
            .comment('Ej: Cardio, Fuerza, Funcional, Accesorio');
        table.integer('cantidad').notNullable().defaultTo(1);
        table.string('estado', 30).notNullable()
            .defaultTo('operativo')
            .comment('operativo | en_mantenimiento | fuera_de_servicio');
        table.date('fecha_adquisicion').nullable();
        table.string('status', 20).notNullable()
            .defaultTo('activo')
            .comment('activo | eliminado');

        // Auditoría
        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
        table.timestamp('fecha_actualizacion').defaultTo(knex.fn.now());
        table.integer('usuario_creacion').nullable();
        table.integer('usuario_actualizacion').nullable();

        // Índices
        table.index(['inventario_uuid'], 'idx_inventario_uuid');
        table.index(['estado'], 'idx_inventario_estado');
        table.index(['categoria', 'estado'], 'idx_inventario_categoria_estado');
        table.index(['status'], 'idx_inventario_status');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('inventario');
};
