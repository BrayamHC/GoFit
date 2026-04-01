import { Module } from '@nestjs/common';
import { RegistrosFacialesController } from './registros-faciales.controller';
import { RegistrosFacialesService } from './registros-faciales.service';
import { RegistrosFacialesRepoData } from './repositories/registros-faciales.repoData';
import { RegistrosFacialesRepoAction } from './repositories/registros-faciales.repoAction';

@Module({
    controllers: [RegistrosFacialesController],
    providers: [
        RegistrosFacialesService,
        RegistrosFacialesRepoData,
        RegistrosFacialesRepoAction,
    ],
    exports: [RegistrosFacialesService],
})
export class RegistrosFacialesModule { }