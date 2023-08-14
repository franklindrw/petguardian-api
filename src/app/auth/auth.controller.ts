import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';
import { AuthService, authResponseProps } from './auth.service';

@ApiTags('Auth') // adicionando a tag users para o swagger
@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Login efetuado com sucesso' })
  async login(@Body() postData: AuthDto): Promise<authResponseProps> {
    try {
      const resp = await this.authService.validateUser(postData);
      return resp;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }
}
