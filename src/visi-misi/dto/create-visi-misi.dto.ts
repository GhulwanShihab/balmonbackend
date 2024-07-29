import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVisiMisiDto {
  @ApiProperty({ example: 'Ini adalah visi', description: 'Visi' })
  @IsString()
  visi: string;

  @ApiProperty({ example: 'Ini adalah misi', description: 'Misi' })
  @IsString()
  misi: string;
}
