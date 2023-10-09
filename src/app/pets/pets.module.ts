import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { JwtAuthGuard } from '@app/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PetsRepository } from './pets.repository';
import { Location } from '@utils/location';

@Module({
  controllers: [PetsController],
  providers: [PetsService, JwtAuthGuard, PetsRepository, Location],
  imports: [JwtModule],
})
export class PetsModule {}
