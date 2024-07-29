import { PartialType } from '@nestjs/swagger';
import { CreateSFRDto } from './create-sfr.dto';

export class UpdateSFRDto extends PartialType(CreateSFRDto) {}
