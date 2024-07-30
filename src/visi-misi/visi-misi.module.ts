import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisiMisi } from '../entities/visi-misi.entity'; // Pastikan path ini benar
import { User } from '../entities/user.entity'; // Pastikan entitas User sudah benar diimpor
import { VisiMisiController } from './visi-misi.controller'; // Pastikan path ini benar
import { VisiMisiService } from './visi-misi.service'; // Pastikan path ini benar
import { AuthModule } from 'src/auth/auth.module'; // AuthModule untuk autentikasi

@Module({
  imports: [
    TypeOrmModule.forFeature([VisiMisi]), User, AuthModule, 
  ],
  controllers: [VisiMisiController], 
  providers: [VisiMisiService],
})
export class VisiMisiModule {}
