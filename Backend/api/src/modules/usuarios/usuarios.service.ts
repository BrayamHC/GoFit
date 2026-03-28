import { Injectable, Logger } from '@nestjs/common';
import { UsuariosRepoData } from './repositories/usuarios.repoData';
import { UsuariosBO } from './repositories/usuarios.bo';
import { UsuariosRepoAction } from './repositories/usuarios.repoAction';
import { logSqlError } from '../../common/utils/log-sql-error';
import {
    ResourceNotFoundException,
    DatabaseQueryException,
    DuplicateResourceException,
} from '../../common/exceptions';

@Injectable()
export class UsuariosService {
    private readonly logger = new Logger(UsuariosService.name);

    constructor(
        private readonly repoData: UsuariosRepoData,
        private readonly usuariosBO: UsuariosBO,
        private readonly repoAction: UsuariosRepoAction,
    ) { }

    async obtenerUsuarios(filtros?: any) {
        try {
            this.logger.debug('Obteniendo usuarios: ' + JSON.stringify(filtros));
            return (await this.repoData.obtenerUsuarios(filtros)) ?? [];
        } catch (error) {
            logSqlError(this.logger, 'obtenerUsuarios', error);
            throw new DatabaseQueryException('Error al obtener usuarios');
        }
    }

    async obtenerUsuarioPorUuid(uuid: string) {
        try {
            const usuario = await this.repoData.obtenerUsuarioPorUuid(uuid);
            if (!usuario) throw new ResourceNotFoundException('Usuario', uuid);
            return usuario;
        } catch (error) {
            if (error instanceof ResourceNotFoundException) throw error;
            logSqlError(this.logger, 'obtenerUsuarioPorUuid', error);
            throw new DatabaseQueryException('Error al obtener usuario');
        }
    }

    async crearUsuario(datos: any, usuarioSesion: any) {
        try {
            const existentes = await this.repoData.obtenerUsuarios({
                email: datos.email,
                status: 'activo',
            });
            if (existentes.length > 0)
                throw new DuplicateResourceException('usuario', 'email');

            const nuevoUsuario = await this.usuariosBO.armarInsert({
                ...datos,
                usuario_creacion: usuarioSesion.usuario_id,
            });
            const usuarioCreado = await this.repoAction.insertarUsuario(nuevoUsuario);

            this.logger.log(`Usuario creado: ${usuarioCreado.email} (ID: ${usuarioCreado.usuario_id})`);
            return usuarioCreado;
        } catch (error) {
            if (error instanceof DuplicateResourceException) throw error;
            logSqlError(this.logger, 'crearUsuario', error);
            throw new DatabaseQueryException('Error al crear usuario');
        }
    }

    async editarUsuario(uuid: string, datos: any, usuarioSesion: any) {
        try {
            const usuario = await this.obtenerUsuarioPorUuid(uuid);

            if (datos.email && datos.email !== usuario.email) {
                const duplicado = await this.repoData.obtenerUsuarios({
                    email: datos.email,
                    status: 'activo',
                });
                if (duplicado.length > 0)
                    throw new DuplicateResourceException('usuario', 'email');
            }

            const datosUpdate = this.usuariosBO.armarUpdate(datos, usuarioSesion.usuario_id);
            const usuarioEditado = await this.repoAction.actualizarUsuario(uuid, datosUpdate);

            this.logger.log(`Usuario editado: ${uuid}`);
            return usuarioEditado;
        } catch (error) {
            if (error instanceof ResourceNotFoundException) throw error;
            if (error instanceof DuplicateResourceException) throw error;
            logSqlError(this.logger, 'editarUsuario', error);
            throw new DatabaseQueryException('Error al editar usuario');
        }
    }

    async cambiarStatus(uuid: string, status: string, usuarioSesion: any) {
        try {
            await this.obtenerUsuarioPorUuid(uuid);

            const datosUpdate = this.usuariosBO.armarUpdateStatus(status, usuarioSesion.usuario_id);
            const usuarioEditado = await this.repoAction.actualizarUsuario(uuid, datosUpdate);

            this.logger.log(`Status de usuario ${uuid} cambiado a: ${status}`);
            return usuarioEditado;
        } catch (error) {
            if (error instanceof ResourceNotFoundException) throw error;
            logSqlError(this.logger, 'cambiarStatus', error);
            throw new DatabaseQueryException('Error al cambiar status del usuario');
        }
    }
}
