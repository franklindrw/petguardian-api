import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { JwtAuthGuard } from '../auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [StorageController],
  providers: [StorageService, JwtAuthGuard],
  imports: [JwtModule],
})
export class StorageModule {}
