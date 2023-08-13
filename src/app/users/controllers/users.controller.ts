import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

interface CreateUserResp {
  message: string;
  user: CreateUserDto;
}

@ApiTags('users') // adicionando a tag users para o swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  async createUser(@Body() postData: CreateUserDto): Promise<CreateUserResp> {
    try {
      const newUser = await this.usersService.createUser(postData);
      return { message: 'Usuário criado com sucesso', user: newUser };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
