import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TugasFungsiService } from './tugas-fungsi.service';
import { CreateTugasFungsiDto } from './dto/create-tugas-fungsi.dto';
import { UpdateTugasFungsiDto } from './dto/update-tugas-fungsi.dto';
import { TugasFungsi } from 'src/entities/tugas-fungsi.entity';

@ApiTags('TugasFungsi')
@Controller('tugas-fungsi')
export class TugasFungsiController {
  constructor(private readonly tugasFungsiService: TugasFungsiService) {}

  @Post()
  create(@Body() createTugasFungsiDto: CreateTugasFungsiDto): Promise<TugasFungsi> {
    return this.tugasFungsiService.create(createTugasFungsiDto);
  }

  @Get()
  findAll(): Promise<TugasFungsi[]> {
    return this.tugasFungsiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<TugasFungsi> {
    return this.tugasFungsiService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTugasFungsiDto: UpdateTugasFungsiDto): Promise<TugasFungsi> {
    return this.tugasFungsiService.update(id, updateTugasFungsiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.tugasFungsiService.remove(id);
  }
}
