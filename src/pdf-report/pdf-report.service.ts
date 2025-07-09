import { Injectable } from '@nestjs/common';
import * as path from 'path';
const PdfPrinter = require('pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');


@Injectable()
export class PdfReportService {
    private printer: any;

  constructor() {
    // ✅ Asigna el vfs cargado en memoria a PdfPrinter
    PdfPrinter.prototype.vfs = vfsFonts.vfs;

    this.printer = new PdfPrinter({
      Roboto: {
      normal: path.resolve(__dirname, '../assets/fonts/Roboto-Regular.ttf'),
      bold: path.resolve(__dirname, '../assets/fonts/Roboto-Medium.ttf'),
      italics: path.resolve(__dirname, '../assets/fonts/Roboto-Italic.ttf'),
       bolditalics: path.resolve(__dirname, '../assets/fonts/Roboto-MediumItalic.ttf'),
}
    });
  }

  async generatePdf(docDefinition: any): Promise<Buffer> {
    const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', (err) => reject(err));
      pdfDoc.end();
    });
  }

  async generateProductivityReport(data: any[]): Promise<Buffer> {
    const tableBody = [
      ['Usuario', 'Fecha', 'Registros', 'Hora Inicio', 'Hora Fin', 'Validación', 'Lote'],
      ...data.map((row) => [
        `${row.usuario.nombres} ${row.usuario.apellidos}`,
        row.fecha_digitacion,
        row.cantidad_registros,
        row.hora_inicio,
        row.hora_fin,
        row.estado_validacion,
        row.lote,
      ]),
    ];

    const docDefinition = {
      content: [
        { text: 'Reporte de Productividad de Digitadores', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    return this.generatePdf(docDefinition);
  }

  async generateAlertsReport(data: any[]): Promise<Buffer> {
    const tableBody = [
      ['Tipo Alerta', 'Descripción', 'Fecha Generada', 'Resuelta'],
      ...data.map((row) => [
        row.tipo_alerta,
        row.descripcion,
        String(row.fecha_generada),
        row.resuelta ? 'Sí' : 'No',
      ]),
    ];

    const docDefinition = {
      content: [
        { text: 'Reporte de Alertas Generadas', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    return this.generatePdf(docDefinition);
  }

  async generateChangeHistoryReport(data: any[]): Promise<Buffer> {
    const tableBody = [
      ['Campo', 'Valor Anterior', 'Valor Nuevo', 'Fecha', 'Usuario'],
      ...data.map((row) => [
        row.campo_modificado,
        row.valor_anterior,
        row.valor_nuevo,
        String(row.fecha_modificacion),
        `${row.usuarioModifica.nombres} ${row.usuarioModifica.apellidos}`,
      ]),
    ];

    const docDefinition = {
      content: [
        { text: 'Reporte de Historial de Cambios', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    return this.generatePdf(docDefinition);
  }

  async generateGoalsReport(data: any[]): Promise<Buffer> {
    const tableBody = [
      ['Mes', 'Meta Diaria', 'Meta Mensual', 'Usuario', 'Fecha Registro'],
      ...data.map((row) => [
        row.mes,
        row.meta_diaria,
        row.meta_mensual,
        `${row.usuario.nombres} ${row.usuario.apellidos}`,
        String(row.fecha_registro),
      ]),
    ];

    const docDefinition = {
      content: [
        { text: 'Reporte de Metas de Digitación', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    return this.generatePdf(docDefinition);
  }

  async generateObservationsReport(data: any[]): Promise<Buffer> {
    const tableBody = [
      ['Detalle', 'Estado', 'Respuesta', 'Fecha Observación', 'Usuario'],
      ...data.map((row) => [
        row.detalle_observacion,
        row.estado,
        row.respuesta_digitador ?? 'Sin respuesta',
        String(row.fecha_observacion),
        `${row.usuarioReporta.nombres} ${row.usuarioReporta.apellidos}`,
      ]),
    ];

    const docDefinition = {
      content: [
        { text: 'Reporte de Observaciones y Respuestas', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    return this.generatePdf(docDefinition);
  }
}
