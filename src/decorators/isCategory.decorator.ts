import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsCategory(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isCategory',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const categories = ['cão', 'gato', 'roedor', 'ave', 'outro'];
          return typeof value === 'string' && categories.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be one of: cão, gato, roedor, ave, outro`;
        },
      },
    });
  };
}
