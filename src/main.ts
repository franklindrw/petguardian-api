import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { initializeFirebase } from './infra/database/firebase.config';
import { UsersModule } from './app/users/users.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  initializeFirebase();
  const app = await NestFactory.create(UsersModule);

  // adicionando as configurações do swagger
  const config = new DocumentBuilder()
    .setTitle('Pet Guardian API')
    .setDescription(
      'API para o projeto Pet Guardian, apresentado como trabalho de conclusão de curso Sistema de Informação - ENIAC 2023',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe()); // adicionando o pipe de validação globalmente
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
