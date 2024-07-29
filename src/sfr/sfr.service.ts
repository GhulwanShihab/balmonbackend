import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSFRDto } from './dto/create-sfr.dto';
import { UpdateSFRDto } from './dto/update-sfr.dto';
import { SFR } from '../entities/sfr.entity';

@Injectable()
export class SFRService {
  constructor(
    @InjectRepository(SFR)
    private readonly sfrRepository: Repository<SFR>,
  ) {}

  async create(createSFRDto: CreateSFRDto): Promise<SFR> {
    const sfr = this.sfrRepository.create(createSFRDto);
    return this.sfrRepository.save(sfr);
  }

  async findAll(): Promise<SFR[]> {
    return this.sfrRepository.find();
  }

  async findOne(id: number): Promise<SFR> {
    const sfr = await this.sfrRepository.findOne({ where: { id } });
    if (!sfr) {
      throw new NotFoundException(`SFR with ID ${id} not found`);
    }
    return sfr;
  }

  async update(id: number, updateSFRDto: UpdateSFRDto): Promise<SFR> {
    const sfr = await this.findOne(id);
    Object.assign(sfr, updateSFRDto);
    return this.sfrRepository.save(sfr);
  }

  async remove(id: number): Promise<void> {
    const sfr = await this.findOne(id);
    await this.sfrRepository.remove(sfr);
  }
}
