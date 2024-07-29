import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateInstagramDtoSchema = z.object({
  judulInstagram: z.string(),
  deskripsiInstagram: z.array(z.string()),
  tanggalInstagram: z.string(),
  fotoInstagram: z.string(),
  authorInstagram: z.string(),
  editorInstagram: z.string(),
  fotoContent: z.string(),
  publishedAt: z.string(),
});

export class CreateInstagramDto {
  @ApiProperty({ example: 'Judul Instagram', description: 'Judul dari Instagram' })
  judulInstagram: string;

  @ApiProperty({
    example: ['Deskripsi Instagram 1', 'Deskripsi Instagram 2'],
    description: 'Deskripsi dari Instagram',
    type: [String],
  })
  deskripsiInstagram: string[];

  @ApiProperty({ example: '2024-07-03', description: 'Tanggal Instagram' })
  tanggalInstagram: string;

  @ApiProperty({ example: 'path/to/foto.jpg', description: 'Path foto untuk Instagram' })
  fotoInstagram: string;

  @ApiProperty({ example: 'John Doe', description: 'Penulis Instagram' })
  authorInstagram: string;

  @ApiProperty({ example: 'Jane Doe', description: 'Editor Instagram' })
  editorInstagram: string;

  @ApiProperty({ example: 'path/to/foto-content.jpg', description: 'Path foto konten Instagram' })
  fotoContent: string;

  @ApiProperty({ example: '2024-07-03T04:48:57.000Z', description: 'Tanggal dipublikasikan' })
  publishedAt: string;

  constructor(data: any) {
    const validatedData = CreateInstagramDtoSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
