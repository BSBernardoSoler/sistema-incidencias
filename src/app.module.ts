import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MetasModule } from './metas/metas.module';
import { RegistrosModule } from './registros/registros.module';
import { ObservacionesModule } from './observaciones/observaciones.module';
import { HistorialCambiosModule } from './historial-cambios/historial-cambios.module';
import { AlertasModule } from './alertas/alertas.module';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { envs } from './config/envs';
import { AlertasWebsocketsModule } from './alertas-websockets/alertas-websockets.module';
import { PdfReportModule } from './pdf-report/pdf-report.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envs.dbHost,
      port: 3306,
      username: envs.dbUser,
      password: '',
      database: envs.dbName,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsuariosModule, 
    MetasModule,
    RegistrosModule,
    ObservacionesModule,
    HistorialCambiosModule, 
    AlertasModule,
    RolesModule,
    AuthModule,
    AlertasWebsocketsModule,
    PdfReportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
