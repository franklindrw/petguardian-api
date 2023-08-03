import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class GetUsers {
  async execute(): Promise<any> {
    const usersSnapshot = await admin.firestore().collection('users').get();
    const users = [];
    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      users.push(user);
    });

    return users;
  }
}
