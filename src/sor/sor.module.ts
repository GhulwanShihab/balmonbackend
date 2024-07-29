import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SORService } from './sor.service';
import { SORController } from './sor.controller';
import { SOR } from '../entities/sor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SOR])],
  controllers: [SORController],
  providers: [SORService],
})
export class SORModule {}
