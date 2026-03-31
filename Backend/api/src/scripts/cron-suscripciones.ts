import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { CronAppModule } from './cron-app.module';
import { SuscripcionesCron } from '../crons/suscripciones.cron';
import { winstonConfig } from '../common/config/logger.config';

async function main() {
    const app = await NestFactory.createApplicationContext(CronAppModule, {
        logger: WinstonModule.createLogger(winstonConfig),
    });

    const cron = app.get(SuscripcionesCron);
    await cron.vencerSuscripcionesExpiradas();
    await app.close();
    process.exit(0); // ← forzar salida limpia
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});