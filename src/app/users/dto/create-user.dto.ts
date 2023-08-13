import {
  IsEmail,
  IsDateString,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  /**
   * Nome do usuário
   * @example "João da Silva"
   */
  @IsString()
  name: string;

  /**
   * E-mail do usuário
   * @example example@email.com
   */
  @IsEmail()
  email: string;

  /**
   * Data de nascimento do usuário
   * @example 1990-01-01
   */
  @IsDateString()
  birthDate: Date;

  /**
   * CPF do usuário
   * @example 12345678900
   */
  @IsNumberString()
  cpf: string;

  /**
   * Telefone 1 do usuário
   * @example 11912345678
   */
  @IsNumberString()
  phoneNumber1: string;

  /**
   * Telefone 2 do usuário
   * @example 11912345678
   */
  @IsNumberString()
  phoneNumber2: string;

  /**
   * Senha do usuário
   */
  @IsString()
  password: string;
}
