import { ApiPropertyOptional } from "@nestjs/swagger";
import { z } from 'zod';

export const UpdateGaleriFotoDtoSchema = z.object({
  judulFoto: z.string().optional(),
  foto: z.string().optional(),
});

export class UpdateGaleriFotoDto {
  @ApiPropertyOptional({ example: 'Judul Foto', description: 'Judul dari foto' })
  judulFoto?: string;

  @ApiPropertyOptional({ example: 'path/to/foto.jpg', description: 'Path foto untuk galeri' })
  foto?: string;

  constructor(data: any) {
    const validatedData = UpdateGaleriFotoDtoSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
