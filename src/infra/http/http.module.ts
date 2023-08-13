import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { GetUsers } from 'src/app/use-cases/get-users';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [GetUsers],
})
export class HttpModule {}
