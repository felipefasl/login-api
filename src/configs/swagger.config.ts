import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function configSwagger(app: INestApplication) {

  const options = new DocumentBuilder()
    .setTitle('Login API')
    .setDescription('Backend em NestJs v7 sistema genérico de login')
    .setContact("Felipe Lima", "", "felipefasl@gmail.com")
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

}