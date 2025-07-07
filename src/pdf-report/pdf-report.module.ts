import { Module } from '@nestjs/common';
import { PdfReportService } from './pdf-report.service';
import { PdfReportController } from './pdf-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrosModule } from 'src/registros/registros.module';
import { AlertasModule } from 'src/alertas/alertas.module';
import { ObservacionesModule } from 'src/observaciones/observaciones.module';
import { HistorialCambiosModule } from 'src/historial-cambios/historial-cambios.module';
import { MetasModule } from 'src/metas/metas.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [
    RegistrosModule,
    AlertasModule,
    ObservacionesModule,
    HistorialCambiosModule,
    MetasModule,
    UsuariosModule

  ], // Add your entities here if needed
  controllers: [PdfReportController],
  providers: [PdfReportService],
})
export class PdfReportModule {}
