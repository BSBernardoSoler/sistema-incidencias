import { forwardRef, Module } from '@nestjs/common';
import { RegistrosService } from './registros.service';
import { RegistrosController } from './registros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registro } from './entities/registro.entity';
import { User } from 'src/usuarios/entities/usuario.entity';
import { AlertasWebsocketsModule } from 'src/alertas-websockets/alertas-websockets.module';
import { MetasService } from 'src/metas/metas.service';
import { MetasModule } from 'src/metas/metas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Registro,User]),forwardRef(() => AlertasWebsocketsModule),MetasModule], // Add your imports here if needed
  controllers: [RegistrosController],
  providers: [RegistrosService],
  exports: [RegistrosService], // Export the service if needed in other modules
})
export class RegistrosModule {}
