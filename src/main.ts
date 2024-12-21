import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { getWinstonConfig } from './config/logger';
import helmet from 'helmet';
import compression from 'compression';
import { ApiKeyGuard } from './common/guards/api-key.guard';
// Import your config
import { AppConfig } from './config/app.config'; // Ensure this path matches your actual config file location

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(getWinstonConfig()),
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new ApiKeyGuard());
  app.use(helmet());
  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle('SwiftCloud API')
    .setDescription('API for querying Taylor Swift songs data')
    .setVersion('1.0')
    // If you removed JWT and only use API key, you can remove `.addBearerAuth()`
    // unless you plan to reintroduce it or show in swagger UI that you need an API key.
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Use AppConfig for port
  const port = AppConfig.port;
  await app.listen(port);

  app.getHttpAdapter().getInstance().logger.info(`Application running on: http://localhost:${port}`);
  app.getHttpAdapter().getInstance().logger.info(`Swagger docs: http://localhost:${port}/api-docs`);
}
bootstrap();