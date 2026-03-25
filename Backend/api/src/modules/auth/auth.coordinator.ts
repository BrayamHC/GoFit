import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
    InvalidCredentialsException,
    SessionExpiredException,
    DatabaseQueryException,
} from '../../common/exceptions';

@Injectable()
export class AuthCoordinator {
    private readonly logger = new Logger(AuthCoordinator.name);

    constructor(private readonly authService: AuthService) { }

    async iniciarSesion(datos: any) {
        try {
            this.logger.log('Iniciando sesion...');

            const usuario = await this.authService.validarUsuario(datos.email, datos.password);
            if (!usuario) throw new InvalidCredentialsException();

            this.logger.log(`Usuario validado: ${usuario.email}`);

            await this.authService.cerrarSesionPrevia(usuario.usuario_id);

            const token = this.authService.generarTokenSesion('GOFIT');
            this.logger.debug(`Token generado: ${token.substring(0, 30)}...`);

            await this.authService.guardarSesionEnRedis(token, usuario);

            this.logger.log('Sesion iniciada - Solo una sesion activa por usuario');

            return {
                success: true,
                message: 'Login exitoso',
                data: {
                    token,
                    usuario: {
                        usuario_id: usuario.usuario_id,
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        email: usuario.email,
                    },
                },
            };
        } catch (error) {
            if (error instanceof InvalidCredentialsException) throw error;
            this.logger.error('Error en login', error);
            throw new DatabaseQueryException('Error al iniciar sesion');
        }
    }

    async cerrarSesion(token: string) {
        try {
            this.logger.log(`Cerrando sesion: ${token.substring(0, 30)}...`);

            const sesion = await this.authService.obtenerSesionDesdeRedis(token);
            if (!sesion) throw new SessionExpiredException();

            await this.authService.eliminarSesionDeRedis(token);

            this.logger.log('Sesion cerrada correctamente');

            return {
                success: true,
                message: 'Sesion cerrada exitosamente',
            };
        } catch (error) {
            if (error instanceof SessionExpiredException) throw error;
            this.logger.error('Error cerrando sesion', error);
            throw new DatabaseQueryException('Error al cerrar sesion');
        }
    }
}
