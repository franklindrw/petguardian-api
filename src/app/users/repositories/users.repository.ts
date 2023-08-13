import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

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
}
