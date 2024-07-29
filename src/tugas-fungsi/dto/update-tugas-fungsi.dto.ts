import { PartialType } from '@nestjs/swagger';
import { CreateTugasFungsiDto } from './create-tugas-fungsi.dto';

export class UpdateTugasFungsiDto extends PartialType(CreateTugasFungsiDto) {}
