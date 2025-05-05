import { Module } from '@nestjs/common';
import { HistorialCambiosService } from './historial-cambios.service';
import { HistorialCambiosController } from './historial-cambios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialCambio } from './entities/historial-cambio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialCambio])], // Add your imports here if needed
  controllers: [HistorialCambiosController],
  providers: [HistorialCambiosService],
  exports: [HistorialCambiosService], // Export the service if needed in other modules
})
export class HistorialCambiosModule {}
