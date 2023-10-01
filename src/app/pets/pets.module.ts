import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { JwtAuthGuard } from '@app/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PetsRepository } from './pets.repository';

@Module({
  controllers: [PetsController],
  providers: [PetsService, JwtAuthGuard, PetsRepository],
  imports: [JwtModule],
})
export class PetsModule {}
