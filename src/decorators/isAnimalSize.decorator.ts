import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsAnimalSize(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isAnimalSize',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const validSizes = ['Pequeno', 'Médio', 'Grande'];
          return typeof value === 'string' && validSizes.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} size must be one of: Pequeno, Médio, Grande`;
        },
      },
    });
  };
}
