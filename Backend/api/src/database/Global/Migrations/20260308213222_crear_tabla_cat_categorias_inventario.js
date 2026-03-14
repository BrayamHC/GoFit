exports.up = function (knex) {
    return knex.schema.createTable('cat_categorias_inventario', function (table) {
        table.increments('categoria_id').primary();
        table.string('nombre', 100).notNullable();
        table.text('descripcion').nullable();
        table.string('status', 20).notNullable()
            .defaultTo('activo')
            .comment('activo | inactivo');

        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
        table.timestamp('fecha_actualizacion').defaultTo(knex.fn.now());
        table.integer('usuario_creacion').nullable();
        table.integer('usuario_actualizacion').nullable();

        table.index(['status'], 'idx_cat_categorias_status');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('cat_categorias_inventario');
};
