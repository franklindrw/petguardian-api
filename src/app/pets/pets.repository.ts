import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dtos/create-pet.dto';
import { PetDto } from './dtos/pet.dto';
import { UpdatePetDto } from './dtos/update-pet.dto';
import { IsCep } from '@decorators/isCep.decorator';
import { IsCategory } from '@decorators/isCategory.decorator';

interface OwnerProps {
  userId: string;
  name: string;
  email: string;
  phoneNumber1: string;
  phoneNumber2: string;
}

export interface PetIdProps {
  id: string;
  name: string;
  qualities: string[];
  category: string;
  age: number;
  breed: string;
  cep: string;
  owner: OwnerProps;
}

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

  async getPetById(petID: string): Promise<PetIdProps> {
    // buscando dados do id do pet
    const petSnapshot = await this.firestore
      .collection('pets')
      .doc(petID)
      .get();
    const petData = petSnapshot.data();

    // buscando dados do id do usuário
    const userSnapshot = await this.firestore
      .collection('users')
      .doc(petData.userId)
      .get();
    const userData = userSnapshot.data();

    // retornando os dados do pet e do usuário
    return {
      id: petSnapshot.id,
      ...petData,
      owner: {
        userId: userSnapshot.id,
        name: userData.name,
        email: userData.email,
        phoneNumber1: userData.phoneNumber1,
        phoneNumber2: userData.phoneNumber2,
      },
    } as PetIdProps;
  }

  async getPetsByUserId(userID: string): Promise<PetDto[]> {
    const petsSnapshot = await this.firestore
      .collection('pets')
      .where('userId', '==', userID)
      .get();
    const pets = [];
    petsSnapshot.forEach((pet) => {
      const petData = pet.data();
      petData.id = pet.id;
      pets.push(petData as PetDto);
    });

    return pets;
  }

  async getPetsByLocation(
    cep: typeof IsCep,
    category?: typeof IsCategory,
  ): Promise<PetDto[]> {
    const pets = [];

    // faz a query inicial do firestore
    const petsRef = this.firestore.collection('pets');
    let query: admin.firestore.Query = petsRef;

    // se houver categoria, adiciona a categoria na query
    if (category) {
      query = query.where('category', '==', category);
    }

    // executa a query no firestore
    const petsSnapshot = await query.get();
    petsSnapshot.forEach((pet) => {
      const petData = pet.data();
      petData.id = pet.id;
      pets.push(petData as PetDto);
    });

    return pets;
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
