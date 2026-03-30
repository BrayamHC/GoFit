import { Module } from '@nestjs/common';
import { BitacoraController } from './bitacora.controller';
import { BitacoraService } from './bitacora.service';
import { BitacoraBO } from './repositories/bitacora.bo';
import { BitacoraRepoAction } from './repositories/bitacora.repoAction';
import { BitacoraRepoData } from './repositories/bitacora.repoData';
import { BitacoraRepoHelper } from './repositories/bitacora.repoHelper';

@Module({
    controllers: [BitacoraController],
    providers: [
        BitacoraService,
        BitacoraBO,
        BitacoraRepoAction,
        BitacoraRepoData,
        BitacoraRepoHelper
    ],
    exports: [BitacoraService],
})
export class BitacoraModule { }