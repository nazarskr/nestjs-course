import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsEmailUniqueConstraint } from '../validators/is-email-unique.constraint';

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUniqueConstraint,
    });
  };
}
