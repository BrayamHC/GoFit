/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Inserta roles base
  await knex('roles').insert([
    {
      rol_id: 1,
      descripcion: 'Administrador'
    }
  ]);
};
