import { IsDate, IsEmail, IsNumberString, IsString } from 'class-validator';

export class UsersDto {
  /**
   * Id do usuário
   */
  @IsString()
  userId: string;

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
   * CPF do usuário
   * @example 12345678900
   */
  @IsNumberString()
  cpf: string;

  /**
   * Data de nascimento do usuário
   * @example 1990-01-01
   */
  @IsDate()
  birthDate: Date;

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
}
