import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { ValidationError, validate } from 'class-validator';

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

    // se não houverem erros, cria o usuário
    return this.usersRepository.createUser(createUserDto);
  }
}
