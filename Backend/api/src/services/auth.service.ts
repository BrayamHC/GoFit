import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { getRedisConfig } from '../database/config/database.config';
import { AuthRepoData } from '../repo/RepoData/Auth.repoData';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import Redis from 'ioredis';
import {
    InvalidCredentialsException,
    InactiveUserException,
    RedisConnectionException,
    DatabaseQueryException,
} from '../common/exceptions';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(AuthService.name);
    private clienteRedis: Redis;

    constructor(private readonly authRepoData: AuthRepoData) {}

    async onModuleInit() {
        const configRedis = getRedisConfig();
        try {
            this.clienteRedis = new Redis({
                host: configRedis.host,
                port: configRedis.port,
                password: configRedis.password || undefined,
                retryStrategy: (intentos) => Math.min(intentos * 50, 2000),
            });

            this.clienteRedis.on('connect', () =>
                this.logger.log('Conexion a Redis establecida correctamente'),
            );
            this.clienteRedis.on('error', (error) =>
                this.logger.error('Error en conexion Redis', error),
            );
        } catch (error) {
            this.logger.error('Error inicializando Redis', error);
            throw new RedisConnectionException('No se pudo conectar a Redis');
        }
    }

    async onModuleDestroy() {
        try {
            await this.clienteRedis.quit();
            this.logger.log('Redis desconectado correctamente');
        } catch (error) {
            this.logger.error('Error cerrando conexion Redis', error);
        }
    }

    // ==============================================
    // ========== AUTENTICACION =====================
    // ==============================================

    async validarContrasenia(plana: string, hasheada: string): Promise<boolean> {
        try {
            return await bcrypt.compare(plana, hasheada);
        } catch (error) {
            this.logger.error('Error validando contrasena', error);
            return false;
        }
    }

    async validarUsuario(email: string, contrasenia: string) {
        try {
            const usuario = await this.authRepoData.obtenerUsuarioPorEmail(email);

            if (!usuario) {
                return null;
            }

            if (usuario.status !== 'activo') {
                throw new InactiveUserException('Usuario inactivo o bloqueado');
            }

            const contraseniaValida = await this.validarContrasenia(
                contrasenia,
                usuario.password,
            );

            if (!contraseniaValida) {
                return null;
            }

            return {
                usuario_id:   usuario.usuario_id,
                usuario_uuid: usuario.usuario_uuid,
                nombre:       usuario.nombre,
                apellido:     usuario.apellido,
                email:        usuario.email,
            };
        } catch (error) {
            if (error instanceof InactiveUserException) throw error;

            this.logger.error('Error validando usuario', error);
            throw new DatabaseQueryException('Error al validar usuario');
        }
    }

    async verificarExistenciaUsuario(usuarioId: number): Promise<boolean> {
        try {
            const usuario = await this.authRepoData.obtenerUsuarioPorId(usuarioId);
            return !!usuario;
        } catch (error) {
            this.logger.error('Error verificando existencia de usuario', error);
            return false;
        }
    }

    // ==============================================
    // ============= TOKEN ==========================
    // ==============================================

    generarTokenSesion(prefijo: string): string {
        const ahora = new Date();

        const iniciales = prefijo
            .split('-')
            .map((p) => p.charAt(0).toUpperCase())
            .join('');

        const dia    = ahora.getDate().toString().padStart(2, '0');
        const mes    = (ahora.getMonth() + 1).toString().padStart(2, '0');
        const anio   = ahora.getFullYear();
        const hora   = ahora.getHours().toString().padStart(2, '0');
        const minuto = ahora.getMinutes().toString().padStart(2, '0');
        const segundo = ahora.getSeconds().toString().padStart(2, '0');

        const salt = crypto.randomBytes(32).toString('base64url');

        return `${iniciales}_${dia}${mes}${anio}_${hora}${minuto}${segundo}_${salt}`;
    }

    // ==============================================
    // ========== SESION UNICA ======================
    // ==============================================

    async obtenerSesionActivaPorUsuario(usuarioId: number): Promise<string | null> {
        try {
            return await this.clienteRedis.get(`usuario:${usuarioId}`);
        } catch (error) {
            this.logger.error('Error obteniendo sesion activa por usuario', error);
            return null;
        }
    }

    async cerrarSesionPrevia(usuarioId: number): Promise<void> {
        try {
            const tokenAnterior = await this.obtenerSesionActivaPorUsuario(usuarioId);

            if (!tokenAnterior) return;

            this.logger.warn(
                `Cerrando sesion previa del usuario ${usuarioId} - Token: ${tokenAnterior.substring(0, 15)}...`,
            );

            await this.clienteRedis.del(`sesion:${tokenAnterior}`);
            await this.clienteRedis.del(`usuario:${usuarioId}`);

            this.logger.log('Sesion anterior eliminada correctamente');
        } catch (error) {
            this.logger.error('Error cerrando sesion previa', error);
            // No lanzar — permitir continuar con el login
        }
    }

    // ==============================================
    // ============= REDIS ==========================
    // ==============================================

    async guardarSesionEnRedis(token: string, datosUsuario: any): Promise<void> {
        try {
            const { sessionTTL } = getRedisConfig();

            const datosSesion = {
                token,
                usuario: datosUsuario,
                fecha_creacion: new Date().toISOString(),
            };

            // sesion:{token} → datos completos
            await this.clienteRedis.setex(
                `sesion:${token}`,
                sessionTTL,
                JSON.stringify(datosSesion),
            );

            // usuario:{usuario_id} → token (índice secundario)
            await this.clienteRedis.setex(
                `usuario:${datosUsuario.usuario_id}`,
                sessionTTL,
                token,
            );

            this.logger.debug(
                `Sesion guardada: ${token.substring(0, 15)}... | Usuario: ${datosUsuario.usuario_id}`,
            );
        } catch (error) {
            this.logger.error('Error guardando sesion en Redis', error);
            throw new RedisConnectionException('Error al guardar sesion');
        }
    }

    async obtenerSesionDesdeRedis(token: string): Promise<any | null> {
        try {
            const datosSesion = await this.clienteRedis.get(`sesion:${token}`);
            return datosSesion ? JSON.parse(datosSesion) : null;
        } catch (error) {
            this.logger.error('Error obteniendo sesion desde Redis', error);
            throw new RedisConnectionException('Error al obtener sesion');
        }
    }

    async eliminarSesionDeRedis(token: string): Promise<void> {
        try {
            const sesion = await this.obtenerSesionDesdeRedis(token);

            await this.clienteRedis.del(`sesion:${token}`);

            if (sesion?.usuario?.usuario_id) {
                await this.clienteRedis.del(`usuario:${sesion.usuario.usuario_id}`);
            }

            this.logger.debug(`Sesion eliminada: ${token.substring(0, 15)}...`);
        } catch (error) {
            this.logger.error('Error eliminando sesion de Redis', error);
            throw new RedisConnectionException('Error al eliminar sesion');
        }
    }

    async renovarExpiracionSesionEnRedis(
        token: string,
        usuarioId: number,
        segundos?: number,
    ): Promise<void> {
        try {
            const { sessionTTL } = getRedisConfig();
            const ttl = segundos || sessionTTL;

            await this.clienteRedis.expire(`sesion:${token}`, ttl);
            await this.clienteRedis.expire(`usuario:${usuarioId}`, ttl);

            this.logger.debug(`TTL renovado (${ttl}s): ${token.substring(0, 15)}...`);
        } catch (error) {
            this.logger.error('Error renovando TTL de sesion', error);
            throw new RedisConnectionException('Error al renovar sesion');
        }
    }

    async verificarExistenciaSesionEnRedis(token: string): Promise<boolean> {
        try {
            const existe = await this.clienteRedis.exists(`sesion:${token}`);
            return existe === 1;
        } catch (error) {
            this.logger.error('Error verificando existencia de sesion', error);
            return false;
        }
    }

    async validarConexionRedis(): Promise<boolean> {
        try {
            const respuesta = await this.clienteRedis.ping();
            return respuesta === 'PONG';
        } catch (error) {
            this.logger.error('Error validando conexion Redis', error);
            return false;
        }
    }
}
