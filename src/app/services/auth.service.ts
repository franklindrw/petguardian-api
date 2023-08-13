import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // criar uma hash de senha para armazenar no banco de dados
  async hashPassword(password: string): Promise<string> {
    const saultRounds = 10;
    return bcrypt.hash(password, saultRounds);
  }

  // compara a senha fornecida com a hash armazenada no banco de dados
  async comparePasswords(
    plainTextPassword: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hash);
  }
}
