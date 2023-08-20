import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePasswords } from '../../infra/utils/bcrypt.util';
import * as jwt from 'jsonwebtoken';

interface validateUserProps {
  email: string;
  password: string;
}

interface userDataProps {
  name: string;
  email: string;
  cpf: string;
  userId: string;
}

export interface authResponseProps {
  message: string;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private async createToken(user: userDataProps): Promise<string> {
    const PRIVATE_KEY = process.env.JWT_SECRET;
    return jwt.sign(user, PRIVATE_KEY, { expiresIn: '4h' });
  }

  async validateUser({
    email,
    password,
  }: validateUserProps): Promise<authResponseProps> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    if (user && (await comparePasswords(password, user.password)) === true) {
      const token = await this.createToken({
        cpf: user.cpf,
        email: user.email,
        name: user.name,
        userId: user.userId,
      });
      return { message: 'Login efetuado com sucesso', token: token };
    }

    throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
  }

  async decodeToken(token: string): Promise<userDataProps> {
    const PRIVATE_KEY = process.env.JWT_SECRET;
    return jwt.verify(token, PRIVATE_KEY) as userDataProps;
  }
}
