exports.seed = async function (knex) {
    const categorias = [
        // ── Cardio ───────────────────────────────────────
        {
            nombre:      'Cardio',
            descripcion: 'Equipos aeróbicos para resistencia y salud cardiovascular',
        },
        // ── Fuerza ────────────────────────────────────────
        {
            nombre:      'Fuerza',
            descripcion: 'Equipos de musculación para desarrollo de masa muscular y potencia',
        },
        // ── Funcional ─────────────────────────────────────
        {
            nombre:      'Funcional',
            descripcion: 'Equipos para entrenamiento funcional, movilidad y coordinación',
        },
        // ── Pesas libres ─────────────────────────────────
        {
            nombre:      'Pesas Libres',
            descripcion: 'Mancuernas, barras, discos y racks para levantamiento libre',
        },
        // ── Estiramiento y Flexibilidad ───────────────────
        {
            nombre:      'Estiramiento y Flexibilidad',
            descripcion: 'Colchonetas, rollos de foam, bandas elásticas y accesorios de movilidad',
        },
        // ── Accesorios ────────────────────────────────────
        {
            nombre:      'Accesorios',
            descripcion: 'Elementos de soporte: espejos, lockers, soportes, señalización',
        },
    ].map((cat) => ({
        ...cat,
        status:           'activo',
        fecha_creacion:   knex.fn.now(),
        fecha_actualizacion: knex.fn.now(),
        usuario_creacion: 1,
        usuario_actualizacion: null,
    }));

    await knex('cat_categorias_inventario').insert(categorias);
};
