import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { LoggerMiddleware } from './logger.middleware';
import * as responseTime from 'response-time';
import { StorageModule } from './storage/storage.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PetsModule,
    StorageModule,
    MulterModule.register({ dest: '../temp' }), // armaena os arquivos temporariamente
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Aplica o LoggerMiddleware globalmente
    consumer.apply(responseTime()).forRoutes('*'); // Aplica o response-time após o LoggerMiddleware
  }
}
