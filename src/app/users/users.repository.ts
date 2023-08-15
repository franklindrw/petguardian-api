import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersDto } from './users.dto';
// import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  private readonly firestore: admin.firestore.Firestore;

  constructor() {
    this.firestore = admin.firestore();
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const newUserRef = await this.firestore
      .collection('users')
      .add(createUserDto);
    const newUser = await newUserRef.get();
    return { ...newUser.data() } as CreateUserDto;
  }

  async findByEmail(email: string): Promise<CreateUserDto> {
    const userSnapshot = this.firestore
      .collection('users')
      .where('email', '==', email);
    const user = await userSnapshot.get();
    if (user.empty) {
      return null;
    }

    const userData = user.docs[0].data() as CreateUserDto;
    const userId = user.docs[0].id;
    return { userId: userId, ...userData } as CreateUserDto;
  }

  async getAllUsers(): Promise<UsersDto[]> {
    const usersSnapshot = await this.firestore.collection('users').get();
    const users = [];
    usersSnapshot.forEach((user) => {
      const userData = user.data();
      users.push({
        userId: user.id,
        name: userData.name,
        email: userData.email,
        cpf: userData.cpf,
        birthDate: new Date(userData.birthDate._seconds * 1000),
        phoneNumber1: userData.phoneNumber1,
        phoneNumber2: userData.phoneNumber2,
      } as UsersDto);
    });
    return users;
  }

  async getUserById(userId: string): Promise<UsersDto> {
    const userSnapshot = await this.firestore
      .collection('users')
      .doc(userId)
      .get();
    const userData = userSnapshot.data();
    return {
      userId: userSnapshot.id,
      name: userData.name,
      email: userData.email,
      cpf: userData.cpf,
      birthDate: new Date(userData.birthDate._seconds * 1000),
      phoneNumber1: userData.phoneNumber1,
      phoneNumber2: userData.phoneNumber2,
    } as UsersDto;
  }
}
