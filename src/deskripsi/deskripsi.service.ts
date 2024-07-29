import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deskripsi } from 'src/entities/deskripsi.entity'; // Pastikan path ini benar
import { DeskripsiDTO } from './dto/deskripsi.dto';

@Injectable()
export class DeskripsiService {
    constructor(
        @InjectRepository(Deskripsi)
        private readonly deskripsiRepository: Repository<Deskripsi>,
    ) { }

    async createOrUpdate(deskripsiDto: DeskripsiDTO, imgSrc: string): Promise<Deskripsi> {
        const existingDeskripsi = await this.deskripsiRepository.find();
        const data = { foto: imgSrc, ...deskripsiDto };
        if (existingDeskripsi.length > 0) {
            const updatedDeskripsi = this.deskripsiRepository.merge(existingDeskripsi[0], data);
            return await this.deskripsiRepository.save(updatedDeskripsi);
        } else {
            const newDeskripsi = this.deskripsiRepository.create(data);
            return await this.deskripsiRepository.save(newDeskripsi);
        }
    }

    async findOne(): Promise<Deskripsi> {
        const deskripsi = await this.deskripsiRepository.find({});
        if (deskripsi.length === 0) {
            throw new NotFoundException('Deskripsi not found');
        }
        return deskripsi[0];
    }
}
