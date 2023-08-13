import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { ValidationError, validate } from 'class-validator';
import { hashPassword } from 'src/infra/utils/bcrypt.util';

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
}
