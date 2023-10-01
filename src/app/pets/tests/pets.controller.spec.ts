import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from '@app/pets/pets.controller';
import { PetsService } from '@app/pets/pets.service';
import { CreatePetDto } from '@app/pets/dtos/create-pet.dto';

describe('PetsController', () => {
  let controller: PetsController;

  // cria a instância do controller antes de cada teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetsController],
      providers: [PetsService],
    }).compile();

    controller = module.get<PetsController>(PetsController);
  });

  // testa se o controller foi instanciado
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // testa o método createPet com dados válidos
  it('should create a pet', async () => {
    const newPetData: CreatePetDto = {
      name: 'Frank',
      age: 2,
      breed: 'Buldogue',
      category: 'cão',
      qualities: ['Calmo', 'Brincalhão'],
      cep: '12345-678',
      userId: 'yh3y4r79q2ty-7r8yhq1',
    };
    const response = await controller.createPet(newPetData);

    expect(response).toBeDefined();
    expect(response).toEqual({
      message: 'Pet criado com sucesso',
      data: newPetData,
    });
  });
});
