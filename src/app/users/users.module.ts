import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { JwtAuthGuard } from '@app/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@app/auth/auth.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, JwtAuthGuard, AuthService],
  imports: [JwtModule],
})
export class UsersModule {}
