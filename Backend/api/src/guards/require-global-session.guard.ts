// src/guards/require-global-session.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RequireGlobalSessionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        if (request.tipoSesion !== 'global') {
            throw new UnauthorizedException(
                'Esta acción solo está disponible para administradores globales. '
            );
        }

        console.log('Sesión global verificada');
        return true;
    }
}
