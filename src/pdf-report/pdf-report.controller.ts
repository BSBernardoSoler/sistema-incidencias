import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfReportService } from './pdf-report.service';
import { RegistrosService } from 'src/registros/registros.service';
import { AlertasService } from 'src/alertas/alertas.service';
import { ObservacionesService } from 'src/observaciones/observaciones.service';
import { HistorialCambiosService } from 'src/historial-cambios/historial-cambios.service';
import { MetasService } from 'src/metas/metas.service';

@Controller('pdf-report')
export class PdfReportController {
  constructor(private readonly pdfReportService: PdfReportService, 
    private readonly registrosService: RegistrosService,
    private readonly alertasService: AlertasService,
    private readonly observacionesService: ObservacionesService,
    private readonly historialCambiosService: HistorialCambiosService,
    private readonly metasService: MetasService) {}



  @Get('reporte/productividad')
async downloadProductivityReport(@Res() res: Response) {
  const data = await this.registrosService.findAllWithUsers();
  const pdfBuffer = await this.pdfReportService.generateProductivityReport(data);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=productividad.pdf');
  res.end(pdfBuffer);
}

@Get('reporte/alertas')
async downloadAlertsReport(@Res() res: Response) {
  const data = await this.alertasService.findAllAlerts();
  const pdfBuffer = await this.pdfReportService.generateAlertsReport(data);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=alertas.pdf');
  res.end(pdfBuffer);
}

@Get('reporte/historial-cambios')
async downloadChangeHistoryReport(@Res() res: Response) {
  const data = await this.historialCambiosService.findAllChangeHistory();
  const pdfBuffer = await this.pdfReportService.generateChangeHistoryReport(data);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=historial-cambios.pdf');
  res.end(pdfBuffer);
}

@Get('reporte/metas')
async downloadGoalsReport(@Res() res: Response) {
  const data = await this.metasService.findAllGoals();
  const pdfBuffer = await this.pdfReportService.generateGoalsReport(data);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=metas.pdf');
  res.end(pdfBuffer);
}

@Get('reporte/observaciones')
async downloadObservationsReport(@Res() res: Response) {
  const data = await this.observacionesService.findAllObservations();
  const pdfBuffer = await this.pdfReportService.generateObservationsReport(data);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=observaciones.pdf');
  res.end(pdfBuffer);
}




}
