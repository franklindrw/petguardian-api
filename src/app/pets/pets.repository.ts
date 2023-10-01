import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dtos/create-pet.dto';

@Injectable()
export class PetsRepository {
  private readonly firestore: admin.firestore.Firestore;

  constructor() {
    this.firestore = admin.firestore();
  }

  async createPet(createPetDto: CreatePetDto): Promise<CreatePetDto> {
    const newPetRef = await this.firestore.collection('pets').add(createPetDto);
    const newPet = await newPetRef.get();
    return { ...newPet.data() } as CreatePetDto;
  }
}
