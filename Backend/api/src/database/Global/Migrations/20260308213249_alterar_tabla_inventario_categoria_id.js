exports.up = function (knex) {
    return knex.schema.alterTable('inventario', function (table) {
        table.integer('categoria_id').unsigned().nullable()
            .references('categoria_id').inTable('cat_categorias_inventario')
            .onDelete('SET NULL');
        table.dropColumn('categoria'); 
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('inventario', function (table) {
        table.dropColumn('categoria_id');
        table.string('categoria', 100).nullable();
    });
};
