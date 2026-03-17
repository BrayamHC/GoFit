exports.seed = async function (knex) {
    await knex('suscripciones').del();

    await knex('suscripciones').insert([
        {
            // Carlos Ramírez → Plan Pro — vigente
            cliente_id:   1,
            membresia_id: 2,
            fecha_inicio:      '2026-03-01',
            fecha_fin:         '2026-03-31',
            dias_gracia:       0,
            fecha_suspension:  null,
            motivo_suspension: null,
            status:            'vigente',
            usuario_creacion:  1,
        },
        {
            // Sofía Torres → Plan Básico — vigente
            cliente_id:   2,
            membresia_id: 1,
            fecha_inicio:      '2026-03-10',
            fecha_fin:         '2026-04-09',
            dias_gracia:       3,
            fecha_suspension:  null,
            motivo_suspension: null,
            status:            'vigente',
            usuario_creacion:  1,
        },
        {
            // Miguel López → Plan Básico — vencida (mes anterior)
            cliente_id:   3,
            membresia_id: 1,
            fecha_inicio:      '2026-02-01',
            fecha_fin:         '2026-03-02',
            dias_gracia:       0,
            fecha_suspension:  null,
            motivo_suspension: null,
            status:            'vencida',
            usuario_creacion:  1,
        },
        {
            // Ana Hernández → Plan Pro — suspendida
            cliente_id:   4,
            membresia_id: 2,
            fecha_inicio:      '2026-02-15',
            fecha_fin:         '2026-03-16',
            dias_gracia:       0,
            fecha_suspension:  '2026-03-01',
            motivo_suspension: 'Solicitud del cliente',
            status:            'suspendida',
            usuario_creacion:  1,
        },
        {
            // Luis Martínez → Plan Élite Anual — vigente
            cliente_id:   5,
            membresia_id: 3,
            fecha_inicio:      '2026-01-01',
            fecha_fin:         '2026-12-31',
            dias_gracia:       7,
            fecha_suspension:  null,
            motivo_suspension: null,
            status:            'vigente',
            usuario_creacion:  1,
        },
    ]);
};
