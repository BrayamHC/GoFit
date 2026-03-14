// src/middleware/extractor-subdominio.middleware.ts
import { Injectable, NestMiddleware, Logger, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ExtractorSubdominioMiddleware implements NestMiddleware {
    private readonly logger = new Logger(ExtractorSubdominioMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        const host = req.headers.host || '';

        this.logger.debug(`Host recibido: ${host}`);

        // Extraer subdominio
        const partesSinPuerto = host.split(':')[0]; // Quitar puerto (lvh.me:3000)
        const partes = partesSinPuerto.split('.');

        // Desarrollo local: localhost, 127.0.0.1, 192.168.x.x
        if (partes.length === 1 || host.includes('localhost') || /^\d+\.\d+\.\d+\.\d+/.test(host)) {
            this.logger.debug('Acceso local/IP detectado - Login requiere subdominio');
            req['subdominio'] = null;
            return next();
        }

        // Producción o lvh.me: extraer primera parte
        if (partes.length >= 2) {
            const subdominioExtraido = partes[0];

            // Validar formato (solo letras minúsculas, números y guiones)
            const formatoValido = /^[a-z0-9-]+$/.test(subdominioExtraido);

            if (!formatoValido) {
                this.logger.warn(`Subdominio con formato inválido: ${subdominioExtraido}`);
                throw new BadRequestException('Formato de subdominio inválido');
            }

            this.logger.debug(`Subdominio extraído: ${subdominioExtraido}`);
            req['subdominio'] = subdominioExtraido;
        } else {
            // Acceso directo al dominio raíz (deltaerp.com sin subdominio)
            req['subdominio'] = null;
        }

        next();
    }
}
