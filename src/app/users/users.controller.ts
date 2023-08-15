import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/app/auth/auth.guard';

interface CreateUserResp {
  message: string;
}

@ApiTags('users') // adicionando a tag users para o swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  async createUser(@Body() postData: CreateUserDto): Promise<CreateUserResp> {
    try {
      await this.usersService.createUser(postData);
      return { message: 'Usuário criado com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'lista de usuários' })
  @ApiResponse({ status: 403, description: 'Usuário não autenticado' })
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<any> {
    return 'Hello World!';
  }
}
