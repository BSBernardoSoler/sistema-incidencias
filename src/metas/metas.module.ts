import { Module } from '@nestjs/common';
import { MetasService } from './metas.service';
import { MetasController } from './metas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meta } from './entities/meta.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meta]),
    UsuariosModule
    
  ], // Add your imports here if needed
  controllers: [MetasController],
  providers: [MetasService],
  exports: [MetasService], // Export the service if needed in other modules
})
export class MetasModule {}
