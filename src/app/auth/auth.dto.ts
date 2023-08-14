import { IsString } from 'class-validator';

export class AuthDto {
  /**
   * E-mail do usuário
   * @example example@email.com
   */
  @IsString()
  email: string;

  /**
   * Senha do usuário
   */
  @IsString()
  password: string;
}
