import { ApiPropertyOptional } from "@nestjs/swagger";
import { z } from 'zod';

export const UpdateInstagramDtoSchema = z.object({
  judulInstagram: z.string().optional(),
  deskripsiInstagram: z.array(z.string()).optional(),
  tanggalInstagram: z.string().optional(),
  fotoInstagram: z.string().optional(),
  authorInstagram: z.string().optional(),
  editorInstagram: z.string().optional(),
  fotoContentInstagram: z.string().optional(),
  publishedAt: z.string().optional(),
});

export class UpdateInstagramDto {
  @ApiPropertyOptional({ example: 'Judul Instagram', description: 'Judul dari Instagram' })
  judulInstagram?: string;

  @ApiPropertyOptional({
    example: ['Deskripsi Instagram 1', 'Deskripsi Instagram 2'],
    description: 'Deskripsi dari Instagram',
    type: [String],
  })
  deskripsiInstagram?: string[];

  @ApiPropertyOptional({ example: '2024-07-03', description: 'Tanggal Instagram' })
  tanggalInstagram?: string;

  @ApiPropertyOptional({ example: 'path/to/foto.jpg', description: 'Path foto untuk Instagram' })
  fotoInstagram?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Penulis Instagram' })
  authorInstagram?: string;

  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Editor Instagram' })
  editorInstagram?: string;

  @ApiPropertyOptional({ example: 'path/to/foto-content.jpg', description: 'Path foto konten Instagram' })
  fotoContent?: string;

  @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z', description: 'Tanggal dipublikasikan' })
  publishedAt?: string;

  constructor(data: any) {
    const validatedData = UpdateInstagramDtoSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
