import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { IsCep } from '@decorators/isCep.decorator';
import { IsCategory } from '@decorators/isCategory.decorator';
import { IsQualities } from '@decorators/isQualities.decorator';
import { IsAnimalSize } from '@decorators/isAnimalSize.decorator';

export class UpdatePetDto {
  /**
   * Nome do Pet
   * @example "Rex"
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * Idade do Pet
   * @example 2
   */
  @IsOptional()
  @IsNumber()
  age?: number;

  /**
   * Raça do Pet
   * @example "Poodle"
   */
  @IsOptional()
  @IsString()
  breed?: string;

  /**
   * Categoria do pet. Deve ser uma das seguintes opções: cão, gato, roedor, ave, outro
   * @example "cão"
   * @example "gato"
   * @example "roedor"
   * @example "ave"
   * @example "outro"
   */
  @IsOptional()
  @IsCategory({
    message: 'Category must be one of: cão, gato, roedor, ave, outro',
  })
  category?: string;

  /**
   * Qualidades do pet. Deve ser um array de uma ou mais das seguintes opções: Calmo, Ativo, Carinhoso, Educado, Brincalhão, Esperto
   * @example ["Calmo", "Ativo"]
   */
  @IsOptional()
  @IsArray()
  @IsQualities({
    message:
      'Qualities must be an array of one or more of the following values: Calmo, Ativo, Carinhoso, Educado, Brincalhão, Esperto',
  })
  qualities?: string[];

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
  @IsOptional()
  @IsString()
  @IsCep({ message: 'CEP must be in the format 00000-000' })
  cep?: string;
}
