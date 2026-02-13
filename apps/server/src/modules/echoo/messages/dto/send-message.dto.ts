import { IsNotEmpty, IsOptional, IsArray, IsString } from 'class-validator';
import { SendMessageForm } from '@echoo/api-types';

export class SendMessageDto implements SendMessageForm {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  desp?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  short?: string;

  @IsOptional()
  organizationId?: string;
}
