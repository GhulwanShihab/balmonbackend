import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSORDto } from './dto/create-sor.dto';
import { UpdateSORDto } from './dto/update-sor.dto';
import { SOR } from '../entities/sor.entity';

@Injectable()
export class SORService {
  constructor(
    @InjectRepository(SOR)
    private readonly sorRepository: Repository<SOR>,
  ) {}

  async create(createSORDto: CreateSORDto): Promise<SOR> {
    const sor = this.sorRepository.create(createSORDto);
    return this.sorRepository.save(sor);
  }

  async findAll(): Promise<SOR[]> {
    return this.sorRepository.find();
  }

  async findOne(id: number): Promise<SOR> {
    const sor = await this.sorRepository.findOne({ where: { id } });
    if (!sor) {
      throw new NotFoundException(`SOR with ID ${id} not found`);
    }
    return sor;
  }

  async update(id: number, updateSORDto: UpdateSORDto): Promise<SOR> {
    const sor = await this.findOne(id);
    Object.assign(sor, updateSORDto);
    return this.sorRepository.save(sor);
  }

  async remove(id: number): Promise<void> {
    const sor = await this.findOne(id);
    await this.sorRepository.remove(sor);
  }
}
