import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { corsConfig } from './configs/cors.config';
import { loggerConfig } from './configs/logger.config';
import { configSwagger } from './configs/swagger.config';

export const logger = WinstonModule.createLogger(loggerConfig);

async function bootstrap() {

  const app = await NestFactory
  .create(AppModule, {logger});
  app.enableCors(corsConfig)
  configSwagger(app);
  const port = 3000;
  await app.listen(process.env.PORT || port);
  logger.log('--------------------------------------------------------');
  logger.log(`Swagger executando em: http://localhost:${port}/api-docs`);
  logger.log(`--------------------------------------------------------`);
}
bootstrap();
