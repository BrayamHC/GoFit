import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

const knexProvider = {
    provide: 'KNEX_CONNECTION',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<Knex> => {

        const host = configService.get<string>('DB_HOST');
        const user = configService.get<string>('DB_USER');
        const db = configService.get<string>('DB_DATABASE');

        console.log('----------------------------------------');
        console.log('INTENTANDO CONEXIÓN A BASE DE DATOS GLOBAL:');
        console.log(`   Host: ${host}`);
        console.log(`   User: ${user}`);
        console.log(`   DB:   ${db}`);
        console.log('----------------------------------------');

        if (!host || !user || !db) {
            throw new Error("ERROR CRITICO: Las variables de entorno no se leyeron. Revisa el AppModule y el archivo .env");
        }

        const knexInstance = knex({
            client: 'pg',
            connection: {
                host: host,
                port: configService.get<number>('DB_PORT'),
                user: user,
                password: configService.get<string>('DB_PASSWORD'),
                database: db,
            },
            pool: { min: 2, max: 10 },
        });

        // Verificar que la conexión funcione
        try {
            await knexInstance.raw('SELECT 1');
            console.log('Conexión a base de datos GLOBAL establecida correctamente');
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error.message);
            throw error;
        }
        return knexInstance;
    },
};

@Global()
@Module({
    providers: [knexProvider],
    exports: ['KNEX_CONNECTION'],
})
export class KnexModule { }
