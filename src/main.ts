import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

    // Habilitar CORS para permitir solicitudes desde http://localhost:3000
    app.enableCors({
      origin: 'http://localhost:3001', // La URL de tu aplicación Next.js
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
    });
  await app.listen(envs.port);
}
bootstrap();
