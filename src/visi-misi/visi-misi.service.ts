import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { VisiMisi } from '../entities/visi-misi.entity';
import { Teks } from '../entities/teks.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import * as fs from 'fs';
import * as path from 'path';
import { CreateVisiMisiDto } from './dto/create-visi-misi.dto';
import { UpdateVisiMisiDto } from './dto/update-visi-misi.dto';

@Injectable()
export class VisiMisiService {
  private readonly logger = new Logger(VisiMisiService.name);

  constructor(
    @InjectRepository(VisiMisi)
    private readonly visiMisiRepository: Repository<VisiMisi>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createVisiMisiDto: CreateVisiMisiDto, userId: string, imgSrc: string): Promise<VisiMisi> {
    let newVisiMisi: VisiMisi;

    await this.entityManager.transaction(async transactionalEntityManager => {
      // Create Teks entities for deskripsiVisi and deskripsiMisi
      const deskripsiVisi = createVisiMisiDto.deskripsiVisi.map((str, index) => {
        const teks = new Teks();
        teks.str = str;
        teks.order = index;
        return teks;
      });

      const deskripsiMisi = createVisiMisiDto.deskripsiMisi.map((str, index) => {
        const teks = new Teks();
        teks.str = str;
        teks.order = index;
        return teks;
      });

      // Create VisiMisi entity
      const dataVisiMisi: Partial<VisiMisi> = {
        foto: imgSrc,
        titleVisi: createVisiMisiDto.titleVisi,
        titleMisi: createVisiMisiDto.titleMisi,
        deskripsiVisi: deskripsiVisi,
        deskripsiMisi: deskripsiMisi,
        createdBy: { id: userId } as any,  // Assuming userId is a valid User entity id
      };

      newVisiMisi = await transactionalEntityManager.save(
        this.visiMisiRepository.create(dataVisiMisi),
      );
    });

    await this.clearAllVisiMisiCache();
    return newVisiMisi!;
  }

  async update(id: string, userId: string, updateVisiMisiDto: UpdateVisiMisiDto, imgSrc?: string): Promise<VisiMisi> {
    this.logger.log(`Update request received: ID=${id}, Data=${JSON.stringify(updateVisiMisiDto)}`);
    let updatedVisiMisi: VisiMisi;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const visiMisi = await transactionalEntityManager.findOne(VisiMisi, { where: { id }, relations: ['deskripsiVisi', 'deskripsiMisi'] });

      if (!visiMisi) {
        throw new NotFoundException(`VisiMisi with id ${id} not found`);
      }

      // Update deskripsiVisi and deskripsiMisi
      if (updateVisiMisiDto.deskripsiVisi) {
        visiMisi.deskripsiVisi = updateVisiMisiDto.deskripsiVisi.map((str, index) => {
          const teks = new Teks();
          teks.str = str;
          teks.order = index;
          return teks;
        });
      }

      if (updateVisiMisiDto.deskripsiMisi) {
        visiMisi.deskripsiMisi = updateVisiMisiDto.deskripsiMisi.map((str, index) => {
          const teks = new Teks();
          teks.str = str;
          teks.order = index;
          return teks;
        });
      }

      // Update other fields
      if (imgSrc) {
        visiMisi.foto = imgSrc;
      }
      visiMisi.titleVisi = updateVisiMisiDto.titleVisi;
      visiMisi.titleMisi = updateVisiMisiDto.titleMisi;
      visiMisi.updatedBy = { id: userId } as any;  // Assuming userId is a valid User entity id

      updatedVisiMisi = await transactionalEntityManager.save(visiMisi);
    });
    
    this.logger.log(`VisiMisi updated: ID=${id}`);
    await this.clearAllVisiMisiCache();
    return updatedVisiMisi!;
  }

  async findOne(id: string): Promise<VisiMisi | undefined> {
    const visiMisi = await this.visiMisiRepository.findOne({ where: { id }, relations: ['deskripsiVisi', 'deskripsiMisi'] });
    if (visiMisi) {
      visiMisi.deskripsiVisi.sort((a, b) => a.order - b.order);
      visiMisi.deskripsiMisi.sort((a, b) => a.order - b.order);
    }
    return visiMisi;
  }

  async findAll(query: QueryDto): Promise<{ data: VisiMisi[], total: number }> {
    let { limit, page, search, sort, order } = query;
    const cacheKey = `visiMisi_${limit}_${page}_${search}_${sort}_${order}`;
    this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

    const cachedData = await redis.get<string | null>(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      return result;
    }

    this.logger.log(`Fetching from DB with limit: ${limit}, page: ${page}`);

    if (limit) {
      limit = parseInt(limit as any, 10);
    }
    if (page) {
      page = parseInt(page as any, 10);
    }

    let skip = 0;
    if (limit && page) {
      skip = (page - 1) * limit;
    }

    const orderOption: { [key: string]: 'ASC' | 'DESC' } = {};
    if (sort && order) {
      orderOption[sort] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    } else if (order && !sort) {
      orderOption['createdAt'] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    } else {
      orderOption['createdAt'] = 'DESC';
    }

    const [data, total] = await this.visiMisiRepository.findAndCount({
      take: limit,
      skip: skip,
      where: search ? { titleVisi: Like(`%${search}%`) } : {},
      order: orderOption,
      relations: ['deskripsiVisi', 'deskripsiMisi'],
    });

    data.forEach(visiMisi => {
      visiMisi.deskripsiVisi.sort((a, b) => a.order - b.order);
      visiMisi.deskripsiMisi.sort((a, b) => a.order - b.order);
    });

    const result = { data, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
  }

  async remove(id: string): Promise<void> {
    const visiMisi = await this.visiMisiRepository.findOne({ where: { id }, relations: ['deskripsiVisi', 'deskripsiMisi'] });
    if (!visiMisi) {
      throw new NotFoundException(`VisiMisi with id ${id} not found`);
    }
    if (visiMisi.foto) {
      const filePath = path.join(__dirname, '../../public/upload/visi-misi', path.basename(visiMisi.foto));
      if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); }
    }

    await this.visiMisiRepository.delete(id);
    await this.clearAllVisiMisiCache();
  }

  private async clearAllVisiMisiCache(): Promise<void> {
    const keys = await redis.keys('visiMisi_*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
