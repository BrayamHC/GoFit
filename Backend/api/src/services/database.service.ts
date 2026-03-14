// src/services/database.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import knex from 'knex';
import { databaseConfig, getTenantConfig } from '../database/config/database.config';
import {
    DuplicateResourceException,
    DatabaseConnectionException,
    DatabaseQueryException,
    InternalException,
} from '../common/exceptions';

@Injectable()
export class DatabaseService {
    private readonly logger = new Logger(DatabaseService.name);
    private knexTenantActivo: Knex | null = null;

    constructor(@Inject('KNEX_CONNECTION') private readonly knexGlobal: Knex) { }

    async crearBaseDatosTenant(razonSocial: string) {
        const nombreBase = this.generarNombreBaseTenant(razonSocial);
        const config = databaseConfig();

        try {
            const existe = await this.verificarExistenciaBase(nombreBase);
            if (existe) {
                throw new DuplicateResourceException('base de datos tenant', nombreBase);
            }

            // Crear base de datos con OWNER
            this.logger.log(`Creando base de datos: ${nombreBase}...`);
            try {
                await this.knexGlobal.raw(
                    `CREATE DATABASE "${nombreBase}" OWNER "${config.tenant.user}"`,
                );
                this.logger.log(`Base de datos ${nombreBase} creada`);
            } catch (error) {
                this.logger.error(`Error creando BD ${nombreBase}`, error);
                throw new DatabaseQueryException('Error al crear la base de datos tenant');
            }

            // Conectar a la nueva BD para configurar permisos
            this.logger.log('Configurando permisos de schema...');
            const knexTenantTemp = knex({
                client: 'pg',
                connection: getTenantConfig(nombreBase),
            });

            try {
                await knexTenantTemp.raw(
                    `ALTER DEFAULT PRIVILEGES GRANT ALL ON SCHEMAS TO "${config.tenant.user}"`,
                );
                await knexTenantTemp.raw(
                    `ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO "${config.tenant.user}"`,
                );
            } catch (error) {
                this.logger.error('Error configurando permisos', error);
                throw new DatabaseQueryException('Error al configurar permisos de la BD tenant');
            } finally {
                await knexTenantTemp.destroy();
            }

            return {
                db_host: config.tenant.host,
                db_port: config.tenant.port,
                db_user: config.tenant.user,
                db_password: config.tenant.password,
                db_name: nombreBase,
            };
        } catch (error) {
            // Si ya es una excepcion de negocio, re-lanzarla
            if (
                error instanceof DuplicateResourceException ||
                error instanceof DatabaseQueryException
            ) {
                throw error;
            }

            // Error tecnico no controlado
            this.logger.error('Error creando base datos tenant', error);
            throw new InternalException('Error inesperado al crear la base de datos tenant');
        }
    }

    private generarNombreBaseTenant(razonSocial: string): string {
        const nombreLimpio = razonSocial
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');

        const numeros = Math.floor(Math.random() * 90) + 10;
        return `delta_erp_${nombreLimpio}${numeros}`;
    }

    async conectarTenant(credenciales: any): Promise<Knex> {
        try {
            this.logger.log(`Conectando a tenant: ${credenciales.db_name}`);

            this.knexTenantActivo = knex({
                client: 'pg',
                connection: {
                    host: credenciales.db_host,
                    port: credenciales.db_port,
                    user: credenciales.db_user,
                    password: credenciales.db_password,
                    database: credenciales.db_name,
                },
            });

            // Validar conexion con un ping
            await this.knexTenantActivo.raw('SELECT 1');

            return this.knexTenantActivo;
        } catch (error) {
            this.logger.error(`Error conectando a tenant ${credenciales.db_name}`, error);
            throw new DatabaseConnectionException(
                `No se pudo conectar a la base de datos ${credenciales.db_name}`,
            );
        }
    }

    async desconectarTenant(): Promise<void> {
        if (this.knexTenantActivo) {
            try {
                this.logger.debug('Cerrando conexion tenant...');
                await this.knexTenantActivo.destroy();
                this.knexTenantActivo = null;
            } catch (error) {
                this.logger.error('Error cerrando conexion tenant', error);
                // No lanzar excepcion, solo loguear
            }
        }
    }

    obtenerConexionGlobal(): Knex {
        return this.knexGlobal;
    }

    obtenerConexionTenant(): Knex {
        if (!this.knexTenantActivo) {
            throw new DatabaseConnectionException('No hay conexion tenant activa');
        }
        return this.knexTenantActivo;
    }

    private async verificarExistenciaBase(nombreBase: string): Promise<boolean> {
        try {
            const resultado = await this.knexGlobal.raw(
                'SELECT 1 FROM pg_database WHERE datname = ?',
                [nombreBase],
            );
            return resultado.rows.length > 0;
        } catch (error) {
            this.logger.error(`Error verificando existencia de BD ${nombreBase}`, error);
            throw new DatabaseQueryException('Error al verificar existencia de base de datos');
        }
    }

    async ejecutarMigracionesTenant(knexTenant: Knex): Promise<void> {
        this.logger.log('Ejecutando migraciones tenant...');

        try {
            await knexTenant.migrate.latest({
                directory: './src/database/Tenant/Migrations',
            });
            this.logger.log('Migraciones tenant ejecutadas');
        } catch (error) {
            this.logger.error('Error ejecutando migraciones tenant', error);
            throw new DatabaseQueryException(
                `Error al ejecutar migraciones tenant: ${error.message}`,
            );
        }
    }

    async ejecutarSeedsTenant(knexTenant: Knex): Promise<void> {
        this.logger.log('Ejecutando seeds tenant...');

        try {
            await knexTenant.seed.run({
                directory: './src/database/Tenant/Seeds',
            });
            this.logger.log('Seeds tenant ejecutados');
        } catch (error) {
            this.logger.error('Error ejecutando seeds tenant', error);
            throw new DatabaseQueryException(
                `Error al ejecutar seeds tenant: ${error.message}`,
            );
        }
    }

    async validarConexionTenant(nombreBase: string): Promise<boolean> {
        try {
            const existe = await this.verificarExistenciaBase(nombreBase);
            return existe;
        } catch (error) {
            this.logger.error(`Error validando conexion tenant ${nombreBase}`, error);
            return false;
        }
    }

    obtenerConexionTenantActual(): Knex | null {
        return this.knexTenantActivo;
    }
}
