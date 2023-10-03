import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePetDto } from './dtos/create-pet.dto';
import { ValidationError, validate } from 'class-validator';
import { PetsRepository } from './pets.repository';

@Injectable()
export class PetsService {
  constructor(private readonly petsRepository: PetsRepository) {}

  async getAllPets(): Promise<any> {
    const pets = await this.petsRepository.getAllPets();
    if (!pets) {
      throw new HttpException('Não há pets cadastrados', HttpStatus.NOT_FOUND);
    }
    return pets;
  }

  async createPet(createPetDto: CreatePetDto): Promise<any> {
    // valida o DTO antes de criar o pet
    const errors: ValidationError[] = await validate(createPetDto);

    // se houverem erros, retorna um array com os erros
    if (errors.length > 0) {
      const errorMEssage = errors
        .map((error) => Object.values(error.constraints))
        .join(', ');
      throw new HttpException(errorMEssage, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // cria o pet
    return this.petsRepository.createPet(createPetDto);
  }
}
