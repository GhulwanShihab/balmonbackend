import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTugasFungsiDto {
  @ApiProperty({ example: 'Ini adalah tugas', description: 'Tugas' })
  @IsString()
  tugas: string;

  @ApiProperty({ example: 'Ini adalah fungsi', description: 'Fungsi' })
  @IsString()
  fungsi: string;
}
