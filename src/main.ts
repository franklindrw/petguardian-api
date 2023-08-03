import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { initializeFirebase } from './infra/database/firebase.config';
import { HttpModule } from './infra/http/http.module';

async function bootstrap() {
  dotenv.config();
  initializeFirebase();
  const app = await NestFactory.create(HttpModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
