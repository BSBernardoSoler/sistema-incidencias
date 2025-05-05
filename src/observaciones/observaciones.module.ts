import { Module } from '@nestjs/common';
import { ObservacionesService } from './observaciones.service';
import { ObservacionesController } from './observaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Observacion } from './entities/observacione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Observacion])], // Add your imports here if needed
  controllers: [ObservacionesController],
  providers: [ObservacionesService],
  exports: [ObservacionesService], // Export the service if needed in other modules
})
export class ObservacionesModule {}
