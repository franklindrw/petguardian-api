import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dtos/create-pet.dto';

@ApiTags('pets') // adicionando a tag pets para o swagger
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @ApiBearerAuth() // adicionando a autenticação por token no swagger
  @UseGuards(JwtAuthGuard) // adicionando o validador de token
  @ApiBody({ type: CreatePetDto }) // adicionando o tipo do body no swagger
  @ApiResponse({
    status: 201,
    description: 'Pet criado com sucesso',
  })
  @ApiResponse({ status: 403, description: 'Usuário não autenticado' })
  async createPet(@Body() newPetData: CreatePetDto): Promise<any> {
    return { message: 'Pet criado com sucesso', data: newPetData };
  }
}
