import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePetDto } from './dtos/create-pet.dto';
import { ValidationError, validate } from 'class-validator';
import { PetIdProps, PetsRepository } from './pets.repository';
import { UpdatePetDto } from './dtos/update-pet.dto';
import { IsCep } from '@/decorators/isCep.decorator';
import { IsCategory } from '../../decorators/isCategory.decorator';

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

  async getPetById(petID: string): Promise<PetIdProps> {
    const pet = await this.petsRepository.getPetById(petID);
    if (!pet) {
      throw new HttpException('Pet não encontrado', HttpStatus.NOT_FOUND);
    }
    return pet;
  }

  async getPetsByUserId(userID: string): Promise<any> {
    const pets = await this.petsRepository.getPetsByUserId(userID);
    if (!pets) {
      throw new HttpException('Não há pets cadastrados', HttpStatus.NOT_FOUND);
    }
    return pets;
  }

  async getPetsByLocation(
    cep: typeof IsCep,
    category?: typeof IsCategory,
  ): Promise<any> {
    const pets = await this.petsRepository.getPetsByLocation(cep, category);
    if (!pets || pets.length === 0) {
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

  async updatePet(petID: string, updatePetDto: UpdatePetDto): Promise<any> {
    // verifica se o pet existe
    const pet = await this.petsRepository.getPetById(petID);

    if (!pet) {
      throw new Error('Pet não encontrado');
    }

    // valida o DTO antes de atualizar o pet
    const errors: ValidationError[] = await validate(updatePetDto);

    // se houverem erros, retorna um array com os erros
    if (errors.length > 0) {
      const errorMEssage = errors
        .map((error) => Object.values(error.constraints))
        .join(', ');
      throw new HttpException(errorMEssage, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // atualiza o pet
    return this.petsRepository.updatePet(petID, updatePetDto);
  }

  async deletePet(petID: string): Promise<string> {
    // verifica se o pet existe
    const pet = await this.petsRepository.getPetById(petID);

    if (!pet) {
      throw new Error('Pet não encontrado');
    }

    // deleta o pet
    await this.petsRepository.deletePet(petID);
    return 'Pet deletado com sucesso';
  }
}
