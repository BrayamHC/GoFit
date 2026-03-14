// src/services/despacho.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { DespachoRepoData } from '../repo/RepoData/Despacho.repoData';
import { DespachoBO } from '../repo/BO/despacho.bo';
import { logSqlError } from '../common/utils/log-sql-error';



import {
    ResourceNotFoundException,
    DatabaseQueryException,
    DuplicateResourceException,
} from '../common/exceptions';
import { DespachoRepoAction } from 'src/repo/actions/despacho.repoAction';
import { success } from 'zod';

@Injectable()
export class DespachoService {
    private readonly logger = new Logger(DespachoService.name);

    constructor(private readonly repoData: DespachoRepoData,
        private readonly despachoBO: DespachoBO,
        private readonly despachoRepoAction: DespachoRepoAction,
    ) { }

    async obtenerDespachos(filtros?: any) {
        try {
            this.logger.debug('Obteniendo despachos con filtros: ' + JSON.stringify(filtros));
            const despachos = await this.repoData.obtenerDespachos(filtros);

            if (!despachos || despachos.length === 0) {
                this.logger.debug('No se encontraron despachos con los filtros proporcionados');
                return [];
            }
            return despachos;
        } catch (error) {
            logSqlError(this.logger, 'obtenerDespachos', error);
            throw new DatabaseQueryException('Error al obtener despachos');
        }
    }

    async obtenerDespachosConBitácora(filtros?: any) {
        const despachos = await this.repoData.obtenerDespachos(filtros);

        if (!despachos || despachos.length === 0) {
            return [];
        }

        const despachoIds = despachos.map(d => d.despacho_id);

        const bitacoras = await this.repoData.obtenerBitacoras({
            modulo: 'despachos',
            modulo_ids: despachoIds
        });

        const bitacorasMap: { [key: number]: any[] } = {};

        bitacoras.forEach(bitacora => {
            if (!bitacorasMap[bitacora.modulo_id]) {
                bitacorasMap[bitacora.modulo_id] = [];
            }
            bitacorasMap[bitacora.modulo_id].push(bitacora);
        });

        const despachosConBitacora = despachos.map(despacho => ({
            ...despacho,
            bitacoras: bitacorasMap[despacho.despacho_id] || []
        }));

        return despachosConBitacora;
    }


    async obtenerZonasHorarias() {
        try {
            this.logger.debug('Obteniendo zonas horarias');
            const zonasHorarias = await this.repoData.obtenerZonasHorarias();

            if (!zonasHorarias || zonasHorarias.length === 0) {
                this.logger.warn('No hay zonas horarias disponibles');
                return [];
            }

            return zonasHorarias;
        } catch (error) {
            logSqlError(this.logger, 'obtenerZonasHorarias', error);
            throw new DatabaseQueryException('Error al obtener zonas horarias');
        }
    }

    async obtenerUsuariosGlobales() {
        try {
            this.logger.debug('Obteniendo usuarios globales');

            const usuarios = await this.repoData.obtenerUsuariosGlobales();

            if (!usuarios || usuarios.length === 0) {
                this.logger.debug('No se encontraron usuarios globales');
                return [];
            }

            const usuariosFiltrados = usuarios.filter(
                u => u.usuario_id !== 1
            );

            return usuariosFiltrados;

        } catch (error) {
            logSqlError(this.logger, 'obtenerUsuariosGlobales', error);
            throw new DatabaseQueryException('Error al obtener usuarios globales');
        }
    }

