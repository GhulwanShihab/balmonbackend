import { config } from 'dotenv';
config(); // Add this line at the top

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerExceptionFilter } from './security/throttler-exception.filter';
import {NestExpressApplication} from "@nestjs/platform-express";
import rateLimit from 'express-rate-limit';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('public/upload/', {
    prefix: '/public/upload/',
  });

  const options = new DocumentBuilder()
    .setTitle('BALMON LAMPUNG')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(helmet({
    crossOriginResourcePolicy: false
  }));

  // app.use(rateLimit({
  //   windowMs: 15 * 60 * 1000, // 15 menit
  //   max: 100, // limit tiap IP untuk 100 requests per windowMs
  // }));

  app.useGlobalFilters(new ThrottlerExceptionFilter());

   // Content Security Policy (CSP)
  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'"
    );
    next();
  });

   // Security Headers
  //  app.use((req, res, next) => {
  //   res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  //   res.setHeader('X-Content-Type-Options', 'nosniff');
  //   res.setHeader('X-Frame-Options', 'DENY');
  //   next();
  // });
  
  //cors di enabled untuk frontend endpoints
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
