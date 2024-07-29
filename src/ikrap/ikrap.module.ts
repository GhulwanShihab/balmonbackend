import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ikrap } from '../entities/ikrap.entity'; // Pastikan path ini benar
import { User } from '../entities/user.entity'; // Pastikan entitas User sudah benar diimpor
import { IkrapController } from './ikrap.controller'; // Pastikan path ini benar
import { IkrapService } from './ikrap.service'; // Pastikan path ini benar
import { AuthModule } from 'src/auth/auth.module'; // AuthModule untuk autentikasi

@Module({
  imports: [
    TypeOrmModule.forFeature([Ikrap]), User, AuthModule, 
  ],
  controllers: [IkrapController], 
  providers: [IkrapService],
})
export class IkrapModule {}
