import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SuscripcionesRepoAction } from '../modules/suscripciones/repositories/suscripciones.repoAction';
import { BitacoraService } from '../modules/bitacora/bitacora.service';

@Injectable()
export class SuscripcionesCron {
    private readonly logger = new Logger(SuscripcionesCron.name);

    constructor(
        private readonly repoAction: SuscripcionesRepoAction,
        private readonly bitacoraService: BitacoraService,
    ) { }

    @Cron('5 0 * * *')
    async vencerSuscripcionesExpiradas() {
        const hoy = new Date().toISOString().split('T')[0];
        this.logger.log(`[CRON] Verificando suscripciones vencidas al ${hoy}`);

        try {
            const total = await this.repoAction.vencerExpiradas(hoy);

            if (total > 0) {
                await this.bitacoraService.agregarBitacora({
                    usuario_id: null,
                    usuario_nombre: 'Sistema',
                    modulo: 'suscripciones',
                    modulo_id: null,
                    accion: 'cron',
                    descripcion: `Cron: ${total} suscripción(es) marcadas como vencidas al ${hoy}`,
                });
            }

            this.logger.log(`[CRON] Suscripciones vencidas: ${total} registros actualizados`);
        } catch (error) {
            this.logger.error('[CRON] Error al vencer suscripciones expiradas', error);
        }
    }
}