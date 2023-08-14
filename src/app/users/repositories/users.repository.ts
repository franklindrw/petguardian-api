import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
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
}
