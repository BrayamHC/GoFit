import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthCoordinator } from '../coordinators/auth.coordinator';
import { validar, LoginGlobalSchema } from '../utils/validator';
import { Throttle, seconds } from '@nestjs/throttler';

@Controller('Auth')
export class AuthController {
    constructor(private readonly authCoordinator: AuthCoordinator) {}

    @Throttle({ default: { limit: 5, ttl: seconds(60) } })
    @Post('Login')
    async login(@Body() data: any) {
        const datosValidados = validar(LoginGlobalSchema, data);
        return await this.authCoordinator.iniciarSesion(datosValidados);
    }

    @Post('Logout')
    async logout(@Request() req: any) {
        const token = req.token;
        return await this.authCoordinator.cerrarSesion(token);
    }
}
