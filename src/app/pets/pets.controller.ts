import {
  Controller,
  UseGuards,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/auth/auth.guard';
import { PetsService } from './pets.service';
import { PetDto } from './dtos/pet.dto';
import { CreatePetDto } from './dtos/create-pet.dto';
import { UpdatePetDto } from './dtos/update-pet.dto';

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
  @ApiQuery({ name: 'petID', required: false })
  @ApiQuery({ name: 'userID', required: false })
  async getPets(
    @Query('petID') petID?: string,
    @Query('userID') userID?: string,
  ): Promise<any> {
    try {
      if (petID) {
        const pet = await this.petsService.getPetById(petID);
        return [pet];
      }
      if (userID) {
        const pets = await this.petsService.getPetsByUserId(userID);
        return pets;
      }
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

  @Put(':petID')
  @ApiBearerAuth() // adicionando a autenticação por token no swagger
  @UseGuards(JwtAuthGuard) // adicionando o validador de token
  @ApiParam({ name: 'petID', type: 'string' }) // adicionando o tipo do body no swagger
  @ApiBody({ type: UpdatePetDto }) // adicionando o tipo do body no swagger
  @ApiResponse({
    status: 200,
    description: 'Pet atualizado com sucesso',
  })
  @ApiResponse({ status: 403, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 404, description: 'Pet não encontrado' })
  async updatePet(
    @Param('petID') petID: string,
    @Body() updatePetData: UpdatePetDto,
  ): Promise<any> {
    try {
      await this.petsService.updatePet(petID, updatePetData);
      return { message: `Pet ${petID} atualizado com sucesso` };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':petID')
  @ApiBearerAuth() // adicionando a autenticação por token no swagger
  @UseGuards(JwtAuthGuard) // adicionando o validador de token
  @ApiParam({ name: 'petID', type: 'string' }) // adicionando o tipo do body no swagger
  @ApiResponse({
    status: 200,
    description: 'Pet deletado com sucesso',
  })
  @ApiResponse({ status: 403, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 404, description: 'Pet não encontrado' })
  async deletePet(@Param('petID') petID: string): Promise<any> {
    try {
      await this.petsService.deletePet(petID);
      return { message: `Pet ${petID} deletado com sucesso` };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
