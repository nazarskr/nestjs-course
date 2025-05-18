import { IsEmail, Matches, ValidationOptions } from 'class-validator';
import {
  PASSWORD_REGEX,
  PASSWORD_RULE_MESSAGE,
} from '@shared-lib/validators/password.validator';
import { IsEmailUnique } from '../decorators/is-email-unique.decorator';

const passwordValidationOptions: ValidationOptions = {
  message: PASSWORD_RULE_MESSAGE,
};

export class CreateUserDto {
  @IsEmail()
  @IsEmailUnique({ message: 'This email is already registered.' })
  email: string;

  @Matches(PASSWORD_REGEX, passwordValidationOptions)
  password: string;
}
