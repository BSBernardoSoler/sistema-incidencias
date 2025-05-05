import { Module } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { AlertasController } from './alertas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alerta } from './entities/alerta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alerta])], // Add your entities here
  controllers: [AlertasController],
  providers: [AlertasService],
  exports: [AlertasService], // Export the service if needed in other modules
})
export class AlertasModule {}
