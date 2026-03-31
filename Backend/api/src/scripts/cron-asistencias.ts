import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AsistenciasCron } from '../crons/asistencias.cron';
import { winstonConfig } from '../common/config/logger.config';
import { CronAppModule } from './cron-app.module';

async function main() {
    const app = await NestFactory.createApplicationContext(CronAppModule, {
        logger: WinstonModule.createLogger(winstonConfig),
    });

    const cron = app.get(AsistenciasCron);
    await cron.cerrarAsistenciasNoCerradas();
    await app.close();
    process.exit(0); // ← forzar salida limpia
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});