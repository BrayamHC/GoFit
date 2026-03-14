/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {

  const passwordPlano = 'systemDelta2025!';
  const passwordHash = await bcrypt.hash(passwordPlano, 10);

  await knex('usuarios').insert({
    nombre_completo: 'System Delta ERP',
    email: 'system@deltaerp.com',
    password: passwordHash,
    rol_id: 1,
    status: 'activo',
    fecha_ultimo_acceso: null,
    usuario_creacion: null,
    usuario_actualizacion: null,
    fecha_creacion: knex.fn.now(),
    fecha_actualizacion: null,
  });
};
