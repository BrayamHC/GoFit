// src/config/throttler.config.ts

import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { seconds } from '@nestjs/throttler';

/**
 * Configuración de Rate Limiting para la API
 * 
 * Estrategia: Global con excepciones selectivas
 * - Protección automática en todos los endpoints
 * - Límites personalizados solo en endpoints críticos
 * 
 * @see https://docs.nestjs.com/security/rate-limiting
 */
export const throttlerConfig: ThrottlerModuleOptions = {
    throttlers: [
        {
            /**
             * Límite global para toda la API
             * - 30 requests por minuto por IP/usuario
             * - Suficiente para uso normal sin afectar UX
             * - Protege contra ataques básicos de fuerza bruta
             */
            name: 'default',
            ttl: seconds(60),       // Ventana de tiempo: 60 segundos
            limit: 30,              // Máximo 30 requests en esa ventana
        },
    ],

    /**
     * Desactivar rate limiting en desarrollo
     * Facilita testing local sin bloqueos
     */
    skipIf: () => process.env.NODE_ENV === 'development',

    /**
     * Ignorar bots legítimos de motores de búsqueda
     * Evita bloquear indexación SEO
     */
    ignoreUserAgents: [
        /googlebot/gi,
        /bingbot/gi,
        /slackbot/gi,
        /facebookexternalhit/gi,
    ],

    /**
     * Mensaje de error personalizado (opcional)
     * Si no se define, NestJS usa mensaje por defecto
     */
    errorMessage: 'Demasiadas solicitudes. Por favor, intente más tarde.',
};
