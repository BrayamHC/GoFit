/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('rel_sucursales_usuarios', (table) => {
        table.increments('id_rel').primary();

        table.integer('usuario_id')
            .unsigned()
            .notNullable()
            .references('usuario_id')
            .inTable('usuarios')
            .onDelete('CASCADE');

        table.integer('sucursal_id')
            .unsigned()
            .notNullable()
            .references('sucursal_id')
            .inTable('sucursales')
            .onDelete('CASCADE');

        // Evita duplicados usuario–sucursal
        table.unique(['usuario_id', 'sucursal_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('rel_sucursales_usuarios');
};
