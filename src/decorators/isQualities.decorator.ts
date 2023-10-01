import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
export function IsQualities(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isQualities',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const validQualities = [
            'Calmo',
            'Ativo',
            'Carinhoso',
            'Educado',
            'Brincalhão',
            'Esperto',
          ];
          return (
            Array.isArray(value) &&
            value.every((val) => validQualities.includes(val))
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} qualities must be an array of one or more of the following values: Calmo, Ativo, Carinhoso, Educado, Brincalhão, Esperto`;
        },
      },
    });
  };
}
