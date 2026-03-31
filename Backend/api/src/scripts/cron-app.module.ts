import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { KnexModule } from '../database/knex.module';
import { CronsModule } from '../crons/crons.module';
import { BitacoraModule } from '../modules/bitacora/bitacora.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        KnexModule,
        BitacoraModule,
        CronsModule,
    ],
})
export class CronAppModule { }