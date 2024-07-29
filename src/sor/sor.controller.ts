import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SORService } from './sor.service';
import { CreateSORDto } from './dto/create-sor.dto';
import { UpdateSORDto } from './dto/update-sor.dto';

@ApiTags('sor')
@Controller('sor')
export class SORController {
  constructor(private readonly sorService: SORService) {}

  @Post()
  create(@Body() createSORDto: CreateSORDto) {
    return this.sorService.create(createSORDto);
  }

  @Get()
  findAll() {
    return this.sorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSORDto: UpdateSORDto) {
    return this.sorService.update(id, updateSORDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.sorService.remove(id);
  }
}
