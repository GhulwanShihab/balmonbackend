import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deskripsi } from '../entities/deskripsi.entity'; // Pastikan path ini benar
import { User } from '../entities/user.entity'; // Pastikan entitas User sudah benar diimpor
import { DeskripsiController } from './deskripsi.controller'; // Pastikan path ini benar
import { DeskripsiService } from './deskripsi.service'; // Pastikan path ini benar
import { AuthModule } from 'src/auth/auth.module'; // AuthModule untuk autentikasi

@Module({
  imports: [
    TypeOrmModule.forFeature([Deskripsi]), User, AuthModule, 
  ],
  controllers: [DeskripsiController], // Menyediakan controller untuk Deskripsi
  providers: [DeskripsiService], // Menyediakan service untuk Deskripsi
})
export class IARModule {}
