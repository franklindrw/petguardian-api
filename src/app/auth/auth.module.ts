import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/services/users.service';
import { UsersRepository } from '../users/repositories/users.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, UsersRepository],
  imports: [JwtModule],
})
export class AuthModule {}
