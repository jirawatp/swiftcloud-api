import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { getWinstonConfig } from './config/logger';

import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(getWinstonConfig()),
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle('SwiftCloud API')
    .setDescription('API for querying Taylor Swift songs data')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  app.getHttpAdapter().getInstance().logger.info(`Application running on: http://localhost:${port}`);
  app.getHttpAdapter().getInstance().logger.info(`Swagger docs: http://localhost:${port}/api-docs`);
}
bootstrap();