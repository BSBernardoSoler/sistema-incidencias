import { Module } from '@nestjs/common';
import { RegistrosService } from './registros.service';
import { RegistrosController } from './registros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registro } from './entities/registro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Registro])], // Add your imports here if needed
  controllers: [RegistrosController],
  providers: [RegistrosService],
  exports: [RegistrosService], // Export the service if needed in other modules
})
export class RegistrosModule {}
