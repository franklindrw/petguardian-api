import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dtos/create-pet.dto';
import { PetDto } from './dtos/pet.dto';

@Injectable()
export class PetsRepository {
  private readonly firestore: admin.firestore.Firestore;

  constructor() {
    this.firestore = admin.firestore();
  }

  async getAllPets(): Promise<PetDto[]> {
    const petsSnapshot = await this.firestore.collection('pets').get();
    const pets = [];
    petsSnapshot.forEach((pet) => {
      const petData = pet.data();
      pets.push({
        id: pet.id,
        name: petData.name,
        age: petData.age,
        breed: petData.breed,
        category: petData.category,
        qualities: petData.qualities,
        animalSize: petData.animalSize,
        description: petData.description,
        photoUrl: petData.photoUrl,
        cep: petData.cep,
        userId: petData.userId,
      } as PetDto);
    });

    return pets;
  }

  async createPet(createPetDto: CreatePetDto): Promise<CreatePetDto> {
    const newPetRef = await this.firestore.collection('pets').add(createPetDto);
    const newPet = await newPetRef.get();
    return { ...newPet.data() } as CreatePetDto;
  }
}
