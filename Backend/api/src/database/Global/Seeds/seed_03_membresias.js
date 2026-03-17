/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('membresias').del();

  await knex('membresias').insert([
    {
      nombre:        'Plan Básico',
      descripcion:   'Acceso a sala de pesas y cardio. Ideal para quienes inician su rutina de entrenamiento.',
      caracteristicas: JSON.stringify([
        'Acceso a sala de pesas',
        'Área de cardio ilimitada',
        'Casillero incluido',
        'Evaluación física inicial',
      ]),
      precio:        299.00,
      moneda:        'MXN',
      tipo:          'mensual',
      dias_duracion: 30,
      status:        'activo',
      usuario_creacion: 1,
    },
    {
      nombre:        'Plan Pro',
      descripcion:   'Acceso completo al gimnasio con clases grupales incluidas. El favorito de nuestros miembros.',
      caracteristicas: JSON.stringify([
        'Todo lo del Plan Básico',
        'Clases grupales ilimitadas',
        'Acceso a alberca',
        '1 sesión mensual con entrenador',
      ]),
      precio:        499.00,
      moneda:        'MXN',
      tipo:          'mensual',
      dias_duracion: 30,
      status:        'activo',
      usuario_creacion: 1,
    },
    {
      nombre:        'Plan Élite Anual',
      descripcion:   'Membresía anual con acceso total a todas las instalaciones y servicios premium sin restricciones.',
      caracteristicas: JSON.stringify([
        'Acceso 24/7 a todas las áreas',
        'Clases grupales y personalizadas',
        'Nutriólogo incluido (2 consultas)',
        'Descuentos en tienda y suplementos',
      ]),
      precio:        3999.00,
      moneda:        'MXN',
      tipo:          'anual',
      dias_duracion: 365,
      status:        'activo',
      usuario_creacion: 1,
    },
  ]);
};
