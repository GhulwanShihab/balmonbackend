import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GaleriVideo } from 'src/entities/galeri-video.entity';
import { User } from 'src/entities/user.entity';
import { VideoService } from './galeri-video.service';
import { VideoController } from './galeri-video.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([GaleriVideo]), User, AuthModule
    ],
    controllers: [VideoController],
    providers: [VideoService],
})
export class GaleriVideoModule {}