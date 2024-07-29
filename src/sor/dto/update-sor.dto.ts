import { PartialType } from '@nestjs/swagger';
import { CreateSORDto } from './create-sor.dto';

export class UpdateSORDto extends PartialType(CreateSORDto) {}
