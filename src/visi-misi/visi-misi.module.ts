import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisiMisiService } from './visi-misi.service';
import { VisiMisiController } from './visi-misi.controller';
import { VisiMisi } from 'src/entities/visi-misi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VisiMisi])],
  controllers: [VisiMisiController],
  providers: [VisiMisiService],
})
export class VisiMisiModule {}
