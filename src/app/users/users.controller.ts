import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Request,
  Post,
  Put,
  Query,
  UseGuards,
  Delete,
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
import { AuthService } from '../auth/auth.service';

interface messageResp {
  message: string;
}

@ApiTags('users') // adicionando a tag users para o swagger
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
  })
  async createUser(@Body() postData: CreateUserDto): Promise<messageResp> {
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
  @ApiResponse({ status: 403, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 404, description: 'Não há usuários cadastrados' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserData: UpdateUserDto,
    @Request() req: any,
  ): Promise<messageResp> {
    // captura o token de autorização
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.decodeToken(token);

    // verifica se o id do usuário logado é igual ao id do usuário que está sendo atualizado
    if (decodedToken.userId !== id) {
      throw new HttpException(
        'Você não tem permissão para atualizar este usuário',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      await this.usersService.updateUser(id, updateUserData);
      return { message: 'Usuário atualizado com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 403, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 404, description: 'Não há usuários cadastrados' })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso',
  })
  async deleteUser(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<messageResp> {
    // captura o token de autorização
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.decodeToken(token);

    // verifica se o id do usuário logado é igual ao id do usuário que está sendo atualizado
    if (decodedToken.userId !== id) {
      throw new HttpException(
        'Você não tem permissão para deletar este usuário',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      await this.usersService.deleteUser(id);
      return { message: 'Usuário deletado com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
