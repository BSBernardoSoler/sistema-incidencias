import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validationError: { target: false, value: false },
 
    })
  );

    // Habilitar CORS para permitir solicitudes desde http://localhost:3000
    app.enableCors({
      origin: 'http://localhost:3001', // La URL de tu aplicación Next.js
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
    });

   // Configuración de Swagger 
   const config = new DocumentBuilder()
    .setTitle("Sistema Incidencias")
    .setDescription("API para el sistema de incidencias")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  
  await app.listen(envs.port);
  console.log(`Server running on port ${envs.port}`);
}
bootstrap();
