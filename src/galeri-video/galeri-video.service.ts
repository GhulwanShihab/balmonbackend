import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { GaleriVideo } from 'src/entities/galeri-video.entity';
import { User } from 'src/entities/user.entity';
import { CreateVideoDto } from './dto/create-galeri-video.dto';
import { UpdateVideoDto } from './dto/update-galeri-video.dto';
import { QueryDto } from 'src/lib/query.dto';
import redis from 'src/lib/redis-client';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(GaleriVideo)
        private readonly videoRepository: Repository<GaleriVideo>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(VideoService.name);

    async create(createVideoDto: CreateVideoDto, userId: string): Promise<GaleriVideo> {
        let newVideo: GaleriVideo;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataVideo = { ...createVideoDto, createdBy, updatedBy };
            newVideo = await transactionalEntityManager.save(
                this.videoRepository.create(dataVideo),
            );
        });

        await this.clearAllVideoCache();
        return newVideo!;
    }

    async update(
        id: string,
        userId: string,
        updateVideoDto: UpdateVideoDto,
    ): Promise<GaleriVideo> {
        let updatedVideo: GaleriVideo;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const video = await transactionalEntityManager.findOne(GaleriVideo, { where: { id } });
            if (!video) {
                throw new NotFoundException(`Video with id ${id} not found`);
            }
            const updatedBy = user;

            const updatedData = {
                title: updateVideoDto.title || video.title,
                linkvideo: updateVideoDto.linkvideo || video.linkvideo,     
                publishedAt: updateVideoDto.publishedAt || video.publishedAt,
                updatedBy,
                
            };

            Object.assign(video, updatedData);
            updatedVideo = await transactionalEntityManager.save(video);
        });

        await this.clearAllVideoCache();
        return updatedVideo!;
    }

    async findOne(id: string): Promise<GaleriVideo | undefined> {
        return this.videoRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: GaleriVideo[], total: number }> {
        const { limit, page, search, sort, order } = query;
        const cacheKey = `videos_${limit}_${page}_${search}_${sort}_${order}`;
    
        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);
    
        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return result;
        }
    
        this.logger.log(`Fetching from DB`);
    
        const orderOption: { [key: string]: 'ASC' | 'DESC' } = {};
        if (sort && order) {
            orderOption[sort] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else if (order && !sort) {
            orderOption['createdAt'] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else {
            orderOption['createdAt'] = 'DESC';
        }
    
        const findOptions: any = {
            order: orderOption,
            relations: ['createdBy', 'updatedBy'],
        };
    
        if (limit && page) {
            findOptions.take = parseInt(limit as any, 10);
            findOptions.skip = (parseInt(page as any, 10) - 1) * findOptions.take;
        }
    
        if (search) {
            findOptions.where = { title: Like(`%${search}%`) };
        }
    
        let videos: GaleriVideo[];
        let total: number;
    
        if (limit && page) {
            const [result, count] = await this.videoRepository.findAndCount(findOptions);
            videos = result;
            total = count;
        } else {
            const result = await this.videoRepository.find(findOptions);
            videos = result;
            total = result.length;
        }
    
        this.logger.log(`DB result - Videos count: ${videos.length}, Total count: ${total}`);
    
        const result = { data: videos, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
    
        return result;
    }

    async remove(id: string): Promise<void> {
        const video = await this.videoRepository.findOne({ where: { id } });
        if (!video) {
            throw new NotFoundException(`Video with id ${id} not found`);
        }

        await this.videoRepository.delete(id);
        await this.clearAllVideoCache();
    }

    private async clearAllVideoCache() {
        const keys = await redis.keys('videos_*');

        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}
