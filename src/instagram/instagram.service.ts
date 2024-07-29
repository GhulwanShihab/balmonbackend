import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Instagram } from '../entities/instagram.entity';
import { Teks } from '../entities/teks.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import { User } from 'src/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { CreateInstagramDto } from './dto/create-instagram.dto';
import { UpdateInstagramDto } from './dto/update-instagram.dto';

@Injectable()
export class InstagramService {
  constructor(
    @InjectRepository(Instagram)
    private readonly instagramRepository: Repository<Instagram>,
    @InjectRepository(Teks)
    private readonly teksRepository: Repository<Teks>,
    private readonly entityManager: EntityManager,
  ) { }
  private readonly logger = new Logger(InstagramService.name);

  async create(createInstagramDto: CreateInstagramDto, userId: string, fotoInstagram: string, fotoContent: string): Promise<Instagram> {
    let newInstagram: Instagram;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const createdBy = user;
      const updatedBy = user;

      const teksEntities = createInstagramDto.deskripsiInstagram.map((str, index) => {
        const teks = new Teks();
        teks.str = str;
        teks.order = index;
        return teks;
      });

      const dataInstagram = {
        ...createInstagramDto,
        deskripsiInstagram: teksEntities,
        createdBy,
        updatedBy,
        fotoInstagram,
        fotoContent
      };

      newInstagram = await transactionalEntityManager.save(
        this.instagramRepository.create(dataInstagram),
      );
    });

    await this.clearAllInstagramCache();
    return newInstagram!;
  }

  async update(id: string, userId: string, updateInstagramDto: UpdateInstagramDto, fotoInstagram?: string, fotoContent?: string): Promise<Instagram> {
    let updatedInstagram: Instagram;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const instagram = await transactionalEntityManager.findOne(Instagram, { where: { id }, relations: ['deskripsiInstagram'] });
      if (!instagram) {
        throw new NotFoundException(`Instagram with id ${id} not found`);
      }
      const updatedBy = user;

      let teksData;
      if (updateInstagramDto.deskripsiInstagram) {
        const teksEntities = updateInstagramDto.deskripsiInstagram.map((str, index) => {
          const teks = new Teks();
          teks.str = str;
          teks.order = index;
          return teks;
        });
        teksData = teksEntities;
      }

      const dataInstagram = { ...updateInstagramDto, updatedBy, deskripsiInstagram: teksData };

      if (fotoInstagram) {
        if (instagram.fotoInstagram) {
          const oldImagePath = path.join(__dirname, '../../public/upload/instagrams', path.basename(instagram.fotoInstagram));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        dataInstagram.fotoInstagram = fotoInstagram;
      }

      if (fotoContent) {
        if (instagram.fotoContent) {
          const oldImagePath = path.join(__dirname, '../../public/upload/instagrams', path.basename(instagram.fotoContent));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        dataInstagram.fotoContent = fotoContent;
      }

      Object.assign(instagram, dataInstagram);
      updatedInstagram = await transactionalEntityManager.save(instagram);
    });

    await this.clearAllInstagramCache();
    return updatedInstagram!;
  }

  async findOne(id: string): Promise<Instagram | undefined> {
    const instagram = await this.instagramRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy', 'deskripsiInstagram'] });
    if (instagram) {
      instagram.deskripsiInstagram.sort((a, b) => a.order - b.order);
    }
    return instagram;
  }

  async findAll(query: QueryDto): Promise<{ data: Instagram[], total: number }> {
    let { limit, page, search, sort, order } = query;
    const cacheKey = `instagrams_${limit}_${page}_${search}_${sort}_${order}`;
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

    let instagrams: Instagram[];
    let total: number;
    if (limit && page) {
        const [result, count] = await this.instagramRepository.findAndCount({
            take: limit,
            skip: skip,
            where: search ? { judulInstagram: Like(`%${search}%`) } : {},
            order: orderOption,
            relations: ['createdBy', 'updatedBy', 'deskripsiInstagram'],
        });
        instagrams = result;
        total = count;
    } else {
        const result = await this.instagramRepository.find({
            where: search ? { judulInstagram: Like(`%${search}%`) } : {},
            order: orderOption,
            relations: ['createdBy', 'updatedBy', 'deskripsiInstagram'],
        });
        instagrams = result;
        total = result.length;
    }

    this.logger.log(`DB result - Instagrams count: ${instagrams.length}, Total count: ${total}`);

    instagrams.forEach(instagram => {
        if (instagram.deskripsiInstagram) {
            instagram.deskripsiInstagram.sort((a, b) => a.order - b.order);
        }
    });

    const result = { data: instagrams, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
}

  async remove(id: string): Promise<void> {
    const instagram = await this.instagramRepository.findOne({ where: { id }, relations: ['deskripsiInstagram'] });
    if (!instagram) {
      throw new NotFoundException(`Instagram with id ${id} not found`);
    }
    if (instagram.fotoInstagram) {
      const imagePath = path.join(__dirname, '../../public/upload/instagrams', path.basename(instagram.fotoInstagram));
      if (fs.existsSync(imagePath)) { fs.unlinkSync(imagePath); }
    }

    await this.instagramRepository.delete(id);
    await this.clearAllInstagramCache();
  }

  private async clearAllInstagramCache(): Promise<void> {
    const keys = await redis.keys('instagrams_*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
