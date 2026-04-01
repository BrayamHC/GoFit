import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    InternalServerErrorException,
} from '@nestjs/common';

/**
 * Guard para el endpoint exclusivo de FastAPI Vision.
 * No valida JWT de usuario — valida un API key compartido (x-vision-key).
 * Se aplica SOLO en los endpoints que Vision consume (GET /registros-faciales/encodings).
 */
@Injectable()
export class VisionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const claveEsperada = process.env.VISION_API_KEY;

        if (!claveEsperada) {
            throw new InternalServerErrorException(
                'VISION_API_KEY no está configurada en las variables de entorno.',
            );
        }

        const request = context.switchToHttp().getRequest();
        const claveRec = request.headers['x-vision-key'];

        if (!claveRec || claveRec !== claveEsperada) {
            throw new UnauthorizedException('API key de Vision inválida o ausente.');
        }

        return true;
    }
}
