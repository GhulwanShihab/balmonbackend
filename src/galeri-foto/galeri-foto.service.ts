import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { GaleriFoto } from '../entities/galeri-foto.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import { User } from 'src/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { CreateGaleriFotoDto } from './dto/create-galeri-foto.dto';
import { UpdateGaleriFotoDto } from './dto/update-galeri-foto.dto';

@Injectable()
export class GaleriFotoService {
  constructor(
    @InjectRepository(GaleriFoto)
    private readonly galeriFotoRepository: Repository<GaleriFoto>,
    private readonly entityManager: EntityManager,
  ) { }
  private readonly logger = new Logger(GaleriFotoService.name);

  async create(createGaleriFotoDto: CreateGaleriFotoDto, userId: string, foto: string): Promise<GaleriFoto> {
    let newGaleriFoto: GaleriFoto;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const createdBy = user;
      const updatedBy = user;

      const dataGaleriFoto = {
        ...createGaleriFotoDto,
        createdBy,
        updatedBy,
        foto: foto,
      };

      newGaleriFoto = await transactionalEntityManager.save(
        this.galeriFotoRepository.create(dataGaleriFoto),
      );
    });

    await this.clearAllGaleriFotoCache();
    return newGaleriFoto!;
  }

  async update(id: string, userId: string, updateGaleriFotoDto: UpdateGaleriFotoDto, foto?: string): Promise<GaleriFoto> {
    let updatedGaleriFoto: GaleriFoto;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const galeriFoto = await transactionalEntityManager.findOne(GaleriFoto, { where: { id } });
      if (!galeriFoto) {
        throw new NotFoundException(`Galeri Foto with id ${id} not found`);
      }
      const updatedBy = user;

      const dataGaleriFoto = { ...updateGaleriFotoDto, updatedBy };

      if (foto) {
        if (galeriFoto.foto) {
          const oldImagePath = path.join(__dirname, '../../public/upload/galeri-foto', path.basename(galeriFoto.foto));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        dataGaleriFoto.foto = foto;
      }

      Object.assign(galeriFoto, dataGaleriFoto);
      updatedGaleriFoto = await transactionalEntityManager.save(galeriFoto);
    });

    await this.clearAllGaleriFotoCache();
    return updatedGaleriFoto!;
  }

  async findOne(id: string): Promise<GaleriFoto | undefined> {
    return this.galeriFotoRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
  }

  async findAll(query: QueryDto): Promise<{ data: GaleriFoto[], total: number }> {
    let { limit, page, search, sort, order } = query;
    const cacheKey = `galeri_foto_${limit}_${page}_${search}_${sort}_${order}`;
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

    const [galeriFotos, total] = await this.galeriFotoRepository.findAndCount({
      take: limit,
      skip,
      where: search ? { judulFoto: Like(`%${search}%`) } : {},
      order: orderOption,
      relations: ['createdBy', 'updatedBy'],
    });

    this.logger.log(`DB result - Galeri Foto count: ${galeriFotos.length}, Total count: ${total}`);

    const result = { data: galeriFotos, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
  }

  async remove(id: string): Promise<void> {
    const galeriFoto = await this.galeriFotoRepository.findOne({ where: { id } });
    if (!galeriFoto) {
      throw new NotFoundException(`Galeri Foto with id ${id} not found`);
    }
    if (galeriFoto.foto) {
      const imagePath = path.join(__dirname, '../../public/upload/galeri-foto', path.basename(galeriFoto.foto));
      if (fs.existsSync(imagePath)) { fs.unlinkSync(imagePath); }
    }

    await this.galeriFotoRepository.delete(id);
    await this.clearAllGaleriFotoCache();
  }

  private async clearAllGaleriFotoCache(): Promise<void> {
    const keys = await redis.keys('galeri_foto_*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
