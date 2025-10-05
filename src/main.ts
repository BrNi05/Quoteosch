import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

// API Docs
import { setupSwagger } from './utils/swagger';
import { join } from 'path';

// Security
import helmet from 'helmet';
import hpp from 'hpp';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Async error handling
  process.on('unhandledRejection', (error: Error) => {
    const logger = new Logger('ASYNC ERROR');
    logger.error(error?.message);
  });

  // Protection against DoS attacks (via resource exhaustion)
  app.use(json({ limit: '1kb' }));
  app.use(urlencoded({ extended: true, limit: '1kb' }));

  // CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // HTTPS(S) headers configuration
  app.use(hpp());
  app.use(
    helmet({
      hidePoweredBy: true,
      noSniff: true,
    })
  );

  // Disable caching
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Trust proxy (last one)
  // Mostly redundant with Cloudflare Tunnels
  app.set('trust proxy', 1);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Server static assets (for swagger-ui customizations)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Generate API docs
  setupSwagger(app);

  // Start app, bind to the given port
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error during app bootstrap:', err);
  process.exit(1);
});
