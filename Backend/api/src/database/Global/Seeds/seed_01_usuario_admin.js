/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
    const passwordPlano = 'GoFitAdmin2025!';
    const passwordHash = await bcrypt.hash(passwordPlano, 10);

    const usuarioAdmin = [
        {
            nombre: 'Admin',
            apellido: 'Maru',
            email: 'admin@gofit.com',
            password: passwordHash,
            status: 'activo',
            fecha_ultimo_acceso: null,
            fecha_creacion: knex.fn.now(),
            fecha_actualizacion: knex.fn.now(),
            usuario_creacion: null,
            usuario_actualizacion: null,
        }
    ];

    await knex('usuarios').insert(usuarioAdmin);
};
