import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from '../pets.controller';
import { PetsService } from '../pets.service';

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

  // testa o método createPet
  it('should create a pet', async () => {
    const newPetData = {
      name: 'Rex',
      age: 10,
      breed: 'Poodle',
    };
    const response = await controller.createPet(newPetData);

    expect(response).toBeDefined();
    expect(response).toEqual({ message: 'Pet criado com sucesso' });
  });
});
