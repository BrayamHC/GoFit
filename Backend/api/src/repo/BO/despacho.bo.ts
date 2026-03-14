// src/repo/BO/Despacho.bo.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { agregarDias, parseFechaLocal } from '../../utils/date.utils';
import { CAMPOS_DESPACHO, CAMPOS_USUARIO_ADMIN } from '../../constantes/despacho.const';


@Injectable()
export class DespachoBO {

    armarInsertDespacho(datos: any) {
        return {
            // Campos del frontend
            razon_social: datos.razon_social,
            nombre_comercial: datos.nombre_comercial,
            subdominio: datos.subdominio,
            rfc: datos.rfc,
            zona_id: datos.zona_id,
            plan_id: datos.plan_id,
            nota: datos.nota,
            // Datos usuario administrador
            usuario_nombre: datos.nombre_completo,
            usuario_email: datos.email,
            usuario_telefono: datos.telefono,
            usuario_direccion: datos.direccion,

            // Credenciales de base de datos tenant (vienen del DatabaseService)
            db_host: datos.db_host,
            db_port: datos.db_port,
            db_user: datos.db_user,
            db_password: datos.db_password,
            db_name: datos.db_name,

            // Campos seteados por el backend
            status: 'activo',
            fecha_creacion: new Date(),
            fecha_actualizacion: null,
            usuario_creacion: datos.usuario_creacion,
            usuario_actualizacion: null,
        };
    }

    async armarInsertUsuarioAdminTenant(datos: any) {
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
        const passwordHash = await bcrypt.hash(datos.password, saltRounds);

        return {
            nombre_completo: datos.nombre_completo,
            email: datos.email,
            telefono: datos.telefono,
            password: passwordHash,
            direccion: datos.direccion,
            rol_id: 1, // Siempre admin
            status: 'activo',
            fecha_ultimo_acceso: null,
            usuario_creacion: null,
            usuario_actualizacion: null,
            fecha_creacion: new Date(),
            fecha_actualizacion: null,
        };
    }

    async armarInsertUsuarioGlobal(datos: any) {
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
        const passwordHash = await bcrypt.hash(datos.password, saltRounds);

        return {
            nombre: datos.nombre,
            email: datos.email,
            password: passwordHash,
            status: 'activo',
            fecha_ultimo_acceso: null,
            usuario_creacion: datos.usuario_creacion,
            usuario_actualizacion: null,
            fecha_creacion: new Date(),
            fecha_actualizacion: null,
        };
    }

    armarInsertSuscripcion(despachoId: number, planId: number, fecha_activacion?: string, diasDuracion?: number, diasGracia?: number) {
        const fechaInicio = fecha_activacion
            ? parseFechaLocal(fecha_activacion)
            : new Date();

        // Calcular fecha_fin usando los días del plan
        const fechaFin = agregarDias(fechaInicio, diasDuracion!);

        return {
            despacho_id: despachoId,
            plan_id: planId,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            status: 'activo',
            fecha_creacion: new Date(),
            fecha_actualizacion: null,
            motivo: null,
            fecha_suspension: null,
            dias_gracia: diasGracia || 0,
        };
    }

    armarInsertBitacoraGlobal(datos: {
        usuario_id: number;
        usuario_nombre: string;
        modulo: string;
        modulo_id: number | null;
        accion: string;
        descripcion: string;
    }) {
        return {
            usuario_id: datos.usuario_id,
            usuario_nombre: datos.usuario_nombre,
            modulo: datos.modulo,
            modulo_id: datos.modulo_id,
            accion: datos.accion,
            descripcion: datos.descripcion,
            fecha: new Date(),
        };
    }
    armarUpdateDespacho(datos: any, usuarioActualizacionId: number) {
        const camposActualizar: any = {
            fecha_actualizacion: new Date(),
            usuario_actualizacion: usuarioActualizacionId,
        };

        if (datos.nombre_comercial !== undefined) camposActualizar.nombre_comercial = datos.nombre_comercial;
        if (datos.zona_id !== undefined) camposActualizar.zona_id = datos.zona_id;
        if (datos.plan_id !== undefined) camposActualizar.plan_id = datos.plan_id;
        if (datos.nota !== undefined) camposActualizar.nota = datos.nota;

        if (datos.email !== undefined) camposActualizar.usuario_email = datos.email;
        if (datos.nombre_completo !== undefined) camposActualizar.usuario_nombre = datos.nombre_completo;
        if (datos.telefono !== undefined) camposActualizar.usuario_telefono = datos.telefono;
        if (datos.direccion !== undefined) camposActualizar.usuario_direccion = datos.direccion;

        return camposActualizar;
    }

    armarUpdateSuscripcion(planId: number) {
        return {
            plan_id: planId,
            fecha_actualizacion: new Date(),
        };
    }

    separarCamposUsuario(datos: any) {
        const datosUsuario: any = {};

        CAMPOS_USUARIO_ADMIN.forEach((campo) => {
            if (datos[campo] !== undefined) {
                datosUsuario[campo] = datos[campo];
            }
        });

        if (Object.keys(datosUsuario).length > 0) {
            datosUsuario.fecha_actualizacion = new Date();
        }

        return {
            datosUsuario,
            hayDatosUsuario: Object.keys(datosUsuario).length > 0,
        };
    }

    armarUpdateUsuarioAdminTenant(datos: any, usuarioActualizacionId: number) {
        const camposUsuario: any = {
            fecha_actualizacion: new Date(),
            usuario_actualizacion: usuarioActualizacionId,
        };

        if (datos.email) camposUsuario.email = datos.email;
        if (datos.nombre_completo) camposUsuario.nombre_completo = datos.nombre_completo;
        if (datos.telefono) camposUsuario.telefono = datos.telefono;
        if (datos.direccion) camposUsuario.direccion = datos.direccion;

        return camposUsuario;
    }

    generarDescripcionActualizacion(razonSocial: string, campos: any, usuarioNombre: string): string {
        const mapeoNombres: Record<string, string> = {
            nombre_comercial: 'Nombre comercial',
            zona_id: 'Zona horaria',
            plan_id: 'Plan',
            nota: 'Nota',
            email: 'Email',
            nombre_completo: 'Nombre completo',
            telefono: 'Teléfono',
            direccion: 'Dirección',
        };

        const camposLegibles = Object.keys(campos)
            .map(campo => mapeoNombres[campo] || campo)
            .join(', ');

        return `Despacho '${razonSocial}' actualizado (campos: ${camposLegibles}) por '${usuarioNombre}'`;
    }

    armarInsertPlan(datos: any) {
        return {
            nombre_plan: datos.nombrePlan,
            descripcion_plan: datos.descripcionPlan,
            costo: datos.costo,
            moneda: datos.moneda,
            limite_usuarios: datos.limiteUsuarios,
            limite_almacenamiento_mb: datos.limiteAlmacenamientoMb,
            dias_duracion: datos.diasDuracion,
            total_timbres: datos.totalTimbres,
            caracteristicas: JSON.stringify(datos.caracteristicas ?? []),
            dias_gracia: datos.diasGracia,

            //Campos seteados por backend
            status: 'activo',
            fecha_creacion: new Date(),
            fecha_actualizacion: null,
            usuario_creacion: datos.usuarioCreacion,
            usuario_actualizacion: null,
        }

    }


}