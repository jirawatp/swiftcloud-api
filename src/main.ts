import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { AppConfig } from './config/app.config'; // Ensure this path matches your actual config file location
import { Logger, ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const apiKeyGuard = app.get(ApiKeyGuard);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalGuards(apiKeyGuard);
  app.use(helmet());
  app.use(compression());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SwiftCloud API')
    .setDescription('API for querying Taylor Swift songs data')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'api-key',
    )
    .build();


  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  // Use AppConfig for port
  const port = AppConfig.port;
  await app.listen(port);

  const logger = new Logger('swiftcloud-api');

  logger.log(`Application running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`Swagger docs: http://localhost:${port}/api-docs`, 'Bootstrap');
}
bootstrap();