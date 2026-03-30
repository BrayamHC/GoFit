// src/modules/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthCoordinator } from './auth.coordinator';
import { AuthService } from './auth.service';
import { AuthRepoData } from './repositories/auth.repoData';
import { DatabaseService } from '../../services/database.service';
import { KnexModule } from '../../database/knex.module';
import { animationFrameScheduler } from 'rxjs';

@Module({
    imports: [KnexModule],
    controllers: [AuthController],
    providers: [
        AuthCoordinator,
        AuthService,
        AuthRepoData,
        DatabaseService,
    ],
    exports: [AuthService, DatabaseService, AuthRepoData], // Para usar en middleware
})
export class AuthModule { }
