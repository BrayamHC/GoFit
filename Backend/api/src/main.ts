// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/config/logger.config';
import { Request, Response, NextFunction } from 'express';


async function bootstrap() {
  // Crear app con Winston logger
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const port = process.env.PORT ?? 3000;
  const host = process.env.HOST ?? '0.0.0.0';

  app.use((req: Request, res: Response, next: NextFunction) => {
    // Intentar obtener la IP real del cliente
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const origin = req.headers.origin;

    console.log(`[Network] IP: ${ip} | Origen: ${origin || 'N/A (Postman/Directo)'} | ${req.method} ${req.url}`);

    next();
  });

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Registrar ExceptionFilter global
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port, host);

  console.log(`API corriendo en http://${host}:${port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Logs guardandose en: logs/delta_erp_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.log`);
}
bootstrap();
