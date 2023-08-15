import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './create-user.dto';
import { ValidationError, validate } from 'class-validator';
import { hashPassword } from '../../infra/utils/bcrypt.util';
import { UsersDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    // validando o DTO antes de criar o usuário
    const errors: ValidationError[] = await validate(createUserDto);

    // se houverem erros, retorna um array com os erros
    if (errors.length > 0) {
      const errorMessage = errors
        .map((error) => Object.values(error.constraints).join('; '))
        .join('; ');
      throw new HttpException(errorMessage, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // valida se o email já está cadastrado
    const user = await this.usersRepository.findByEmail(createUserDto.email);
    if (user) {
      throw new HttpException(
        'Já existe um usuário cadastrado com esse email',
        HttpStatus.CONFLICT,
      );
    }

    // convertendo a data de nascimento para o formato do Firestore
    const birthDate = new Date(createUserDto.birthDate);

    // adicionando mais 3 horas para compensar o fuso horário
    birthDate.setHours(birthDate.getHours() + 3);
    createUserDto.birthDate = birthDate;

    // criptografando a senha do usuário
    createUserDto.password = await hashPassword(createUserDto.password);

    // se não houverem erros, cria o usuário
    return this.usersRepository.createUser(createUserDto);
  }

  // retorna um usuário pelo id
  async findByEmail(email: string): Promise<CreateUserDto> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // retorna todos os usuários cadastrados
  async getAllUsers(): Promise<UsersDto[]> {
    const users = await this.usersRepository.getAllUsers();
    if (!users) {
      throw new HttpException(
        'Nenhum usuário encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
    return users;
  }

  // retorna o usuário pelo id
  async getUserById(id: string): Promise<UsersDto> {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
