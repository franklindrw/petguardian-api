import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { JwtAuthGuard } from '@app/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [PetsController],
  providers: [PetsService, JwtAuthGuard],
  imports: [JwtModule],
})
export class PetsModule {}
