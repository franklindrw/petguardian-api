import { IsNotEmpty, IsEmail, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsDateString()
  birthDate: Date;

  @IsNotEmpty()
  cpf: number;

  @IsNotEmpty()
  phoneNumber1: number;

  @IsNotEmpty()
  phoneNumber2: number;

  @IsNotEmpty()
  password: string;
}
