import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SFRService } from './sfr.service';
import { CreateSFRDto } from './dto/create-sfr.dto';
import { UpdateSFRDto } from './dto/update-sfr.dto';

@ApiTags('sfr')
@Controller('sfr')
export class SFRController {
  constructor(private readonly sfrService: SFRService) {}

  @Post()
  create(@Body() createSFRDto: CreateSFRDto) {
    return this.sfrService.create(createSFRDto);
  }

  @Get()
  findAll() {
    return this.sfrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sfrService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSFRDto: UpdateSFRDto) {
    return this.sfrService.update(id, updateSFRDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.sfrService.remove(id);
  }
}
