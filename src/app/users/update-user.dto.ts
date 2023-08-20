import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumberString,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  /**
   * Nome do usuário
   * @example "João da Silva"
   */
  @IsString()
  @ApiProperty({ required: false })
  name?: string;

  /**
   * Data de nascimento do usuário
   * @example 1990-01-01
   */
  @IsDateString()
  @ApiProperty({ required: false })
  birthDate?: Date;

  /**
   * CPF do usuário
   * @example 12345678900
   */
  @IsNumberString()
  @ApiProperty({ required: false })
  cpf?: string;

  /**
   * Telefone 1 do usuário
   * @example 11912345678
   */
  @IsNumberString()
  @ApiProperty({ required: false })
  @ValidateIf((o) => o.phoneNumber1 !== undefined)
  phoneNumber1?: string;

  /**
   * Telefone 2 do usuário
   * @example 11912345678
   */
  @IsNumberString()
  @ApiProperty({ required: false })
  @ValidateIf((o) => o.phoneNumber2 !== undefined)
  phoneNumber2?: string;

  /**
   * Senha do usuário
   */
  @IsString()
  @ApiProperty({ required: false })
  @ValidateIf((o) => o.password !== undefined)
  password?: string;
}
