import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { OpenAPIObject } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication<unknown>): OpenAPIObject {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Quoteosch API')
    .setDescription('Quoteosch API Docs')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'API Key',
      },
      'access-token'
    )
    .build();

  const swaggerFactory = SwaggerModule.createDocument(app, swaggerConfig, {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
  });

  // Every POST, PUT and DELETE endpoint requires authentication
  for (const [_pathKey, path] of Object.entries(swaggerFactory.paths)) {
    for (const [method, methodDoc] of Object.entries(path)) {
      if (!['POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) continue;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      methodDoc.security = [{ 'access-token': [] }];
    }
  }

  // API docs at root
  SwaggerModule.setup('', app, swaggerFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      showRequestDuration: true,
      deepLinking: true,
    },
  });

  return swaggerFactory;
}
