import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstans } from './constans/jwt.constant';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { Role } from 'src/roles/entities/role.entity';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports:[
    UsuariosModule,
    RolesModule,
    JwtModule.register({
      global:true,
      secret: jwtConstans.secret,
      signOptions:{expiresIn : '7d'}
    })

  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
