import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVisiMisiDto } from './dto/create-visi-misi.dto';
import { UpdateVisiMisiDto } from './dto/update-visi-misi.dto';
import { VisiMisi } from 'src/entities/visi-misi.entity';

@Injectable()
export class VisiMisiService {
  constructor(
    @InjectRepository(VisiMisi)
    private readonly visiMisiRepository: Repository<VisiMisi>,
  ) {}

  async create(createVisiMisiDto: CreateVisiMisiDto): Promise<VisiMisi> {
    const visiMisi = this.visiMisiRepository.create(createVisiMisiDto);
    return this.visiMisiRepository.save(visiMisi);
  }

  findAll(): Promise<VisiMisi[]> {
    return this.visiMisiRepository.find();
  }

  async findOne(id: number): Promise<VisiMisi> {
    const visiMisi = await this.visiMisiRepository.findOne({ where: { id } });
    if (!visiMisi) {
      throw new NotFoundException(`VisiMisi with ID ${id} not found`);
    }
    return visiMisi;
  }

  async update(id: number, updateVisiMisiDto: UpdateVisiMisiDto): Promise<VisiMisi> {
    await this.visiMisiRepository.update(id, updateVisiMisiDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.visiMisiRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`VisiMisi with ID ${id} not found`);
    }
  }
}
