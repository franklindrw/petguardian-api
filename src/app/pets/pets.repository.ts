import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dtos/create-pet.dto';
import { PetDto } from './dtos/pet.dto';
import { UpdatePetDto } from './dtos/update-pet.dto';

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
      petData.id = pet.id;
      pets.push(petData as PetDto);
    });

    return pets;
  }

  async getPetById(petID: string): Promise<PetDto> {
    const petSnapshot = await this.firestore
      .collection('pets')
      .doc(petID)
      .get();
    const petData = petSnapshot.data();
    petData.id = petSnapshot.id;
    return petData as PetDto;
  }

  async createPet(createPetDto: CreatePetDto): Promise<CreatePetDto> {
    const newPetRef = await this.firestore.collection('pets').add(createPetDto);
    const newPet = await newPetRef.get();
    return { ...newPet.data() } as CreatePetDto;
  }

  async updatePet(petID: string, updatePetDto: UpdatePetDto): Promise<any> {
    const petData = { ...updatePetDto };

    // remove os campos vazios
    Object.keys(petData).forEach(
      (key) => petData[key] == null && delete petData[key],
    );

    const petRef = this.firestore.collection('pets').doc(petID);
    await petRef.update(petData);
  }

  async deletePet(petID: string): Promise<any> {
    const petRef = this.firestore.collection('pets').doc(petID);
    await petRef.delete();
  }
}
