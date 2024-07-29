import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { About } from '../entities/about.entity';
import { User } from '../entities/user.entity';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { AuthModule } from 'src/auth/auth.module';
//import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([About]), User, AuthModule],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
