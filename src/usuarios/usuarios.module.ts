import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Add your imports here if needed
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // Export the service if needed in other modules
})
export class UsuariosModule {}
