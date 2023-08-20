import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersDto } from './users.dto';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/app/auth/auth.guard';
import { UpdateUserDto } from './update-user.dto';

interface CreateUserResp {
  message: string;
}

@ApiTags('users') // adicionando a tag users para o swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
  })
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
  @ApiResponse({
    status: 200,
    description: 'lista de usuários',
    type: [UsersDto],
  })
  @ApiResponse({ status: 403, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 404, description: 'Não há usuários cadastrados' })
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'email', required: false })
  async getUsers(
    @Query('userId') userId?: string,
    @Query('email') email?: string,
  ): Promise<UsersDto[]> {
    try {
      if (userId) {
        // se o userId for passado como query param, retorna apenas o usuário com o id passado
        const user = await this.usersService.getUserById(userId);
        return [user];
      }
      if (email) {
        // se o email for passado como query param, retorna apenas o usuário com o email passado
        const user = await this.usersService.getUserByEmail(email);
        return [user];
      }
      // se não, retorna todos os usuários
      const users = await this.usersService.getAllUsers();
      return users;
    } catch (error) {
      if (error.status === 403) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      }
      if (error.status === 404) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserData: UpdateUserDto,
  ): Promise<string> {
    try {
      await this.usersService.updateUser(id, updateUserData);
      return 'Usuário atualizado com sucesso';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
