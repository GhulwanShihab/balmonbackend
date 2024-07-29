import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VisiMisiService } from './visi-misi.service';
import { CreateVisiMisiDto } from './dto/create-visi-misi.dto';
import { UpdateVisiMisiDto } from './dto/update-visi-misi.dto';
import { VisiMisi } from 'src/entities/visi-misi.entity';

@ApiTags('VisiMisi')
@Controller('visi-misi')
export class VisiMisiController {
  constructor(private readonly visiMisiService: VisiMisiService) {}

  @Post()
  create(@Body() createVisiMisiDto: CreateVisiMisiDto): Promise<VisiMisi> {
    return this.visiMisiService.create(createVisiMisiDto);
  }

  @Get()
  findAll(): Promise<VisiMisi[]> {
    return this.visiMisiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<VisiMisi> {
    return this.visiMisiService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateVisiMisiDto: UpdateVisiMisiDto): Promise<VisiMisi> {
    return this.visiMisiService.update(id, updateVisiMisiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.visiMisiService.remove(id);
  }
}
