require('dotenv').config();

module.exports = {
    global: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        },
        migrations: {
            directory: './src/database/Global/Migrations'
        },
        seeds: {
            directory: './src/database/Global/Seeds'
        }
    },

    tenant: {
        client: 'pg',
        connection: {
            host: process.env.TENANT_DB_HOST,
            port: Number(process.env.TENANT_DB_PORT),
            user: process.env.TENANT_DB_USER,
            password: process.env.TENANT_DB_PASSWORD,
            database: process.env.TENANT_DB_DATABASE,
        },
        migrations: {
            directory: './src/database/Tenant/Migrations'
        },
        seeds: {
            directory: './src/database/Tenant/Seeds'
        }
    }
};
