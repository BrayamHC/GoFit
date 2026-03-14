import * as winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');

const logFormat = winston.format.printf(({ timestamp, level, message, context, trace }) => {
    return `${timestamp} [${level.toUpperCase()}] [${context || 'Application'}] ${message}${trace ? `\n${trace}` : ''}`;
});

export const winstonConfig = {
    transports: [
        // Console (desarrollo)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                logFormat,
            ),
        }),

        // Archivo de logs generales (rotacion diaria)
        new DailyRotateFile({
            filename: 'logs/delta_erp_%DATE%.log',
            datePattern: 'DDMMYYYY',
            maxSize: '20m',
            maxFiles: '30d',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.uncolorize(),
                logFormat,
            ),
        }),

        // Archivo SOLO de errores (rotacion diaria)
        new DailyRotateFile({
            filename: 'logs/errors/delta_erp_error_%DATE%.log',
            datePattern: 'DDMMYYYY',
            level: 'error',
            maxSize: '20m',
            maxFiles: '30d',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.uncolorize(),
                logFormat,
            ),
        }),
    ],
};
