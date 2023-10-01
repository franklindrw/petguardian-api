import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCep', async: false })
export class IsCepConstraint implements ValidatorConstraintInterface {
  validate(cep: string) {
    const cepRegex = /^\d{5}-\d{3}$/;
    return cepRegex.test(cep);
  }
  defaultMessage(args?: ValidationArguments): string {
    return `${args.property} CEP must be in the format 00000-000`;
  }
}

export function IsCep(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isCep',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsCepConstraint,
    });
  };
}