    async crearPlan(datos: any, usuarioCreacion: any) {
        this.logger.debug(
            `Creando plan: ${datos.nombrePlan} por ${usuarioCreacion.email}`,
        );

        const planExistente = await this.repoData.obtenerPlanes({
            nombrePlan: datos.nombrePlan,
            status: 'activo',
        });

        if (planExistente && planExistente.length > 0) {
            this.logger.warn(
                `Ya existe un plan con ese nombre: ${datos.nombrePlan}`,
            );
            throw new DuplicateResourceException('plan', 'nombrePlan');
        }

        const nuevoPlan = await this.despachoBO.armarInsertPlan(
            {
                ...datos,
                usuarioCreacion: usuarioCreacion.usuario_id,
            },
        );


        try {
            const planCreado = await this.despachoRepoAction.insertarPlan(nuevoPlan);

            return {
                success: true,
                message: 'Plan creado exitosamente',
                planCreado
            }
        } catch (error) {
            if (error instanceof DuplicateResourceException) {
                throw error;
            }
            logSqlError(this.logger, 'crearPlan', error);
            throw new DatabaseQueryException('Error al crear plan');
        }
    }


    async obtenerPlanes(filtros?: any) {
        try {
            this.logger.debug('Obteniendo planes disponibles');
            const planes = await this.repoData.obtenerPlanes(filtros);

            if (!planes || planes.length === 0) {
                this.logger.warn('No hay planes disponibles');
                return [];
            }

            return planes;
        } catch (error) {
            logSqlError(this.logger, 'obtenerPlanes', error);
            throw new DatabaseQueryException('Error al obtener planes');
        }
    }

    async crearUsuarioGlobal(datos: any, usuarioCreacion: any) {
        try {
            this.logger.debug(
                `Creando usuario global: ${datos.email} por ${usuarioCreacion.email}`,
            );
            const usuariosExistentes = await this.repoData.obtenerUsuariosGlobales({
                email: datos.email,
                status: 'activo',
            });

            if (usuariosExistentes && usuariosExistentes.length > 0) {
                this.logger.warn(
                    `Ya existe un usuario activo con el email: ${datos.email}`,
                );
                throw new DuplicateResourceException('usuario global', 'email');
            }

            const nuevoUsuario = await this.despachoBO.armarInsertUsuarioGlobal({
                ...datos,
                usuario_creacion: usuarioCreacion.usuario_id,
            });

            const usuarioGlobalCreado = await this.despachoRepoAction.insertarUsuarioGlobal(
                nuevoUsuario,
            );

            this.logger.log(
                `Usuario global creado: ${usuarioGlobalCreado.email} (ID: ${usuarioGlobalCreado.usuario_id})`,
            );

            return {
                success: true,
                message: 'Usuario global creado exitosamente',
                data: {
                    usuario_id: usuarioGlobalCreado.usuario_id,
                    nombre: usuarioGlobalCreado.nombre,
                    email: usuarioGlobalCreado.email,
                    rol: usuarioGlobalCreado.rol,
                },
            };
        } catch (error) {
            if (error instanceof DuplicateResourceException) {
                throw error;
            }
            logSqlError(this.logger, 'crearUsuarioGlobal', error);
            throw new DatabaseQueryException('Error al crear usuario global');
        }
    }

    async obtenerMetricas() {
        try {
            let totalDespachos = await this.repoData.obtenerTotalDespachos();
            let totalUsuariosGlobales = await this.repoData.obtenerTotalUsuariosGlobales();
            let totalDespachosActivos = await this.repoData.obtenerTotalDespachos({ status: 'activo' });
            let metricas = {
                totalDespachos,
                totalUsuariosGlobales,
                totalDespachosActivos,
            };
            return metricas;
        } catch (error) {
            logSqlError(this.logger, 'obtenerMetricas', error);
            throw new DatabaseQueryException('Error al obtener métricas de despachos');
        }
    }
    async obtenerSuscripciones(filtros?: any) {
        try {
            this.logger.debug('Obteniendo suscripciones');
            const suscripciones = await this.repoData.obtenerSuscripciones(filtros);
            return suscripciones;
        } catch (error) {
            logSqlError(this.logger, 'obtenerSuscripciones', error);
            throw new DatabaseQueryException('Error al obtener suscripciones');
        }
    }



}
