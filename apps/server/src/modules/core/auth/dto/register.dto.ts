import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { RegisterForm } from '@echoo/api-types';

export class RegisterDto implements RegisterForm {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;
}
