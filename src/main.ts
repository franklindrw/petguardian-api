import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { initializeFirebase } from './infra/database/firebase.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';

async function bootstrap() {
  dotenv.config();
  initializeFirebase();
  const app = await NestFactory.create(AppModule);

  // adicionando as configurações do swagger
  const config = new DocumentBuilder()
    .setTitle('Pet Guardian API')
    .setDescription(
      'API para o projeto Pet Guardian, apresentado como trabalho de conclusão de curso Sistema de Informação - ENIAC 2023',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document);

  app.useGlobalPipes(new ValidationPipe()); // adicionando o pipe de validação globalmente
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
