import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSORDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
