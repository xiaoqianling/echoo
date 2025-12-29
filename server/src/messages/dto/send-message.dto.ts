import { IsNotEmpty, IsOptional, IsArray, IsString } from 'class-validator';

export class SendMessageDto {
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
