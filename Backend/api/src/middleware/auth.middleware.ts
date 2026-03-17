import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AuthMiddleware.name);

    constructor(private readonly authService: AuthService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = this.extractTokenFromHeader(req);

            if (!token) {
                throw new UnauthorizedException('Token no proporcionado');
            }

            this.logger.debug(`Validando token: ${token.substring(0, 30)}...`);

            // 1. Obtener sesión desde Redis
            const sesion = await this.authService.obtenerSesionDesdeRedis(token);

            if (!sesion) {
                throw new UnauthorizedException('Token inválido o sesión expirada');
            }

            this.logger.debug(`Token válido: ${sesion.usuario.email}`);

            // 2. Validar consistencia sesión ↔ índice secundario
            await this.validarConsistenciaSesion(token, sesion);

            // 3. Validar que el usuario aún existe y está activo en BD
            await this.validarExistenciaUsuarioBD(token, sesion);

            // 4. Adjuntar datos al request
            (req as any).user    = sesion.usuario;
            (req as any).token   = token;
            (req as any).sesion  = sesion;
            (req as any).tipoSesion = sesion.tipo_sesion;

            // 5. Renovar TTL
            await this.authService.renovarExpiracionSesionEnRedis(
                token,
                sesion.usuario.usuario_id,
            );

            this.logger.debug(`TTL renovado para: ${sesion.usuario.email}`);

            next();
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            this.logger.error('Error en AuthMiddleware', error);
            throw new UnauthorizedException('Error al validar token');
        }
    }

    // ──────────────────────────────────────────────────────────
    // Valida que el token en Redis coincida con el del índice
    // Detecta sesiones huérfanas o tokens viejos (single session)
    // ──────────────────────────────────────────────────────────
    private async validarConsistenciaSesion(token: string, sesion: any): Promise<void> {
        const { usuario } = sesion;

        const tokenEnIndice = await this.authService.obtenerSesionActivaPorUsuario(
            usuario.usuario_id,
        );

        if (!tokenEnIndice || tokenEnIndice !== token) {
            const razon = !tokenEnIndice
                ? 'Índice NO EXISTE (sesión huérfana)'
                : `Token desactualizado — Esperado: ${tokenEnIndice.substring(0, 20)}...`;

            this.logger.warn(
                `Sesión inválida — Token: ${token.substring(0, 30)}... | Razón: ${razon}`,
            );

            await this.authService.eliminarSesionDeRedis(token);

            throw new UnauthorizedException(
                'Sesión inválida o expirada — Por favor inicie sesión nuevamente',
            );
        }

        this.logger.debug(
            `Consistencia validada: usuario:${usuario.usuario_id} → ${token.substring(0, 30)}...`,
        );
    }

    // ──────────────────────────────────────────────────────────
    // Valida que el usuario exista y esté activo en BD
    // Si fue eliminado/inactivado, invalida la sesión en Redis
    // ──────────────────────────────────────────────────────────
    private async validarExistenciaUsuarioBD(token: string, sesion: any): Promise<void> {
        const { usuario } = sesion;

        const existe = await this.authService.verificarExistenciaUsuario(usuario.usuario_id);

        if (!existe) {
            this.logger.warn(
                `Usuario ${usuario.usuario_id} no existe en BD — invalidando sesión`,
            );
            await this.authService.eliminarSesionDeRedis(token);
            throw new UnauthorizedException(
                'Error en la sesión — por favor inicie sesión nuevamente',
            );
        }

        this.logger.debug(`Existencia BD confirmada: usuario ${usuario.usuario_id}`);
    }

    private extractTokenFromHeader(req: Request): string | undefined {
        const authorization = req.headers.authorization;
        if (!authorization) return undefined;
        const token = authorization.replace('Bearer ', '').trim();
        return token || undefined;
    }
}
