import { IsEmail, IsNotEmpty } from 'class-validator';
import { LoginForm } from '@echoo/api-types';

export class LoginDto implements LoginForm {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
