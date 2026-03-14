exports.up = function (knex) {
    return knex.schema.alterTable('asistencias', function (table) {
        table.integer('total_accesos').notNullable().defaultTo(1)
            .comment('Snapshot acumulado de accesos al momento del registro');
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('asistencias', function (table) {
        table.dropColumn('total_accesos');
    });
};
