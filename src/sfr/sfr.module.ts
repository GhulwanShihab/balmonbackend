import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SFRService } from './sfr.service';
import { SFRController } from './sfr.controller';
import { SFR } from '../entities/sfr.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SFR])],
  controllers: [SFRController],
  providers: [SFRService],
})
export class SFRModule {}
