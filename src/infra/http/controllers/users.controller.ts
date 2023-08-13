import { Controller, Get, Post } from '@nestjs/common';
import { GetUsers } from 'src/app/use-cases/get-users';

@Controller('users')
export class UsersController {
  constructor(private getUsers: GetUsers) {}

  @Get()
  async getFromUsers(): Promise<any> {
    const users = await this.getUsers.execute();
    return { users: users };
  }
}
