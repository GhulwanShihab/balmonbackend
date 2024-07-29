import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateGaleriFotoDtoSchema = z.object({
  judulFoto: z.string(),
  foto: z.string(),
});

export class CreateGaleriFotoDto {
  @ApiProperty({ example: 'Judul Foto', description: 'Judul dari foto' })
  judulFoto: string;

  @ApiProperty({ example: 'path/to/foto.jpg', description: 'Path foto untuk galeri' })
  foto: string;

  constructor(data: any) {
    const validatedData = CreateGaleriFotoDtoSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
