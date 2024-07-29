import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RateLimiterMiddleware } from './security/rate-limiter.middleware';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { BeritaModule } from './berita/berita.module';
import { BannerModule } from './banner/banner.module'; // Adjust the path as necessary
import { AboutModule } from './about/about.module';
import { ProfileModule } from './profile/profile.module';
import { VisiMisiModule } from './visi-misi/visi-misi.module';
import { TugasFungsiModule } from './tugas-fungsi/tugas-fungsi.module';
import { SFRModule } from './sfr/sfr.module';
import { SORModule } from './sor/sor.module';
import { IARModule } from './deskripsi/deskripsi.module';
import { IkrapModule } from './ikrap/ikrap.module';
import { StrukturPengurusModule} from './struktur-pengurus/struktur-pengurus.module';
import { InstagramModule } from './instagram/instagram.module';
import { GaleriFotoModule } from './galeri-foto/galeri-foto.module';
import { GaleriVideoModule } from './galeri-video/galeri-video.module';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mails/mail.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        // ThrottlerModule.forRoot([{
        //     ttl: 10,
        //     limit: 10,
        // }]),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true
        }),
        UsersModule,
        BeritaModule,
        BannerModule,
        AboutModule,
        ProfileModule,
        VisiMisiModule,
        TugasFungsiModule,
        InstagramModule,
        GaleriFotoModule,
        GaleriVideoModule,
        IARModule,
        IkrapModule, 
        StrukturPengurusModule,
        SFRModule,
        SORModule,
        SeederModule,
        AuthModule,
    ],
    controllers: [],
    providers: [
        MailService,
        // {
        //     provide: APP_GUARD,
        //     useClass: ThrottlerGuard,
        // },
        // RateLimiterMiddleware,
    ],
})
export class AppModule {
    constructor(private readonly seederService: SeederService) {}

    async onModuleInit() {
       await this.seederService.seedAdminUser();
    }
    // configure(consumer: MiddlewareConsumer) {
    //     consumer
    //         .apply(RateLimiterMiddleware)
    //         .forRoutes('auth/login');
    // }
}
