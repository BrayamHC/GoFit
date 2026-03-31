import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AsistenciasRepoAction } from '../modules/asistencias/repositories/asistencias.repoAction';
import { BitacoraService } from '../modules/bitacora/bitacora.service';

@Injectable()
export class AsistenciasCron {
    private readonly logger = new Logger(AsistenciasCron.name);

    constructor(
        private readonly repoAction: AsistenciasRepoAction,
        private readonly bitacoraService: BitacoraService,
    ) { }

    @Cron('55 23 * * *')
    async cerrarAsistenciasNoCerradas() {
        const hoy = new Date().toISOString().split('T')[0];
        this.logger.log(`[CRON] Cerrando asistencias no cerradas del ${hoy}`);

        try {
            const total = await this.repoAction.marcarNoCerradas(hoy);

            if (total > 0) {
                await this.bitacoraService.agregarBitacora({
                    usuario_id: null,
                    usuario_nombre: 'Sistema',
                    modulo: 'asistencias',
                    modulo_id: null,
                    accion: 'cron',
                    descripcion: `Cron: ${total} asistencia(s) marcadas como no_cerrada del ${hoy}`,
                });
            }

            this.logger.log(`[CRON] Asistencias no cerradas: ${total} registros actualizados`);
        } catch (error) {
            this.logger.error('[CRON] Error al cerrar asistencias no cerradas', error);
        }
    }
}