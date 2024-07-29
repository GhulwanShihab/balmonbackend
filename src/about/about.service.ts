import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { About } from 'src/entities/about.entity';
import { AboutDTO } from './dto/about.dto';

@Injectable()
export class AboutService {
    constructor(
        @InjectRepository(About)
        private readonly aboutRepository: Repository<About>,
    ) { }

    async createOrUpdate(aboutDto: AboutDTO, imgSrc: string): Promise<About> {
        const existingAbout = await this.aboutRepository.find();
        const data = {fotoAbout: imgSrc, ...aboutDto}
        if (existingAbout.length > 0) {
            const updatedAbout = this.aboutRepository.merge(existingAbout[0], data);
            return await this.aboutRepository.save(updatedAbout);
        } else {
            const newAbout = this.aboutRepository.create(data);
            return await this.aboutRepository.save(newAbout);
        }
    }

    async findOne(): Promise<About> {
        const about = await this.aboutRepository.find({});
        if (about.length === 0) {
            throw new NotFoundException('About not found');
        }
        return about[0];
    }
}