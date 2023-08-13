import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { initializeFirebase } from './infra/database/firebase.config';
import { UsersModule } from './app/users/users.module';

async function bootstrap() {
  dotenv.config();
  initializeFirebase();
  const app = await NestFactory.create(UsersModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
