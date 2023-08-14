import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { JwtAuthGuard } from '../auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, JwtAuthGuard],
  imports: [JwtModule],
})
export class UsersModule {}
