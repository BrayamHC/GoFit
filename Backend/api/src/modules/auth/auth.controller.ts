import { Controller, Post, Body, Request } from '@nestjs/common';
import { Throttle, seconds } from '@nestjs/throttler';
import { AuthCoordinator } from './auth.coordinator';
import { LoginDTO } from './dto/auth.dto';

@Controller('Auth')
export class AuthController {
    constructor(private readonly authCoordinator: AuthCoordinator) { }

    @Throttle({ default: { limit: 5, ttl: seconds(60) } })
    @Post('Login')
    async login(@Body() body: LoginDTO) {
        return await this.authCoordinator.iniciarSesion(body);
    }

    @Post('Logout')
    async logout(@Request() req: any) {
        return await this.authCoordinator.cerrarSesion(req.token);
    }
}
