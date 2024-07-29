import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instagram } from 'src/entities/instagram.entity';
import { InstagramService } from './instagram.service';
import { InstagramController } from './instagram.controller';
import { Teks } from 'src/entities/teks.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Instagram, Teks]), AuthModule],
  providers: [InstagramService],
  controllers: [InstagramController],
})
export class InstagramModule {}
