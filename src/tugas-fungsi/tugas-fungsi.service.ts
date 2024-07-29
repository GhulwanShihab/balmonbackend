import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTugasFungsiDto } from './dto/create-tugas-fungsi.dto';
import { UpdateTugasFungsiDto } from './dto/update-tugas-fungsi.dto';
import { TugasFungsi } from 'src/entities/tugas-fungsi.entity';

@Injectable()
export class TugasFungsiService {
  constructor(
    @InjectRepository(TugasFungsi)
    private readonly tugasFungsiRepository: Repository<TugasFungsi>,
  ) {}

  async create(createTugasFungsiDto: CreateTugasFungsiDto): Promise<TugasFungsi> {
    const tugasFungsi = this.tugasFungsiRepository.create(createTugasFungsiDto);
    return this.tugasFungsiRepository.save(tugasFungsi);
  }

  findAll(): Promise<TugasFungsi[]> {
    return this.tugasFungsiRepository.find();
  }

  async findOne(id: number): Promise<TugasFungsi> {
    const tugasFungsi = await this.tugasFungsiRepository.findOne({ where: { id } });
    if (!tugasFungsi) {
      throw new NotFoundException(`TugasFungsi with ID ${id} not found`);
    }
    return tugasFungsi;
  }

  async update(id: number, updateTugasFungsiDto: UpdateTugasFungsiDto): Promise<TugasFungsi> {
    await this.tugasFungsiRepository.update(id, updateTugasFungsiDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tugasFungsiRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TugasFungsi with ID ${id} not found`);
    }
  }
}
