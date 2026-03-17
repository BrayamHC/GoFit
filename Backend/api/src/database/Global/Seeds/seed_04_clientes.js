// seeds/02_clientes.js
exports.seed = async function (knex) {
    await knex('clientes').del();

    await knex('clientes').insert([
        {
            nombre: 'Carlos',
            apellido: 'Ramírez',
            email: 'carlos.ramirez@email.com',
            telefono: '2221234567',
            fecha_nacimiento: '1990-05-15',
            status: 'activo',
        },
        {
            nombre: 'Sofía',
            apellido: 'Torres',
            email: 'sofia.torres@email.com',
            telefono: '2229876543',
            fecha_nacimiento: '1995-08-22',
            status: 'activo',
        },
        {
            nombre: 'Miguel',
            apellido: 'López',
            email: null,
            telefono: '2225556677',
            fecha_nacimiento: '1988-11-30',
            status: 'activo',
        },
        {
            nombre: 'Ana',
            apellido: 'Hernández',
            email: 'ana.hdz@email.com',
            telefono: null,
            fecha_nacimiento: '2000-03-10',
            status: 'inactivo',
        },
        {
            nombre: 'Luis',
            apellido: 'Martínez',
            email: 'luis.mtz@email.com',
            telefono: '2221112233',
            fecha_nacimiento: '1985-07-04',
            status: 'activo',
        },
    ]);
};
