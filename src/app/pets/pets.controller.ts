import {
  Controller,
  UseGuards,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/auth/auth.guard';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dtos/create-pet.dto';
import { PetDto } from './dtos/pet.dto';

@ApiTags('pets') // adicionando a tag pets para o swagger
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  @ApiBearerAuth() // adicionando a autenticação por token no swagger
  @UseGuards(JwtAuthGuard) // adicionando o validador de token
  @ApiResponse({
    status: 200,
    description: 'lista de pets',
    type: [PetDto],
  })
  @ApiResponse({ status: 403, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 404, description: 'Não há usuários cadastrados' })
  async getPets(): Promise<PetDto[]> {
    try {
      const pets = await this.petsService.getAllPets();
      return pets;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

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
    try {
      await this.petsService.createPet(newPetData);
      return { message: 'Pet criado com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
