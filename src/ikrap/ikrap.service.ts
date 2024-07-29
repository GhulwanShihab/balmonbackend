import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ikrap } from 'src/entities/ikrap.entity'; // Pastikan path ini benar
import { IkrapDTO } from './dto/ikrap.dto';

@Injectable()
export class IkrapService {
    constructor(
        @InjectRepository(Ikrap)
        private readonly ikrapRepository: Repository<Ikrap>,
    ) { }

    async createOrUpdate(ikrapDto: IkrapDTO, imgSrc: string): Promise<Ikrap> {
        const existingIkrap = await this.ikrapRepository.find();
        const data = { foto: imgSrc, ...ikrapDto };
        if (existingIkrap.length > 0) {
            const updatedIkrap = this.ikrapRepository.merge(existingIkrap[0], data);
            return await this.ikrapRepository.save(updatedIkrap);
        } else {
            const newIkrap = this.ikrapRepository.create(data);
            return await this.ikrapRepository.save(newIkrap);
        }
    }

    async findOne(): Promise<Ikrap> {
        const ikrap = await this.ikrapRepository.find({});
        if (ikrap.length === 0) {
            throw new NotFoundException('Ikrap not found');
        }
        return ikrap[0];
    }
}
