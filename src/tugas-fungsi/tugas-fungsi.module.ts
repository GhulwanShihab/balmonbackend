import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TugasFungsiService } from './tugas-fungsi.service';
import { TugasFungsiController } from './tugas-fungsi.controller';
import { TugasFungsi } from 'src/entities/tugas-fungsi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TugasFungsi])],
  controllers: [TugasFungsiController],
  providers: [TugasFungsiService],
})
export class TugasFungsiModule {}
