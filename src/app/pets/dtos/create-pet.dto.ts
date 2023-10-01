import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsCategory } from '@decorators/isCategory.decorator';
import { IsQualities } from '@decorators/isQualities.decorator';
import { IsAnimalSize } from '@decorators/isAnimalSize.decorator';
import { IsCep } from '@decorators/isCep.decorator';

export class CreatePetDto {
  /**
   * Nome do pet
   * @example "Bisteco"
   */
  @IsString()
  name: string;

  /**
   * Idade do pet
   * @example 2
   */
  @IsNumber()
  age: number;

  /**
   * Raça do pet
   * @example "Poodle"
   */
  @IsString()
  breed: string;

  /**
   * Categoria do pet. Deve ser uma das seguintes opções: cão, gato, roedor, ave, outro
   * @example "cão"
   * @example "gato"
   * @example "roedor"
   * @example "ave"
   * @example "outro"
   */
  @IsCategory({
    message: 'Category must be one of: cão, gato, roedor, ave, outro',
  })
  category: string;

  /**
   * Qualidades do pet. Deve ser um array de uma ou mais das seguintes opções: Calmo, Ativo, Carinhoso, Educado, Brincalhão, Esperto
   * @example ["Calmo", "Ativo"]
   */
  @IsArray()
  @IsQualities({
    message:
      'Qualities must be an array of one or more of the following values: Calmo, Ativo, Carinhoso, Educado, Brincalhão, Esperto',
  })
  qualities: string[];

  /**
   * Tamanho do pet. Deve ser uma das seguintes opções: Pequeno, Médio, Grande
   * @example "Pequeno"
   * @example "Médio"
   * @example "Grande"
   */
  @IsOptional()
  @IsAnimalSize({
    message: 'Size must be one of: Pequeno, Médio, Grande',
  })
  animalSize?: string;

  /**
   * Descrição do pet
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Urls das fotos do pet
   * @example "https://urldaimagem/pet.jpg"
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'PhotoUrl must be an array of strings' })
  photoUrl?: string[];

  /**
   * CEP do local onde o pet se encontra
   * @example "00000-000"
   */
  @IsString()
  @IsCep({ message: 'CEP must be in the format 00000-000' })
  cep: string;

  /**
   * Id do usuário que está cadastrando o pet
   */
  @IsString()
  userId: string;
}
