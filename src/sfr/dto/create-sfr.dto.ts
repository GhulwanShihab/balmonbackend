import { ApiProperty } from '@nestjs/swagger';

export class CreateSFRDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
