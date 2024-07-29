import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GaleriFoto } from 'src/entities/galeri-foto.entity';
import { GaleriFotoService } from './galeri-foto.service';
import { GaleriFotoController } from './galeri-foto.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GaleriFoto]), AuthModule],
  providers: [GaleriFotoService],
  controllers: [GaleriFotoController],
})
export class GaleriFotoModule {}
